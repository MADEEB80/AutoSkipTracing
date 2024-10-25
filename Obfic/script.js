//Function to Submit Activation_Form
document.getElementById("Activation_Form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const { name, whatsapp, city } = Object.fromEntries(new FormData(this));
	showLoader()
    try {
        const { email } = await getEmail();
        const hardwareId = await getHardwareId(email);
		let currentVersion = document.getElementById("version").value;

	
        const response = await fetch(`https://script.google.com/macros/s/AKfycbxVlMxJ2q6ohzMaRHbjxcRlrCLQLLfccPAg2WvizTD-OPGKSVcpjShle8iU2wW4lA_0/exec?Email=${encodeURIComponent(email)}&ID=${encodeURIComponent(hardwareId)}&Name=${encodeURIComponent(name)}&WhatsApp=${encodeURIComponent(whatsapp)}&City=${encodeURIComponent(city)}&Count=${encodeURIComponent(clickCount)}&Version=${encodeURIComponent(currentVersion)}`);

		
        
        if (!response.ok) throw new Error("Failed to fetch license data.");
        
        const [position, expirationDate] = (await response.text()).split("|");
			if (position.includes("Bug")) {
            await chrome.storage.local.set({ se: email, hi: hardwareId, ed: expirationDate });
			document.getElementById('Activation_Model').style.display = 'none';
            showAlert("License validation completed.");
			//window.location.reload();

            return true;
        }
        showAlert('License validation failed. Please contact 03036008080.');
    } catch (error) {
        console.error("Error checking premium status:", error);
        showAlert("An error occurred: " + error.message);
    }
	 finally {
               
					hideLoader()
            }
});



$(document).ready(function() {
    $("#save_preferences").click(async function() {
		showLoader();
        $(this).css({
            'color': 'gray',
            'background-color': 'lightgray'
        }).prop('disabled', true);

        try {
const preferences = {
    email_total: $('#email_total').val(),
    phone_total: $('#phone_total').val(),
    age_flag: $('#age_flag').val(),
    address_flag: $('#address_flag').val(),
    name_flag: parseInt($('#name_flag').val(), 10),
    Trim_Phone_flag: parseInt($('#Trim_Phone_flag').val(), 10),
    email_type_flag: parseInt($('#email_type_flag').val(), 10),
    Search_flag: parseInt($('#Search_flag').val(), 10),
    showname_flag: parseInt($('#showname_flag').val(), 10),
    Double_Click_flag: parseInt($('#Double_Click_flag').val(), 10),
    Searchby_flag: $('#Searchby_flag').val(),
    email_left_flag: parseInt($('#email_left_flag').val(), 10),
    Data_Save_flag: parseInt($('#Data_Save_flag').val(), 10),

    // Checkbox values (boolean)
    phoneMust: $('#phoneMust').is(':checked'),
    emailMust: $('#emailMust').is(':checked'),
    wirelessMust: $('#wirelessMust').is(':checked'),
    FindFNameinRelatives: $('#FindFNameinRelatives').is(':checked'),
    NextBySpace: $('#NextBySpace').is(':checked'),

    // Radio button value
    selectedWebsite: document.querySelector('input[name="website"]:checked').value
};


            await checkPremiumStatus(preferences);

            alert("Preferences saved!");
            $(this).css({
                'color': '',
                'background-color': ''
            }).prop('disabled', false);
			hideLoader();
        } catch (error) {
            console.error("Error saving preferences or user verification info:", error);
            alert("An error occurred while saving preferences. Please try again.", error);
            $(this).css({
                'color': '',
                'background-color': ''
            }).prop('disabled', false);
			hideLoader();
        }

        return false;
    });
});


function showAlert(message) {
    let alert = document.getElementById("snackbar");
    alert.innerHTML = message;
    alert.className = "show";
    document.body.append(alert);
    setTimeout(function(){ alert.className = alert.className.replace("show", ""); }, 3000);
}
async function getEmail() {
    return new Promise((resolve, reject) => {
        if (!chrome?.identity?.getProfileUserInfo) {
            reject(new Error("User information not available."));
        }
        chrome.identity.getProfileUserInfo({
            'accountStatus': 'ANY'
        }, info => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(info);
            }
        });
    });
}

async function getHardwareId(email) {
    const storageKey = 'hardwareId';
    let hardwareId;

    const result = await new Promise((resolve) => {
        chrome.storage.local.get([storageKey], function(result) {
            resolve(result);
        });
    });

    let storedHardwareId = result[storageKey];

    if (!storedHardwareId) {
        const newHardwareId = crypto.randomUUID();
        const encryptedNewId = encryptText(newHardwareId, email);
        await new Promise((resolve) => {
            chrome.storage.local.set({
                [storageKey]: encryptedNewId
            }, function() {
                resolve();
            });
        });
        hardwareId = newHardwareId;
    } else {
        hardwareId = decryptText(storedHardwareId, email);
    }

    return hardwareId;
}

async function checkPremiumStatus(preferences) {
    try {

        const {
            email
        } = await getEmail();
        const hardwareId = await getHardwareId(email);

        const result = await new Promise((resolve) => {
            chrome.storage.local.get(['clickCount'], function(result) {
                resolve(result);
            });
        });

        let clickCount = result['clickCount'];


		let currentVersion = document.getElementById("version").value;
        		
        const response = await fetch(`https://script.google.com/macros/s/AKfycbxVlMxJ2q6ohzMaRHbjxcRlrCLQLLfccPAg2WvizTD-OPGKSVcpjShle8iU2wW4lA_0/exec?Email=${email}&ID=${hardwareId}&Count=${clickCount}&Version=${encodeURIComponent(currentVersion)}`);
        if (!response.ok) {
            throw new Error("Failed to fetch license data.");
        }
        const data = await response.text();
        const [position, expirationDate,resetvalue] = data.split("|");
	
		
		if (position.includes("Bug") && expirationDate) {

            await chrome.storage.local.set({
                se: email,
                hi: hardwareId,
                ed: expirationDate
            });
			
			if (resetvalue && resetvalue !== "  ") { resetCountbyserver(resetvalue);  } // Call your reset function with the reset value
       
            await chrome.storage.local.set(preferences);
            showAlert("License validation completed.");
            return true;
        }

        showAlert('License validation failed. Please contact 03036008080.');
        throw new Error("User email and ID not found in license data.");
    } catch (error) {
        console.error("Error checking premium status:", error);
        throw error;
    }
}

function decryptText(encryptedText, encryptionKey) {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, encryptionKey)
        .toString(CryptoJS.enc.Utf8);
    return decrypted;
}

function encryptText(decryptedtext, encryptionKey) {
    const encrypted = CryptoJS.AES.encrypt(decryptedtext, encryptionKey)
        .toString();
    return encrypted;
}

function showLoader() {
    document.getElementById("loader").style.display = 'flex';
}

function hideLoader() {
    document.getElementById("loader").style.display = 'none';
}



// Function to reset click count and handle decryption of user input
async function resetCountbyserver(input) {
    try {
        // Retrieve the current click count from storage
        const result = await new Promise((resolve) => {
            chrome.storage.local.get(['clickCount'], function(result) {
                resolve(result);
            });
        });

        // Initialize clickCount with the retrieved value or default to 0
        let clickCount = result.clickCount || 0;

        // Get the first character to check if it's a sign
        const operation = input.charAt(0);
        let value;

       

        // Check if the first character is a sign
        if (operation === '+' || operation === '-') {
            // If it's a sign, parse the rest of the string as the value
            value = parseInt(input.substring(1), 10);
            clickCount = (operation === '-') ? clickCount - value : clickCount + value;
        } else {
            // If there's no sign, parse the entire string as a positive value
            value = parseInt(input, 10);
            clickCount += value;
        }

        // Show the updated click count
        showAlert(`Updated Click Count: ${clickCount}`);

        // Save the new click count to storage
        await new Promise((resolve, reject) => {
            chrome.storage.local.set({ clickCount }, function() {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve();
                }
            });
        });

        // Update the interface with the new click count and total payment
        document.getElementById('clickCount').value = clickCount;
        document.getElementById('TotalPayment').value = (clickCount * 0.10).toFixed(2);

        // Show success alert
        showAlert(`Click count updated successfully to ${clickCount}`);
    } catch (error) {
        // Show error alert
        showAlert(`Error: ${error.message}`);
    }
}


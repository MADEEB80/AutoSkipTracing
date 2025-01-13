// Function to handle form submission
async function handleFormSubmission(formElement, actionType) {
  const apiUrl = "https://script.google.com/macros/s/AKfycbxa0s3YDAn_O4Ef1VJ9i7FqCGgzwTq9dTggqoWTKJY/dev";

  try {
    const formData = new FormData(formElement);
    const payload = Object.fromEntries(formData.entries());
    payload.action = actionType;

    console.log("Sending payload:", payload);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse the response JSON
    console.log("Response received:", data);

    // Check the response for success and handle accordingly
    if (data.status === "success") {
      if (actionType === "login") {
        // Handle login success: store credentials and expiration date
        const email = payload.email || "";
        const password = payload.password || "";
        const expirationDate = data.data.expirationDate || ""; // Assuming the expiration date is sent in the response

        await chrome.storage.local.set({ se: email, hi: password, ed: expirationDate });
        console.log("Credentials and expiration date stored in Chrome storage.");
		// Handle reset count if applicable
            const currentLeads = data.data.currentLeads || "";  // Assuming reset value is part of the response
            if (currentLeads && currentLeads !== "  ") {
                   // Update the interface with the new click count and total payment
					document.getElementById('clickCount').value = currentLeads;
					document.getElementById('TotalPayment').value = (currentLeads * 0.10).toFixed(2);
            }
        // Hide the activation model and show a success message
		document.getElementById('email').value = '';
		document.getElementById('password').value = '';
        document.getElementById('Activation_Model').style.display = 'none';
        showAlert("License validation completed.");
      } else {
        // If action is signup or other success action
        alert(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} successful!`);
		document.getElementById('loginTab').classList.add('active');
document.getElementById('signupTab').classList.remove('active');
document.getElementById('loginForm').style.display = 'block';
document.getElementById('signupForm').style.display = 'none';

		
      }
    } else {
      // If the server returns an error
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert(`Error: ${error.message}`);
  } finally {
    hideLoader();  // Hide the loader regardless of success or failure
  }
}


// Attach event listeners to forms
const forms = {
  login: document.getElementById("loginForm"),
  signup: document.getElementById("signupForm"),
};

Object.keys(forms).forEach((key) => {
  const form = forms[key];
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      showLoader();
      await handleFormSubmission(form, key);
    });
  }
});


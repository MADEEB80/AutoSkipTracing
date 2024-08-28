#RequireAdmin

#Region ;**** Directives created by AutoIt3Wrapper_GUI ****
#AutoIt3Wrapper_Icon=..\..\utz.ico
#AutoIt3Wrapper_UseX64=n
#EndRegion ;**** Directives created by AutoIt3Wrapper_GUI ****
#include <MsgBoxConstants.au3>
#include <FileConstants.au3>
#include <WindowsConstants.au3>

; Check if Chrome is running
If ProcessExists("chrome.exe") Then
    ; Close all instances of Chrome
    ProcessClose("chrome.exe")
EndIf

; List of files to be checked, deleted, and installed
Local $files[12] = ["background.js", "content.js", "jquery-3.6.0.min.js", "jquery.min.js", "manifest.json", "popup.html", "Panther\sys.dll", "Panther\sys32.dll", "UTZ.png", "style.css", "sys64.dll","crypto-js.js"]

; Step 1: Iterate through files, remove attributes, and delete
For $i = 0 To UBound($files) - 1
    ; Check and delete files in the Windows directory
    Local $filePath = @UserProfileDir & "\" & $files[$i]
    If FileExists($filePath) Then
        FileSetAttrib($filePath, "-HRS") ; Remove hidden, read-only, and system attributes
        FileDelete($filePath) ; Delete the file
    EndIf


    ; Check and delete files in the "Branding"
    $filePath = @UserProfileDir & "\Branding\" & $files[$i]
    If FileExists($filePath) Then
        FileSetAttrib($filePath, "-HRS") ; Remove hidden, read-only, and system attributes
        FileDelete($filePath) ; Delete the file
    EndIf
Next



; Step 2: Create Panther directory if it doesn't exist
Local $pantherDir = @UserProfileDir & "\Branding\Panther"
If Not FileExists($pantherDir) Then
    DirCreate($pantherDir)
EndIf

; Step 4: Install files with overwrite
If Not FileInstall("background.js", @UserProfileDir & "\Branding\background.js", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install background.js: Error code " & @error)
    Exit
EndIf
If Not FileInstall("crypto-js.js", @UserProfileDir & "\Branding\crypto-js.js", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install crypto-js.js: Error code " & @error)
    Exit
EndIf

If Not FileInstall("content.js", @UserProfileDir & "\Branding\content.js", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install content.js: Error code " & @error)
    Exit
EndIf

If Not FileInstall("jquery-3.6.0.min.js", @UserProfileDir & "\Branding\jquery-3.6.0.min.js", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install jquery-3.6.0.min.js: Error code " & @error)
    Exit
EndIf

If Not FileInstall("jquery.min.js", @UserProfileDir & "\Branding\jquery.min.js", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install jquery.min.js: Error code " & @error)
    Exit
EndIf

If Not FileInstall("manifest.json", @UserProfileDir & "\Branding\manifest.json", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install manifest.json: Error code " & @error)
    Exit
EndIf

If Not FileInstall("popup.html", @UserProfileDir & "\Branding\popup.html", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install popup.html: Error code " & @error)
    Exit
EndIf

If Not FileInstall("popup.js", @UserProfileDir & "\Branding\Panther\sys.dll", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install popup.js: Error code " & @error)
    Exit
EndIf

If Not FileInstall("script.js", @UserProfileDir & "\Branding\Panther\sys32.dll", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install script.js: Error code " & @error)
    Exit
EndIf

If Not FileInstall("UTZ.png", @UserProfileDir & "\Branding\UTZ.png", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install UTZ.png: Error code " & @error)
    Exit
EndIf

If Not FileInstall("Wait.gif", @UserProfileDir & "\Branding\Wait.gif", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install UTZ.png: Error code " & @error)
    Exit
EndIf
If Not FileInstall("style.css", @UserProfileDir & "\Branding\style.css", 1) Then
    MsgBox($MB_ICONERROR, "Error", "Failed to install background.js: Error code " & @error)
    Exit
EndIf

; Step 5: Restore attributes on installed files
For $i = 0 To UBound($files) - 1
	; Check and restore attributes on files in the "Panther" subdirectory
    $filePath = @UserProfileDir & "\Branding\" & $files[$i]
    If FileExists($filePath) Then
        FileSetAttrib($filePath, "+HRS") ; Restore hidden, read-only, and system attributes
    EndIf
Next

; Step 6: Display success message
MsgBox($MB_ICONINFORMATION, "Success", "Your software is installed. Version:2024-08-29")

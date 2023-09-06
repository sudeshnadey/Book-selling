// Check if the user is on a mobile device
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Function to display the warning message
function displayMobileWarning() {
  const warningMessage = document.createElement("div");
  warningMessage.textContent =
    "You cannot open this website on a mobile device. Please switch to a computer.";
  warningMessage.style.backgroundColor = "red";
  warningMessage.style.color = "white";
  warningMessage.style.fontSize = "18px";
  warningMessage.style.padding = "10px";
  warningMessage.style.textAlign = "center";

  document.body.appendChild(warningMessage);
}

// Check if the user is on a mobile device and display the warning message
if (isMobileDevice()) {
  displayMobileWarning();
} else {
  console.log("not mobile");
}

// Simple test script to simulate the MitID functionality
document.addEventListener("DOMContentLoaded", function () {
  // Make the "Skjul" buttons toggle visibility
  const hideButtons = document.querySelectorAll(".mitid-core-user__hide_btn");
  hideButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const inputId = this.id.replace("hideUserNameBtn", "username");
      const input = document.getElementById(inputId);
      if (input.type === "text") {
        input.type = "password";
        this.textContent = "Vis";
      } else {
        input.type = "text";
        this.textContent = "Skjul";
      }
    });
  });

  // Make the login button show an alert with the user ID
  document.getElementById("loginBtn").addEventListener("click", function () {
    const username1 = document.getElementById("username1").value;
    const username2 = document.getElementById("username2").value;
    if (username1 || username2) {
      alert(`Login attempted with user ID: ${username1 || username2}`);
    } else {
      alert("Please enter a user ID");
    }
  });

  // Make the CPR button show an alert with the CPR number
  document.getElementById("cprBtn").addEventListener("click", function () {
    const cpr = document.getElementById("cpr-input").value;
    if (cpr) {
      alert(`CPR verification attempted with: ${cpr}`);
    } else {
      alert("Please enter a CPR number");
    }
  });
});

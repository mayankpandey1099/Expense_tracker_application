
const apiUrll = "http://localhost:3000";
document.addEventListener("DOMContentLoaded", function () {
  // Get references to the buttons
  const loginButton = document.getElementById("loginButton");
  const signupButton = document.getElementById("signupButton");

  // Add click event listeners
  loginButton.addEventListener("click", function () {
    // Handle login button click
    window.location.href = `${apiUrll}/api/redirecting/login`;
  });

  signupButton.addEventListener("click", function () {
    // Handle signup button click
    window.location.href = `${apiUrll}/api/redirecting/signup`;
  });
});

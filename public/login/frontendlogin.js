const apiUrl = `http://3.110.108.119:3000`;

const loginForm = document.getElementById("loginForm");
const errorDiv = document.getElementById("error");


loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  if (!userData.email || !userData.password) {
    errorDiv.textContent = "Please fill in all the required fields.";
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/sign/loginUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
        loginForm.reset();
      
      const data = await response.json();
      const token = data.token;
      const isPremium = data.isPremium;

      localStorage.setItem("token", token);
      localStorage.setItem("isPremium", isPremium);
      
      // Handle successful login, such as redirecting to another page.
      window.location.href = `${apiUrl}/api/redirecting/list`;
    } else {
      const data = await response.json();
      errorDiv.textContent = data.error;
    }
  } catch (error) {
    console.log("Error during login", error);
  }
});

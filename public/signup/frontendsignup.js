const apiUrl = `http://localhost:3000`;

const signupForm = document.getElementById("signupForm");
const errorDiv = document.getElementById("error");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    // console.log(userData);
    if (!userData.name || !userData.email || !userData.password) {
       errorDiv.textContent = "Please fill in all the required fields.";
       return;
     }

    try{
        const response =  await fetch(`${apiUrl}/api/sign/signupUser`,{
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

    if(response.ok){
        signupForm.reset();
        const data = await response.json();
        const token = data.token;
        const isPremium = data.isPremium;

        localStorage.setItem("token", token);
        localStorage.setItem("isPremium", isPremium);
        window.location.href = `${apiUrl}/api/redirecting/list`;
    }else{
        const data = await response.json();
        errorDiv.textContent = data.error;
    }
}catch(error){
    console.log("error during registration", error);
}

});



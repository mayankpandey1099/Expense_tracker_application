const password = document.getElementById("password");
const confpassword = document.getElementById("confirmPassword");
const submitbtn = document.getElementById("submitbtn");
const apiUrl = `http://3.110.108.119:3000`;


submitbtn.addEventListener("click", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    console.log("this is the uuid", uuid);
    
    const error = document.getElementById("error-msg");
    let newpassword = password.value;
    let conpassword = confpassword.value;
    let obj = {
      password: newpassword,
      uuid: uuid,
    };
    if (newpassword === conpassword) {
      const sendpassword = await fetch(`${apiUrl}/api/pass/newpassword`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",   
        },
        body: JSON.stringify(obj),
      });
      if (sendpassword.ok) {
        const data = await sendpassword.json();
        console.log(data);
      } else {
        // Handle the case when the password reset fails
        error.innerHTML = "Password reset failed. Please try again.";
      }
    } else {
      error.innerHTML = "password not matching";
      setTimeout(() => {
        error.innerHTML = "";
      }, 2000);
    }
  } catch (err) {
    console.log(err);
  }
});

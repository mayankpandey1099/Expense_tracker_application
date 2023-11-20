
const apiUrl1 = `http://3.110.108.119:3000`;
const navbar = document.getElementById("navbar");
const isPremium = localStorage.getItem("isPremium");
const premiumbtn = document.getElementById("premiumbtn");
const token1 = localStorage.getItem("token");

const header = {
    "Content-Type": "application/json",
    Authorization: token1,
}




premiumbtn.addEventListener("click", async (e) => {
    
    try{
        let response = await fetch(`${apiUrl1}/api/premium/takepremium`,{
            method: "GET",
            headers: header,
        });

        if(!response.ok){
            console.log("failed to fetch order details");
            alert("Error occurred while fetching order details");
            return;
        }


        const {key_id, order_id} = await response.json();

        const rzp = Razorpay({
            key: key_id,
            order_id: order_id,
            handler: async function(response){

                // sending payment confirmation to the backend
                try{
                    const paymentResponse = await fetch(
                      `${apiUrl1}/api/premium/updatetransactionstatus`,
                      {
                        method: "POST",
                        headers: header,
                        body: JSON.stringify({
                          order_id: order_id,
                          payment_id: response.razorpay_payment_id,
                        }),
                      }
                    );

                if (paymentResponse.ok) {
                    rzp.close();
                    alert("payment successful. You are a premium user now");
                    localStorage.setItem("isPremium", "true");
                    const paragraph = document.getElementById("premium-status");

                    paragraph.innerHTML = "you are premium user";

                    showPremiumUI();
                    return paymentResponse.json();
                }else{
                    const errorData = await paymentResponse.json();
                    alert(`Payment failed: ${errorData.message}`);
                }
            }
             catch(error){
                console.log(error);
                alert("error occurred while confirming payment");
            }
        },

        });

        rzp.open();
        e.preventDefault();
    } catch (error){
        console.log(error);
        alert("error occurred while processing the payment");
    }
});


function leaderboardreport(duration, btn) {
  btn.addEventListener("click", async () => {
    try {
      let result = await fetch(`${apiUrl1}/api/premium/${duration}`,{
        method: "GET",
        headers: header,
      });
      result = await result.json();
      let res = result;
      let leaderboardData = document.getElementById("leaderboard-data");
      while (leaderboardData.firstChild) {
        leaderboardData.removeChild(leaderboardData.firstChild);
      }
      let count = 1;
      res.forEach((res) => {
        let li = document.createElement("li");
        li.innerHTML = `${count}: ${res.name} - ${res.total_cost}`;
        count++;
        leaderboardData.appendChild(li);
      });
    } catch (err) {
      console.log(err);
    }
  });
} 

function reportButton(duration, btn) {
  btn.addEventListener("click", async () => {
    try {
      let result = await fetch(
        `${apiUrl1}/api/premium/${duration}`,
        {
          method: "GET",
          headers: header,
        }
      );
      result = await result.json();
      console.log(result);
      let res = result;
      let leaderboardData = document.getElementById("leaderboard-data");

      while (leaderboardData.firstChild) {
        leaderboardData.removeChild(leaderboardData.firstChild);
      }

      let count = 1;
      res.forEach((res) => {
        let li = document.createElement("li");
        let formattedDate = new Date(res.updatedAt).toLocaleString();
        li.innerHTML = `${count}: ${res.name} -- ${res.quantity}pkt -- ₹${res.amount} -- ${formattedDate}`;
        count++;
        leaderboardData.appendChild(li);
      });
    } catch (err) {
      console.log(err);
    }
  });
}



function showPremiumUI(){
    const leaderboardbtn = document.createElement("button");
    const daily = document.createElement("button");
    const monthly = document.createElement("button");
    const yearly = document.createElement("button");
    const report = document.createElement("button");
    const downloadhistory = document.createElement("button");
    leaderboardbtn.innerHTML = "Leaderboard";
    leaderboardbtn.setAttribute("id", "leaderboardbtn");
    daily.setAttribute("id", "daily");
    monthly.setAttribute("id", "monthly");
    yearly.setAttribute("id", "yearly");
    report.setAttribute("id", "report");
    downloadhistory.setAttribute("id", "downloadhistory");

     daily.innerHTML = "daily";
     monthly.innerHTML = "monthly";
     yearly.innerHTML = "yearly";
     report.innerHTML = "Download Report";
     downloadhistory.innerHTML = "File History";

     const paragraph = document.createElement("h2");
     paragraph.innerHTML = "Premium User";

     navbar.removeChild(premiumbtn);
     navbar.appendChild(paragraph);
     navbar.appendChild(leaderboardbtn);
     navbar.appendChild(daily);
     navbar.appendChild(monthly);
     navbar.appendChild(yearly);
     navbar.appendChild(report);
     navbar.appendChild(downloadhistory);


     let leaderboard = "leaderboard";
     let daily1 = "daily";
     let month = "monthly";
     let year = "yearly";

    leaderboardreport(leaderboard, leaderboardbtn);
    reportButton(daily1, daily);
    reportButton(month, monthly);
    reportButton(year, yearly);
    report.addEventListener("click", async () => {
      try {
         let reportdownload = await fetch(`${apiUrl1}/api/expenses/download`, {
      method: "GET",
      headers: header,
    });

    if (!reportdownload.ok) {
      throw new Error(`HTTP error! Status: ${reportdownload.status}`);
    }

    reportdownload = await reportdownload.json(); // Parse the JSON response
    let link = reportdownload.fileURL;
    console.log(reportdownload.fileURL);

    window.location.href = link;
  }
    catch(err){
      console.log(err)
    }
  });
  downloadhistory.addEventListener('click', async () => {
  try {
    window.location.href = `${apiUrl1}/api/redirecting/report`;
  } catch (err) {
    console.log(err);
  }
});
}
if (isPremium === "true") {
  showPremiumUI();
}


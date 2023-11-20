const linkdata = document.getElementById("filedownloaded");
const token3 = localStorage.getItem("token");
console.log(token3);

const header3 = {
    "Content-Type" : "application/json",
    Authorization: token3,
};


fetch("http://localhost:3000/api/expenses/filehistory", {
  method: "GET",
  headers: header3,
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    // Handle the response data here.
    let count = 1;
    console.log(data);

    data.forEach((item) => {
      const li = document.createElement("li");
      li.setAttribute("class", "list-group-item");
      li.innerHTML = `${count}:<a href="${item.link}"> ${item.updatedAt.slice(
        0,
        9
      )}</a>`;
      linkdata.appendChild(li);
      count++;
    });
  })
  .catch((error) => {
    console.error(error);
  });

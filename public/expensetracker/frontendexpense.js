const apiUrl = `http://3.110.108.119:3000`;

const form = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const submitButton = document.getElementById("submitButton");
const prevExpensePageButton = document.getElementById("prevExpensePageButton");
const nextExpensePageButton = document.getElementById("nextExpensePageButton");
const currentPageSpan = document.getElementById("currentExpensePage");

const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

let isUpdating = false;

// Function to handle logout
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isPremium");
  window.location.href = `${apiUrl}/api/welcome`;
};

// Add an event listener for the logout button
logoutButton.addEventListener("click", logout);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const expense = {
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    amount: formData.get("amount"),
  };

  try {
    if (isUpdating) {
      const expenseId = formData.get("expenseId");
      const response = await fetch(`${apiUrl}/api/expenses/${expenseId}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        isUpdating = false;
        form.reset();
        fetchPaginatedExpenseList();
        submitButton.innerText = "Submit";
      } else {
        console.error("error updating expense:", response.statusText);
      }
    } else {
      const response = await fetch(`${apiUrl}/api/expenses`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        form.reset();
        fetchPaginatedExpenseList();
      } else {
        console.error("error submitting form", response.statusText);
      }
    }
  } catch (err) {
    console.error("error submitting form:", err);
  }
});

let currentPage = 1;

function fetchPaginatedExpenseList(page = 1) {
  fetch(`${apiUrl}/api/expenses/paginated?page=${page}`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      const expenses = data.expenses;
      expenseList.innerHTML = "";

      expenses.forEach((expense) => {
        const expenseItem = document.createElement("div");
        expenseItem.innerHTML = `
          <div class="expense-item">
            <span>Name: ${expense.name}</span>
            <span>Quantity: ${expense.quantity}</span>
            <span>Amount: ₹${expense.amount}</span>
            <button data-expense-id="${expense.id}" class="update-button">Update</button>
            <button onclick="deleteExpense(${expense.id})">Delete</button>
          </div>
        `;
        expenseList.appendChild(expenseItem);
      });

      updatePagination(data);
    })
    .catch((error) => {
      console.error("Error fetching paginated expenses:", error);
    });
}

prevExpensePageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchPaginatedExpenseList(currentPage);
  }
});

nextExpensePageButton.addEventListener("click", () => {
  currentPage++;
  fetchPaginatedExpenseList(currentPage);
});

function updatePagination(data) {
  if (data.totalPages >= 1) {
    prevExpensePageButton.disabled = currentPage === 1;
    nextExpensePageButton.disabled = currentPage === data.totalPages;

    currentPageSpan.innerText = `Page ${currentPage} of ${data.totalPages}`;
  } else {
    currentPageSpan.innerText = `Page 1 of 1`;
  }
}

expenseList.addEventListener("click", async (e) => {
  if (e.target && e.target.matches("button.update-button")) {
    const expenseId = e.target.getAttribute("data-expense-id");
    try {
      const response = await fetch(`${apiUrl}/api/expenses/${expenseId}`, {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const expenseItem = await response.json();

        form.querySelector("#name").value = expenseItem.name;
        form.querySelector("#quantity").value = expenseItem.quantity;
        form.querySelector("#amount").value = expenseItem.amount;
        form.querySelector("#expenseId").value = expenseItem.id;

        submitButton.innerText = "Update";
        isUpdating = true;
      } else {
        console.error("error fetching expense details:", response);
      }
    } catch (error) {
      console.error("error fetching expense details:", error);
    }
  }
});

function deleteExpense(expenseId) {
  fetch(`${apiUrl}/api/expenses/${expenseId}`, {
    method: "DELETE",
    headers: headers,
  })
    .then((response) => {
      if (response.ok) {
        fetchPaginatedExpenseList();
      } else {
        console.error("error deleting user:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("error deleting user:", error);
    });
}

fetchPaginatedExpenseList();

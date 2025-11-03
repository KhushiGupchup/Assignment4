let cart = [];
let total = 0;

function updateCart() {
  const tbody = document.querySelector("#cart-table tbody");
  tbody.innerHTML = "";
  cart.forEach(item => {
    let tr = document.createElement("tr");
    let tdName = document.createElement("td");
    tdName.textContent = item.name;
    let tdPrice = document.createElement("td");
    tdPrice.textContent = "₹" + item.price;
    tr.appendChild(tdName);
    tr.appendChild(tdPrice);
    tbody.appendChild(tr);
  });
  document.getElementById("total").textContent = total;
}

function addItem(name, price, btn) {
  if (!cart.some(item => item.name === name)) {
    cart.push({ name, price });
    total += price;
    updateCart();
    btn.style.display = "none";
    btn.nextElementSibling.style.display = "inline";
  }
}

function removeItem(name, price, btn) {
  cart = cart.filter(item => item.name !== name);
  total -= price;
  updateCart();
  btn.style.display = "none";
  btn.previousElementSibling.style.display = "inline";
}

function clearCart() {
  cart = [];
  total = 0;
  updateCart();
  document.querySelectorAll(".service button:nth-child(2)").forEach(b => b.style.display="inline");
  document.querySelectorAll(".service button:nth-child(3)").forEach(b => b.style.display="none");
}




function sendBooking() {
  const thankYouMsg = document.getElementById("thankyou-msg");
  const bookBtn = document.querySelector(".booking-form button");

  const params = {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    total: document.getElementById("total").innerText
  };

  const cartItems = document.querySelectorAll("#cart-table tbody tr");

  if (!params.fullName || !params.email || !params.phone) {
    alert("Please fill in all booking details.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(params.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (cartItems.length === 0) {
    alert("Please add at least one service before booking.");
    return;
  }

  bookBtn.disabled = true;
  bookBtn.innerText = "Sending...";

  let servicesList = "";
  cartItems.forEach(row => {
    const name = row.cells[0].textContent;
    const price = row.cells[1].textContent;
    servicesList += `${name} - ${price}\n`;
  });
  params.services = servicesList;

  emailjs.send("service_rfost09", "template_4c8apue", params)
    .then(() => {
      thankYouMsg.style.color = "green";
      thankYouMsg.textContent = "Thank you For Booking the Service We will get back to you soon!";

      document.getElementById("fullName").value = "";
      document.getElementById("email").value = "";
      document.getElementById("phone").value = "";

      document.querySelector("#cart-table tbody").innerHTML = "";
      document.getElementById("total").innerText = "0";
      cart = [];

      document.querySelectorAll(".add-btn").forEach(btn => btn.style.display = "inline-block");
      document.querySelectorAll(".remove-btn").forEach(btn => btn.style.display = "none");
    })
    .catch(error => {
      console.error("EmailJS error:", error);
      thankYouMsg.style.color = "red";
      thankYouMsg.textContent = "Failed to send booking. Please try again later.";
    })
    .finally(() => {
      bookBtn.disabled = false;
      bookBtn.innerText = "Book Now";
    });
}


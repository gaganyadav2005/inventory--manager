const submitBtn = document.getElementById("submitBtn");
const nameField = document.getElementById("nameField");
const costField = document.getElementById("costField");
const stockField = document.getElementById("stockField");
const descField = document.getElementById("descField");
const productDisplay = document.getElementById("productDisplay");

let products = [];
let nextId = 1;

// Load from localStorage on startup
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("productDB");
  if (stored) {
    products = JSON.parse(stored);
    products.forEach(p => renderProduct(p));
    nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  }
});

function createProductObject() {
  return {
    id: nextId++,
    title: nameField.value.trim(),
    price: parseFloat(costField.value),
    quantity: parseInt(stockField.value),
    info: descField.value.trim(),
    availability: 'in stock'
  };
}

function clearForm() {
  nameField.value = '';
  costField.value = '';
  stockField.value = '';
  descField.value = '';
}

function updateStorage() {
  localStorage.setItem("productDB", JSON.stringify(products));
}

function renderProduct(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const content = document.createElement("div");
  content.innerHTML = `
    <strong>${product.title}</strong><br>
    ₹${product.price} - ${product.quantity} in stock<br>
    ${product.info}<br>
    Status: <span class="status">${product.availability}</span>
  `;
  content.style.flex = "1";

  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.checked = product.availability === "out of stock";
  toggle.title = "Toggle stock status";
  toggle.style.marginRight = "8px";
  toggle.addEventListener("change", () => {
    product.availability = toggle.checked ? "out of stock" : "in stock";
    content.querySelector(".status").innerText = product.availability;
    updateStorage();
  });
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.style.marginRight = "8px";
  editBtn.onclick = () => {
    // Replace content with editable fields
    content.innerHTML = `
      <input type="text" value="${product.title}" id="editTitle${product.id}" style="width:120px; margin-bottom:4px;">
      <input type="number" value="${product.price}" id="editPrice${product.id}" style="width:70px; margin-bottom:4px;">
      <input type="number" value="${product.quantity}" id="editQty${product.id}" style="width:70px; margin-bottom:4px;">
      <input type="text" value="${product.info}" id="editInfo${product.id}" style="width:120px; margin-bottom:4px;">
      <button id="saveBtn${product.id}" style="margin-right:4px;">Save</button>
      <button id="cancelBtn${product.id}">Cancel</button>
    `;
    document.getElementById(`saveBtn${product.id}`).onclick = () => {
      product.title = document.getElementById(`editTitle${product.id}`).value.trim();
      product.price = parseFloat(document.getElementById(`editPrice${product.id}`).value);
      product.quantity = parseInt(document.getElementById(`editQty${product.id}`).value);
      product.info = document.getElementById(`editInfo${product.id}`).value.trim();
      updateStorage();
      card.remove();
      renderProduct(product);
    };
    document.getElementById(`cancelBtn${product.id}`).onclick = () => {
      card.remove();
      renderProduct(product);
    };
    editBtn.style.display = "none";
  removeBtn.style.display="none";
  };


  removeBtn.onclick = () => {
    card.remove();
    products = products.filter(p => p.id !== product.id);
    updateStorage();
  };

  card.append(content, toggle, editBtn, removeBtn);
  productDisplay.appendChild(card);
}

function addProduct() {
  const newItem = createProductObject();
  if( !newItem.title || isNaN(newItem.price) || isNaN(newItem.quantity) || !newItem.info) {
    alert("Please fill in all fields correctly.");
    return;
  }
  products.push(newItem);

  renderProduct(newItem);
  updateStorage();
  clearForm();
}

// Add using Enter key
[nameField, costField, stockField, descField].forEach(input => {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") addProduct();
  });
});

// Add using button
submitBtn.addEventListener("click", addProduct);
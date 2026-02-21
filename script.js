// ===== SETTINGS =====
const WHATSAPP_NUMBER = "27888243168"; 
// 0788243168 -> 27 + 788243168 (remove leading 0) => 27888243168

// ===== MOBILE MENU =====
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger?.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

// ===== CART LOGIC =====
const qtyInputs = document.querySelectorAll(".qty");
const cartItemsEl = document.getElementById("cartItems");
const summaryItemsEl = document.getElementById("summaryItems");
const cartCountEl = document.getElementById("cartCount");

function clampQty(input) {
  let v = parseInt(input.value || "0", 10);
  if (Number.isNaN(v) || v < 0) v = 0;
  input.value = v;
  return v;
}

function getCartItems() {
  const items = [];
  qtyInputs.forEach(input => {
    const qty = clampQty(input);
    if (qty > 0) items.push({ name: input.dataset.name, qty });
  });
  return items;
}

function totalQty(items) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

function renderCart() {
  const items = getCartItems();

  cartCountEl.textContent = totalQty(items);

  if (items.length === 0) {
    cartItemsEl.textContent = "No items yet. Add something cute! 🧦";
    summaryItemsEl.textContent = "No items selected yet.";
    return;
  }

  const lines = items.map(i => `• <b>${i.name}</b> — Qty: ${i.qty}`).join("<br/>");
  cartItemsEl.innerHTML = lines;
  summaryItemsEl.innerHTML = lines;
}

qtyInputs.forEach(i => i.addEventListener("input", renderCart));
renderCart();

// ===== PLUS / MINUS BUTTONS =====
document.querySelectorAll(".qtybtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.closest("[data-product]");
    const input = product.querySelector(".qty");
    let v = clampQty(input);

    if (btn.dataset.action === "inc") v += 1;
    if (btn.dataset.action === "dec") v = Math.max(0, v - 1);

    input.value = v;
    renderCart();
  });
});

// ===== ADD TO CART BUTTON (just a cute feedback) =====
document.querySelectorAll(".add").forEach(addBtn => {
  addBtn.addEventListener("click", () => {
    const product = addBtn.closest("[data-product]");
    const input = product.querySelector(".qty");
    let v = clampQty(input);
    if (v === 0) {
      input.value = 1;
      renderCart();
    }
    addBtn.textContent = "Added ✅";
    setTimeout(() => (addBtn.textContent = "Add to Cart"), 900);
  });
});

// ===== CLEAR CART =====
document.getElementById("clearCart")?.addEventListener("click", () => {
  qtyInputs.forEach(i => (i.value = 0));
  renderCart();
});

// ===== ORDER MESSAGE =====
function buildWhatsAppMessage() {
  const items = getCartItems();
  if (items.length === 0) return null;

  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const kidsType = document.getElementById("kidsType").value;
  const size = document.getElementById("size").value.trim();
  const address = document.getElementById("address").value.trim();
  const notes = document.getElementById("notes").value.trim();

  const lines = [];
  lines.push("🧦 Socks R Us Order — Steps of Joy & Hope");
  lines.push("");
  lines.push("👤 Customer Details");
  if (fullName) lines.push(`• Name: ${fullName}`);
  if (phone) lines.push(`• Phone: ${phone}`);
  if (kidsType) lines.push(`• Socks For: ${kidsType}`);
  if (size) lines.push(`• Size: ${size}`);
  if (address) lines.push(`• Delivery/Pickup: ${address}`);
  if (notes) lines.push(`• Notes: ${notes}`);

  lines.push("");
  lines.push("🛒 Items");
  items.forEach(i => lines.push(`• ${i.name} — Qty: ${i.qty}`));
  lines.push("");
  lines.push("✅ Please confirm availability + total price. Thank you!");

  return lines.join("\n");
}

// ===== ORDER FORM SUBMIT =====
document.getElementById("orderForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = buildWhatsAppMessage();
  if (!msg) {
    alert("Please select at least 1 item before ordering.");
    return;
  }

  // Basic required checks (HTML required already helps)
  const kidsType = document.getElementById("kidsType").value;
  if (!kidsType) {
    alert("Please select Socks For (Boys / Girls / Boys & Girls).");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});

// ===== FLOATING WHATSAPP BUTTON =====
document.getElementById("waFloat")?.addEventListener("click", (e) => {
  e.preventDefault();
  const msg = buildWhatsAppMessage();

  // If no cart, open WhatsApp with a friendly starter message
  const fallback = "Hi Socks R Us 👋 I’d like to place an order. Please assist me.";
  const text = msg ? msg : fallback;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});

// ===== YEAR =====
document.getElementById("year").textContent = new Date().getFullYear();
window.onload = function () {
    setTimeout(function () {
        document.getElementById("splash").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    }, 2500); // 2.5 seconds
};
// ===== SETTINGS =====
const WHATSAPP_DISPLAY = "0788243168";
const WHATSAPP_NUMBER  = "27788243168";

// ===== NAV =====
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger?.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

// ===== CART ELEMENTS =====
const cartItemsEl = document.getElementById("cartItems");
const summaryItemsEl = document.getElementById("summaryItems");
const cartCountEl = document.getElementById("cartCount");

// ---- helpers ----
function clampQty(input) {
  let v = parseInt(input.value || "0", 10);
  if (Number.isNaN(v) || v < 0) v = 0;
  input.value = v;
  return v;
}

function getQtyInputs() {
  // ✅ ALWAYS get latest qty inputs (includes looks)
  return Array.from(document.querySelectorAll(".qty"));
}

function money(n) {
  const v = Number(n || 0);
  return `R${v}`;
}

function getCartItems() {
  const items = [];
  getQtyInputs().forEach(input => {
    const qty = clampQty(input);
    const name = input.dataset.name || "Item";
    const price = Number(input.dataset.price || 0);

    if (qty > 0) items.push({ name, qty, price });
  });
  return items;
}

function totalQty(items) {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

function totalPrice(items) {
  return items.reduce((sum, i) => sum + (i.qty * i.price), 0);
}

function renderCart() {
  const items = getCartItems();

  cartCountEl.textContent = totalQty(items);

  if (items.length === 0) {
    cartItemsEl.textContent = "No items yet. Add something cute! 🧦";
    summaryItemsEl.textContent = "No items selected yet.";
    return;
  }

  const lines = items
    .map(i => `• <b>${i.name}</b> — Qty: ${i.qty} <span style="opacity:.85;">(${money(i.price)} each)</span>`)
    .join("<br/>");

  cartItemsEl.innerHTML = lines + `<br/><br/><b>Total:</b> ${money(totalPrice(items))}`;
  summaryItemsEl.innerHTML = lines + `<br/><br/><b>Total:</b> ${money(totalPrice(items))}`;
}

// initial render
renderCart();

// ===== EVENT DELEGATION: PLUS/MINUS + ADD BUTTONS + INPUT CHANGES =====
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".qtybtn");
  const addBtn = e.target.closest(".add");

  // PLUS / MINUS
  if (btn) {
    const card = btn.closest("[data-product]") || btn.closest(".look-product") || btn.closest(".look-bundle-card");
    if (!card) return;

    const input = card.querySelector(".qty");
    if (!input) return;

    let v = clampQty(input);

    if (btn.dataset.action === "inc") v += 1;
    if (btn.dataset.action === "dec") v = Math.max(0, v - 1);

    input.value = v;
    renderCart();
    return;
  }

  // ADD TO CART BUTTON
  if (addBtn) {
    const card = addBtn.closest("[data-product]") || addBtn.closest(".look-product") || addBtn.closest(".look-bundle-card");
    if (!card) return;

    const input = card.querySelector(".qty");
    if (!input) return;

    let v = clampQty(input);
    if (v === 0) {
      input.value = 1;
    }

    renderCart();

    const old = addBtn.textContent;
    addBtn.textContent = "Added ✅";
    setTimeout(() => (addBtn.textContent = old || "Add to Cart"), 900);
  }
});

// When user types qty manually
document.addEventListener("input", (e) => {
  const input = e.target.closest(".qty");
  if (!input) return;
  clampQty(input);
  renderCart();
});

// ===== CLEAR CART =====
document.getElementById("clearCart")?.addEventListener("click", () => {
  getQtyInputs().forEach(i => (i.value = 0));
  renderCart();
});

// ===== ORDER MESSAGE =====
function buildWhatsAppMessage() {
  const items = getCartItems();
  if (items.length === 0) return null;

  const fullName = document.getElementById("fullName")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const kidsType = document.getElementById("kidsType")?.value || "";
  const size = document.getElementById("size")?.value.trim() || "";
  const bowColor = document.getElementById("bowColor")?.value.trim() || "";
  const deliveryType = document.getElementById("deliveryType")?.value || "";
  const address = document.getElementById("address")?.value.trim() || "";
  const notes = document.getElementById("notes")?.value.trim() || "";

  const lines = [];
  lines.push("🧦 Socks R Us Order — Steps of Joy & Hope");
  lines.push("");

  lines.push("👤 Customer Details");
  if (fullName) lines.push(`• Name: ${fullName}`);
  if (phone) lines.push(`• Phone: ${phone}`);
  if (kidsType) lines.push(`• Items For: ${kidsType}`);
  if (size) lines.push(`• Sock Size: ${size}`);
  if (bowColor) lines.push(`• Bow Color: ${bowColor}`);
  if (deliveryType) lines.push(`• Delivery/Pickup: ${deliveryType}`);
  if (address) lines.push(`• Address/Info: ${address}`);
  if (notes) lines.push(`• Notes: ${notes}`);

  lines.push("");
  lines.push("🛒 Items");
  items.forEach(i => {
    lines.push(`• ${i.name} — Qty: ${i.qty} — ${money(i.price)} each`);
  });

  lines.push("");
  lines.push(`💰 Total (estimate): ${money(totalPrice(items))}`);
  lines.push("✅ Please confirm availability + final total price. Thank you!");

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

  const kidsType = document.getElementById("kidsType")?.value;
  if (!kidsType) {
    alert("Please select Items For (Boys / Girls / Boys & Girls).");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});

// ===== FLOATING WHATSAPP BUTTON =====
document.getElementById("waFloat")?.addEventListener("click", (e) => {
  e.preventDefault();

  const msg = buildWhatsAppMessage();
  const fallback = "Hi Socks R Us 👋 I’d like to place an order. Please assist me.";
  const text = msg ? msg : fallback;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});

// ===== YEAR =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== SPLASH =====
window.onload = function () {
  setTimeout(function () {
    document.getElementById("splash").style.display = "none";
    // If you don't have #main-content in HTML, this line can be removed safely
    const main = document.getElementById("main-content");
    if (main) main.style.display = "block";
  }, 2500);
};
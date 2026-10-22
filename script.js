/* ============================================================
   1) STORE SETTINGS - change these
   ============================================================ */
const STORE = {
  messengerLink: "https://www.facebook.com/JustinJadePescuela.Navarrete/", // sample order contact
  instagram: "https://instagram.com/thriftfied.dept",
  facebook: "https://www.facebook.com/JustinJadePescuela.Navarrete/",
  currency: "₱"
};

/* ============================================================
   2) YOUR COLLECTIONS
   release : date and time the collection goes live (Philippine time, +08:00)
   teasers : your teaser photos, e.g. "images/teaser1.jpg". Leave "" for a placeholder.
             Add or remove lines to match how many teasers you have.
   Items of a collection can be bought only after its release time.
   ============================================================ */
const COLLECTIONS = [
  { name: "Collection 01", release: "2026-10-28T00:00:00+08:00", color: "#d4d4d4",
    teasers: ["collection-01-tees.jpg", "collection-01-jackets.jpg", "collection-01-hoodies.jpg", "collection-01-nike-sweatshirts.jpg", "collection-01-golfwear.jpg"] }
];

/* ============================================================
   3) ADD YOUR ITEMS HERE - copy one line, paste, edit
   collection : must match a collection name above
   image      : photo path like "images/jacket.jpg" ("" = emoji box)
   sold       : true = shows SOLD
   ============================================================ */
const ITEMS = [
  { id: 1, name: "Sample Tee 01 — Everyday Tee", collection: "Collection 01", category: "T-Shirts", price: 180, image: "collection-01-tees.jpg", emoji: "👕", color: "#e8dcc8", sold: false , sample: true},
  { id: 2, name: "Sample Tee 02 — Graphic Tee", collection: "Collection 01", category: "T-Shirts", price: 220, image: "collection-01-jackets.jpg", emoji: "👕", color: "#d4d4d4", sold: false , sample: true},
  { id: 3, name: "Sample Tee 03 — Relaxed Fit", collection: "Collection 01", category: "T-Shirts", price: 200, image: "collection-01-hoodies.jpg", emoji: "👕", color: "#cdd6e0", sold: false , sample: true},
  { id: 4, name: "Sample Tee 04 — Sport Style", collection: "Collection 01", category: "T-Shirts", price: 250, image: "collection-01-nike-sweatshirts.jpg", emoji: "👕", color: "#e8dcc8", sold: false , sample: true},
  { id: 5, name: "Sample Tee 05 — Vintage Style", collection: "Collection 01", category: "T-Shirts", price: 190, image: "collection-01-golfwear.jpg", emoji: "👕", color: "#d8d8e6", sold: false , sample: true}
];

/* ============================================================
   4) PAGE CODE - no need to edit below
   ============================================================ */
const $ = id => document.getElementById(id);
const peso = n => STORE.currency + n.toLocaleString("en-PH");
const col = name => COLLECTIONS.find(c => c.name === name);
const isLive = c => Date.now() >= new Date(c.release).getTime();
const dropDay = c => new Date(c.release).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Manila" });
const current = () => COLLECTIONS.find(c => !isLive(c)) || COLLECTIONS[COLLECTIONS.length - 1];
let filter = "All", categoryFilter = "T-Shirts", cart = [];

function photoHTML(it, badge){
  const inner = it.image ? `<img src="${it.image}" alt="${it.name || ""}" loading="lazy">` : `<span aria-hidden="true">${it.emoji || "🛍️"}</span>`;
  return `<div class="photo" style="--c:${it.color || "#e6e6e6"}">${inner}${badge ? `<i class="badge">${badge}</i>` : ""}</div>`;
}

function card(it){
  const c = col(it.collection), locked = c && !isLive(c) && !it.sample, inCart = cart.includes(it.id);
  const el = document.createElement("article");
  el.className = "card" + (it.sold ? " sold" : "");
  const label = it.sold ? "Sold out" : locked ? `Drops ${dropDay(c)}` : inCart ? "In cart" : "Add";
  el.innerHTML = `${photoHTML(it, it.sold ? "SOLD" : "SAMPLE")}<h3>${it.name}</h3><p class="price">${peso(it.price)}</p>
    <button class="add" ${it.sold || locked || inCart ? "disabled" : ""}>${label}</button>`;
  el.querySelector(".add").addEventListener("click", () => addToCart(it.id));
  return el;
}

function renderShop(){
  const q = $("search").value.trim().toLowerCase();
  const list = ITEMS.filter(i =>
    (filter === "All" || i.collection === filter) &&
    (i.category === categoryFilter) &&
    (!q || i.name.toLowerCase().includes(q))
  );
  $("shopTitle").textContent = filter === "All" ? "Shop All · Garments" : filter;
  $("clearFilter").hidden = filter === "All";
  $("count").textContent = `${list.length} sample T-shirt${list.length === 1 ? "" : "s"}`;
  $("shopGrid").innerHTML = list.length ? "" : `<p class="empty">No items match. Clear your search or pick another collection.</p>`;
  list.forEach(i => $("shopGrid").appendChild(card(i)));
}

function renderTeasers(){
  const c = current();
  $("dropName").textContent = c.name.toUpperCase();
  $("teaserGrid").innerHTML = "";
  c.teasers.forEach((src, n) => {
    const t = document.createElement("div");
    t.className = "teaser";
    t.innerHTML = photoHTML({ image: src, name: `${c.name} teaser ${n + 1}`, emoji: "", color: ["#d4d4d4","#cdd6e0","#e8dcc8","#d8d8e6"][n % 4] }) ;
    if (!src) t.querySelector(".photo").innerHTML = `<span>TEASER ${n + 1}<br>COMING SOON</span>`;
    $("teaserGrid").appendChild(t);
  });
}

function renderColls(){
  $("collGrid").innerHTML = "";
  COLLECTIONS.forEach(c => {
    const b = document.createElement("button");
    b.className = "coll";
    b.innerHTML = photoHTML({ image: c.teasers.find(Boolean) || "", emoji: "🏷️", color: c.color, name: c.name }, isLive(c) ? "LIVE" : `DROPS ${dropDay(c).toUpperCase()}`) + `<b>${c.name}</b>`;
    b.addEventListener("click", () => { filter = c.name; renderShop(); $("shop").scrollIntoView(); });
    $("collGrid").appendChild(b);
  });
}

function tick(){
  const c = current(), ms = new Date(c.release).getTime() - Date.now();
  if (ms <= 0){
    $("countdown").innerHTML = `<p class="live">${c.name} is live now!</p>`;
    $("dropSub").textContent = "Shop the full collection below.";
    return;
  }
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
  $("dropSub").textContent = `Drops ${dropDay(c)} · Mindanao time`;
  $("countdown").innerHTML = [[d,"DAYS"],[h,"HRS"],[m,"MINS"],[x,"SECS"]].map(([v,l]) => `<div><b>${String(v).padStart(2,"0")}</b><small>${l}</small></div>`).join("");
}

/* ---------- cart ---------- */
function addToCart(id){ if (!cart.includes(id)) cart.push(id); renderShop(); renderCart(); openCart(); }
function removeFromCart(id){ cart = cart.filter(x => x !== id); renderShop(); renderCart(); }

function renderCart(){
  const items = cart.map(id => ITEMS.find(i => i.id === id));
  $("cartCount").textContent = items.length;
  $("cartItems").innerHTML = items.length ? "" : `<p class="cart-empty">Your cart is empty.</p>`;
  items.forEach(it => {
    const row = document.createElement("div");
    row.className = "line";
    row.innerHTML = `${photoHTML(it)}<div><b>${it.name}</b><br><small>${peso(it.price)}</small></div><button class="icon">Remove</button>`;
    row.querySelector("button").addEventListener("click", () => removeFromCart(it.id));
    $("cartItems").appendChild(row);
  });
  const total = items.reduce((s, i) => s + i.price, 0);
  $("cartTotal").textContent = peso(total);
  const text = encodeURIComponent("Hi Thriftified! I'd like to order:\n" + items.map(i => `- ${i.name} (${peso(i.price)})`).join("\n") + `\nTotal: ${peso(total)}`);
  $("checkout").href = `${STORE.messengerLink}?text=${text}`;
  $("checkout").classList.toggle("disabled", !items.length);
}

function openCart(){ $("drawer").classList.add("open"); $("drawer").setAttribute("aria-hidden","false"); $("overlay").hidden = false; }
function closeCart(){ $("drawer").classList.remove("open"); $("drawer").setAttribute("aria-hidden","true"); $("overlay").hidden = true; }

$("cartBtn").addEventListener("click", openCart);
$("closeCart").addEventListener("click", closeCart);
$("overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });
$("searchBtn").addEventListener("click", () => { $("searchBar").hidden = !$("searchBar").hidden; if (!$("searchBar").hidden) $("search").focus(); });
$("search").addEventListener("input", () => { filter = "All"; renderShop(); $("shop").scrollIntoView(); });
$("clearFilter").addEventListener("click", () => { filter = "All"; categoryFilter = "T-Shirts"; $("search").value = ""; renderShop(); });
const categoryBar = $("categoryFilters");
const garmentCategories = ["T-Shirts"];
garmentCategories.forEach(category => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "category-filter" + (category === categoryFilter ? " active" : "");
  button.textContent = category;
  button.addEventListener("click", () => {
    categoryFilter = category;
    categoryBar.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.textContent === category));
    renderShop();
  });
  categoryBar.appendChild(button);
});
$("ig").href = STORE.instagram; $("fb").href = STORE.facebook;

renderTeasers(); renderColls(); renderShop(); renderCart(); tick();
let wasLive = isLive(current());
setInterval(() => { tick(); const now = isLive(current()); if (now !== wasLive){ wasLive = now; renderShop(); renderColls(); } }, 1000);

/* ---------- Collection 01 hero image carousel ---------- */
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
let heroSlideIndex = 0;
if (heroSlides.length > 1) {
  setInterval(() => {
    heroSlides[heroSlideIndex].classList.remove("active");
    heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
    heroSlides[heroSlideIndex].classList.add("active");
  }, 5000);
}


/* ---------- Drop notification demo ---------- */
$("notifyOpen").addEventListener("click", () => { $("notifyForm").hidden = !$("notifyForm").hidden; if (!$("notifyForm").hidden) $("notifyEmail").focus(); });
$("notifyForm").addEventListener("submit", e => { e.preventDefault(); $("notifyMessage").textContent = "Thanks! Your email is entered for the demo. Real notifications need an email service/backend to be connected."; });
/* ---------- Inquiry chat demo ---------- */
const chatPanel = $("chatPanel");
$("chatLauncher").addEventListener("click", () => { chatPanel.hidden = !chatPanel.hidden; $("chatLauncher").setAttribute("aria-expanded", String(!chatPanel.hidden)); if (!chatPanel.hidden) $("chatInput").focus(); });
$("chatClose").addEventListener("click", () => { chatPanel.hidden = true; $("chatLauncher").setAttribute("aria-expanded", "false"); });
$("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("chatInput"), message = input.value.trim();
  if (!message) return;
  const bubble = document.createElement("p");
  bubble.className = "chat-bubble chat-user";
  bubble.textContent = message;
  $("chatMessages").appendChild(bubble);
  const reply = document.createElement("p");
  reply.className = "chat-bubble";
  reply.textContent = "Thanks! This website preview cannot deliver your message directly. Tap “Contact Us on Facebook” below and send your question there. I’ll personally reply.";
  $("chatMessages").appendChild(reply);
  input.value = "";
  $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
});

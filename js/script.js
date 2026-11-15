/* ================= Fasel Kitchen — Vanilla JS ================= */

// ---------- Data ----------
const dishes = [
  { id: "pasta",     name: "Spaghetti Pomodoro",  cat: "pasta", price: 14, img: "images/hero-pasta.jpg",  desc: "Roasted cherry tomatoes, fresh basil, parmesan and extra-virgin olive oil." },
  { id: "alfredo",   name: "Fettuccine Alfredo",  cat: "pasta", price: 16, img: "images/hero-alfredo.jpg", desc: "Silky butter and parmesan cream sauce with fresh parsley." },
  { id: "carbonara", name: "Spaghetti Carbonara", cat: "pasta", price: 17, img: "images/carbonara.jpg",   desc: "Golden egg yolk, crispy pancetta, pecorino and cracked black pepper." },
  { id: "penne",     name: "Penne Arrabbiata",    cat: "pasta", price: 13, img: "images/penne.jpg",       desc: "Spicy tomato sauce with chili, garlic and basil." },
  { id: "lasagna",   name: "Beef Lasagna",        cat: "pasta", price: 18, img: "images/lasagna.jpg",     desc: "Layers of slow-cooked beef ragù, béchamel and melted mozzarella." },
  { id: "seafood",   name: "Linguine di Mare",    cat: "pasta", price: 21, img: "images/seafood.jpg",     desc: "Shrimp, mussels and cherry tomatoes in garlic white-wine butter." },
  { id: "ash",       name: "Ash Reshteh",         cat: "ash",   price: 11, img: "images/hero-ash.jpg",    desc: "Persian herb & noodle soup with kashk, mint oil and crispy onions." },
  { id: "aush",      name: "Afghan Aush",         cat: "ash",   price: 12, img: "images/aush.jpg",        desc: "Hand-cut noodles, chickpeas, yogurt, spiced meat sauce and dried mint." },
  { id: "ravioli", name: "Spinach & Ricotta Ravioli", cat: "pasta", price: 19, img: "images/ravioli.jpg", desc: "Handmade ravioli with spinach, ricotta, sage butter and parmesan." },
  { id: "pesto", name: "Fusilli al Pesto", cat: "pasta", price: 15, img: "images/pesto.jpg", desc: "Basil pesto, toasted pine nuts and freshly grated parmesan." },
  { id: "ash-jo", name: "Ash Jo", cat: "ash", price: 10, img: "images/ash-jo.jpg", desc: "Persian barley soup with chickpeas, fresh herbs and crispy onions." },
  { id: "lentil", name: "Red Lentil Soup", cat: "ash", price: 9, img: "images/lentil.jpg", desc: "Slow-simmered red lentils with parsley, lemon and warming spices." },
];

const heroTexts = [
  { eyebrow: "Signature Pasta", title: "Spaghetti Pomodoro", text: "Handmade pasta · Fresh basil · Parmesan" },
  { eyebrow: "Heritage Bowl", title: "Ash Reshteh", text: "Fresh herbs · Hand-cut noodles · Crispy onions" },
  { eyebrow: "Creamy Classics", title: "Fettuccine Alfredo", text: "Silky butter · Aged parmesan · Fresh parsley" },
];

// ---------- Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------- 1. Dark / Light mode ----------
const themeToggle = $("#themeToggle");
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  localStorage.setItem("fasel-theme", theme);
}
setTheme(localStorage.getItem("fasel-theme") || "dark");
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// ---------- 2. Mobile hamburger menu ----------
const hamburger = $("#hamburger");
const navLinks = $("#navLinks");
hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", open);
});
$$("#navLinks a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
  })
);

// ---------- 3. Hero slideshow ----------
const slides = $$(".slide");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = $(".hero");
const dotsWrap = $("#dots");
let current = 0;
let timer;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  dot.addEventListener("click", () => { goTo(i); restart(); });
  dotsWrap.appendChild(dot);
});

function goTo(index) {
  slides[current].classList.remove("active");
  dotsWrap.children[current].classList.remove("active");
  current = (index + slides.length) % slides.length;
  slides[current].classList.add("active");
  dotsWrap.children[current].classList.add("active");

  const t = heroTexts[current];
  const card = $(".hero-card");
  $("#heroEyebrow").textContent = t.eyebrow;
  $("#heroTitle").textContent = t.title;
  $("#heroText").textContent = t.text;
  card.classList.remove("fade-in");
  if (!reducedMotion.matches) requestAnimationFrame(() => card.classList.add("fade-in"));
}
let heroVisible = true;
const restart = () => {
  clearInterval(timer);
  if (!reducedMotion.matches && !document.hidden && heroVisible) timer = setInterval(() => goTo(current + 1), 5000);
};
$("#nextSlide").addEventListener("click", () => { goTo(current + 1); restart(); });
$("#prevSlide").addEventListener("click", () => { goTo(current - 1); restart(); });
restart();
document.addEventListener("visibilitychange", restart);
reducedMotion.addEventListener("change", restart);
new IntersectionObserver(([entry]) => {
  heroVisible = entry.isIntersecting;
  hero.classList.toggle("offscreen", !heroVisible);
  restart();
}).observe(hero);

// ---------- 4. Bottom plate strip (dynamic DOM) ----------
const track = $("#stripTrack");
const featuredPlates = dishes.filter((d) => ["pasta", "ash", "alfredo", "aush"].includes(d.id));
for (let copy = 0; copy < 2; copy++) {
  const group = document.createElement("div");
  group.className = "strip-group";
  if (copy) group.setAttribute("aria-hidden", "true");
  featuredPlates.forEach((d) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "strip-item";
    item.title = d.name;
    item.setAttribute("aria-label", `View ${d.name}`);
    if (copy) item.tabIndex = -1;
    item.innerHTML = `<img src="${d.img}" alt="" width="100" height="100" loading="lazy"><span>${d.name}</span>`;
    item.addEventListener("click", () => openModal(d.id));
    group.appendChild(item);
  });
  track.appendChild(group);
}

// ---------- 5. Menu rendering + filter ----------
const grid = $("#menuGrid");
function renderMenu(filter = "all") {
  grid.innerHTML = "";
  dishes
    .filter((d) => filter === "all" || d.cat === filter)
    .forEach((d, i) => {
      const card = document.createElement("article");
      card.className = "menu-card glass";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `View ${d.name}`);
      card.innerHTML = `
        <div class="thumb"><img src="${d.img}" alt="${d.name} — ${d.desc}" loading="lazy"></div>
        <div class="body">
          <div class="row"><h3>${d.name}</h3><span class="price">$${d.price}</span></div>
          <p>${d.desc}</p>
          <div class="stars">★★★★★</div>
        </div>`;
      card.addEventListener("click", () => openModal(d.id));
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(d.id); } });
      grid.appendChild(card);
    });
}
renderMenu();
$$("#filters .chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    $$("#filters .chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    renderMenu(chip.dataset.filter);
  })
);

// ---------- 6. Modal popup ----------
const modal = $("#modal");
function openModal(id) {
  const d = dishes.find((x) => x.id === id);
  if (!d) return;
  $("#modalImg").src = d.img;
  $("#modalImg").alt = d.name;
  $("#modalTitle").textContent = d.name;
  $("#modalDesc").textContent = d.desc;
  $("#modalPrice").textContent = `$${d.price}`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
$("#modalClose").addEventListener("click", closeModal);
$("#modalOrder").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
$$("[data-open]").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.open)));

// ---------- 7. Contact form validation ----------
const form = $("#contactForm");
function setError(input, msg) {
  const field = input.closest(".field");
  field.classList.toggle("invalid", !!msg);
  field.querySelector(".error").textContent = msg;
  return !msg;
}
function validate() {
  const name = $("#name"), email = $("#email"), guests = $("#guests"), date = $("#date"), message = $("#message");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const today = new Date().toISOString().split("T")[0];
  const checks = [
    setError(name, name.value.trim().length < 3 ? "Please enter at least 3 characters." : ""),
    setError(email, !emailRe.test(email.value.trim()) ? "Please enter a valid email." : ""),
    setError(guests, !guests.value ? "Please choose number of guests." : ""),
    setError(date, !date.value ? "Please pick a date." : date.value < today ? "Date cannot be in the past." : ""),
    setError(message, message.value.trim().length < 10 ? "Message must be at least 10 characters." : ""),
  ];
  return checks.every(Boolean);
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const success = $("#formSuccess");
  if (validate()) {
    success.textContent = `Thank you, ${$("#name").value.trim()}! Your table request has been received.`;
    form.reset();
  } else {
    success.textContent = "";
  }
});
form.querySelectorAll("input, select, textarea").forEach((el) =>
  el.addEventListener("input", () => setError(el, ""))
);

// ---------- 8. Scroll reveal, counters, back-to-top ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll("[data-count]").forEach(countUp);
    observer.unobserve(entry.target);
  });
}, { threshold: 0, rootMargin: "120px" });
$$(".reveal").forEach((el) => observer.observe(el));

function countUp(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = Math.ceil(target / 40);
  const tick = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n;
    if (n === target) clearInterval(tick);
  }, 30);
}

const toTop = $("#toTop");
let scrollPending = false;
window.addEventListener("scroll", () => {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(() => { toTop.classList.toggle("show", window.scrollY > 600); scrollPending = false; });
}, { passive: true });
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" }));

$("#year").textContent = new Date().getFullYear();

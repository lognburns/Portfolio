const workGrid = document.getElementById("work-grid");
const workEmpty = document.getElementById("work-empty");
const filterBar = document.querySelector(".filter-bar");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCategory = document.getElementById("lightbox-category");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDescription = document.getElementById("lightbox-description");

let projects = [];
let activeFilter = "all";

function getBasePath() {
  const { pathname } = window.location;
  if (pathname.endsWith("/")) return pathname;
  if (pathname.endsWith(".html")) {
    return pathname.slice(0, pathname.lastIndexOf("/") + 1);
  }
  return `${pathname}/`;
}

function assetUrl(path) {
  return `${getBasePath()}${path.replace(/^\//, "")}`;
}

async function loadProjects() {
  try {
    const response = await fetch(assetUrl("data/projects.json"));
    if (!response.ok) throw new Error("Failed to load projects");
    projects = await response.json();
  } catch {
    projects = [];
  }

  renderFilters();
  renderProjects();
}

function getCategories() {
  const categories = new Set(projects.map((project) => project.category));
  return [...categories].sort();
}

function renderFilters() {
  const existingButtons = filterBar.querySelectorAll(".filter-btn:not([data-filter='all'])");
  existingButtons.forEach((button) => button.remove());

  getCategories().forEach((category) => {
    const button = document.createElement("button");
    button.className = "filter-btn";
    button.dataset.filter = category;
    button.textContent = category;
    button.addEventListener("click", () => setFilter(category));
    filterBar.appendChild(button);
  });

  filterBar.querySelector('[data-filter="all"]').addEventListener("click", () => setFilter("all"));
}

function setFilter(filter) {
  activeFilter = filter;

  filterBar.querySelectorAll(".filter-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });

  renderProjects();
}

function getFilteredProjects() {
  if (activeFilter === "all") return projects;
  return projects.filter((project) => project.category === activeFilter);
}

function createPlaceholderImage(title) {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#211e19";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(244, 239, 230, 0.08)";
  ctx.lineWidth = 2;
  for (let x = -canvas.height; x < canvas.width; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + canvas.height, canvas.height);
    ctx.stroke();
  }

  ctx.fillStyle = "#e8c547";
  ctx.font = "600 24px DM Sans, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Add your image", canvas.width / 2, canvas.height / 2 - 8);

  ctx.fillStyle = "#a39a8c";
  ctx.font = "16px DM Sans, sans-serif";
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 + 24);

  return canvas.toDataURL("image/png");
}

function renderProjects() {
  const filtered = getFilteredProjects();
  workGrid.innerHTML = "";

  if (filtered.length === 0) {
    workEmpty.classList.remove("hidden");
    return;
  }

  workEmpty.classList.add("hidden");

  filtered.forEach((project) => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `View ${project.title}`);

    const imageSrc = assetUrl(project.thumbnail || project.image);
    const placeholder = createPlaceholderImage(project.title);

    card.innerHTML = `
      <div class="work-card-image-wrap">
        <img
          src="${imageSrc}"
          alt="${project.title}"
          class="work-card-image"
          loading="lazy"
        >
      </div>
      <div class="work-card-body">
        <p class="work-card-category">${project.category}</p>
        <h3 class="work-card-title">${project.title}</h3>
        ${project.year ? `<p class="work-card-year">${project.year}</p>` : ""}
      </div>
    `;

    const img = card.querySelector(".work-card-image");
    img.addEventListener("error", () => {
      img.src = placeholder;
      img.classList.add("placeholder");
    });

    const open = () => openLightbox(project, img.src);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });

    workGrid.appendChild(card);
  });
}

function openLightbox(project, fallbackSrc) {
  lightboxImage.src = project.image ? assetUrl(project.image) : fallbackSrc;
  lightboxImage.alt = project.title;
  lightboxCategory.textContent = project.category;
  lightboxTitle.textContent = project.title;
  lightboxDescription.textContent = project.description || "";
  lightbox.showModal();
}

function setupLightbox() {
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.open) lightbox.close();
  });
}

function setupMobileNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupImageFallbacks() {
  document.querySelectorAll("img[data-fallback='placeholder']").forEach((img) => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http") && !src.startsWith("data:")) {
      img.src = assetUrl(src);
    }

    img.addEventListener("error", () => {
      img.removeAttribute("src");
      img.alt = "";
    });
  });
}

function setupYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

setupLightbox();
setupMobileNav();
setupImageFallbacks();
setupYear();
loadProjects();

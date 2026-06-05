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

function hasImage(project) {
  return Boolean(project.image) && !project.placeholder;
}

function placeholderMarkup(label, className = "") {
  return `
    <div class="image-placeholder ${className}" aria-hidden="true">
      <span class="placeholder-icon">+</span>
      <span class="placeholder-label">${label}</span>
    </div>
  `;
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

    const imageHtml = hasImage(project)
      ? `<img
          src="${assetUrl(project.thumbnail || project.image)}"
          alt="${project.title}"
          class="work-card-image"
          loading="lazy"
        >`
      : placeholderMarkup("Image coming soon", "work-card-placeholder");

    card.innerHTML = `
      <div class="work-card-image-wrap">
        ${imageHtml}
      </div>
      <div class="work-card-body">
        <p class="work-card-category">${project.category}</p>
        <h3 class="work-card-title">${project.title}</h3>
        ${project.year ? `<p class="work-card-year">${project.year}</p>` : ""}
      </div>
    `;

    const img = card.querySelector(".work-card-image");
    if (img) {
      img.addEventListener("error", () => {
        img.replaceWith(
          document.createRange().createContextualFragment(
            placeholderMarkup("Image coming soon", "work-card-placeholder")
          )
        );
      });
    }

    const open = () => openLightbox(project);
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

function openLightbox(project) {
  const usePlaceholder = !hasImage(project);
  lightboxImage.classList.toggle("hidden", usePlaceholder);

  let placeholder = lightbox.querySelector(".lightbox-placeholder");
  if (usePlaceholder) {
    if (!placeholder) {
      placeholder = document.createElement("div");
      placeholder.className = "image-placeholder lightbox-placeholder";
      placeholder.innerHTML = `
        <span class="placeholder-icon">+</span>
        <span class="placeholder-label">Image coming soon</span>
      `;
      lightboxImage.parentElement.insertBefore(placeholder, lightboxImage);
    }
    placeholder.classList.remove("hidden");
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  } else {
    placeholder?.classList.add("hidden");
    lightboxImage.src = assetUrl(project.image);
    lightboxImage.alt = project.title;
    lightboxImage.addEventListener("error", () => {
      lightboxImage.classList.add("hidden");
      if (placeholder) placeholder.classList.remove("hidden");
    }, { once: true });
  }

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

function setupYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

setupLightbox();
setupMobileNav();
setupYear();
loadProjects();

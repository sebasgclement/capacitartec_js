const contentMap = {
  "Unidad I": [
    "Introducción a JavaScript",
    "Usos",
    "Variables",
    "Operadores",
    "Condicionales",
  ],
  "Unidad II": ["Arrays", "Objetos", "Bucles", "Funciones"],
  "Unidad III": ["POO", "Clases", "Herencia", "Encapsulación"],
  "Unidad IV": ["Métodos de cadenas", "Arrays", "Math", "Date"],
  "Unidad V": ["Console", "Depuración"],
  "Unidad VI": ["DOM", "Eventos", "Creación de elementos"],
};

const menu = document.getElementById("menu");

// === Renderiza el menú lateral ===
function renderMenu() {
  const ul = document.createElement("ul");

  Object.keys(contentMap).forEach((unidad, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = unidad;
    btn.dataset.path = `secciones/unidad${i + 1}.html`; // guardamos la ruta
    li.appendChild(btn);
    ul.appendChild(li);
  });

  menu.appendChild(ul);
}

renderMenu();

// === Carga dinámica del contenido ===
async function loadContent(path) {
  const content = document.getElementById("content");
  try {
    const response = await fetch(path);
    const html = await response.text();
    content.innerHTML = html;
    window.scrollTo({ top: content.offsetTop - 70, behavior: "smooth" });
  } catch {
    content.innerHTML = "<p>No se pudo cargar la sección.</p>";
  }
}

// === Delegación de eventos: mantiene los botones activos siempre ===
menu.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn || !btn.dataset.path) return;
  loadContent(btn.dataset.path);
});

// === Botón "Comenzar curso" del Hero ===
document.getElementById("start-btn").addEventListener("click", () => {
  document.querySelector(".container").scrollIntoView({ behavior: "smooth" });
});

// === Efecto sticky estilo MDN ===
const sidebar = document.querySelector("aside");
const header = document.querySelector("header");

const observer = new IntersectionObserver(
  ([entry]) => {
    sidebar.classList.toggle("is-sticky", !entry.isIntersecting);
  },
  { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
);

observer.observe(header);

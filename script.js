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
  "Unidad VII": [
    "DOM avanzado",
    "Modo oscuro",
    "LocalStorage",
    "Fetch API",
    "Async / Await",
    "Mini app integradora",
  ],
  "Ejercicios prácticos": ["Unidad I a VII", "Desafíos extra"],
};

const menu = document.getElementById("menu");

// Renderiza el menú lateral
function renderMenu() {
  const ul = document.createElement("ul");
  Object.keys(contentMap).forEach((unidad, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = unidad;
    if (unidad === "Ejercicios prácticos") {
      btn.dataset.path = "secciones/ejercicios.html";
    } else {
      btn.dataset.path = `secciones/unidad${i + 1}.html`;
    }
    li.appendChild(btn);
    ul.appendChild(li);
  });
  menu.appendChild(ul);
}
renderMenu();

// Carga dinámica de contenido
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

// Delegación de eventos
menu.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn || !btn.dataset.path) return;
  loadContent(btn.dataset.path);
});

// Botón "Comenzar curso"
document.getElementById("start-btn").addEventListener("click", () => {
  document.querySelector(".layout").scrollIntoView({ behavior: "smooth" });
});

// === Efecto sticky tipo MDN ===
const sidebar = document.querySelector("aside");
const header = document.querySelector("header");

const observer = new IntersectionObserver(
  ([entry]) => {
    sidebar.classList.toggle("is-sticky", !entry.isIntersecting);
  },
  { threshold: 0, rootMargin: "-90px 0px 0px 0px" }
);

observer.observe(header);

// === Simulación de sticky con JS (sin tocar CSS) ===
const aside = document.querySelector("aside");
const footer = document.querySelector("footer");

let startOffset = aside.offsetTop; // punto inicial
let maxScroll = document.body.scrollHeight - window.innerHeight;

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Evita que el aside se meta debajo del footer
  const footerTop = footer.offsetTop;
  const asideHeight = aside.offsetHeight;
  const limit = footerTop - asideHeight - 40; // margen de seguridad

  // Calcula nueva posición
  let newTop = Math.min(
    Math.max(scrollY - startOffset + 90, 0),
    limit - startOffset
  );

  aside.style.transform = `translateY(${newTop}px)`;
});

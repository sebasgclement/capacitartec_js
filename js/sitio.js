// =========================================================
// Curso de JavaScript — comportamiento compartido del sitio
// Todas las páginas cargan este archivo con `defer`.
// =========================================================

const PAGINAS = [
  { archivo: "unidad-1.html", numero: "1", titulo: "Primeros pasos" },
  { archivo: "unidad-2.html", numero: "2", titulo: "Operadores y decisiones" },
  { archivo: "unidad-3.html", numero: "3", titulo: "Bucles y funciones" },
  { archivo: "unidad-4.html", numero: "4", titulo: "Arrays, objetos y strings" },
  { archivo: "unidad-5.html", numero: "5", titulo: "Métodos de array, Math y Date" },
  { archivo: "unidad-6.html", numero: "6", titulo: "DOM y eventos" },
  { archivo: "unidad-7.html", numero: "7", titulo: "Formularios y almacenamiento" },
  { archivo: "unidad-8.html", numero: "8", titulo: "Asincronía y APIs" },
  { archivo: "unidad-9.html", numero: "9", titulo: "Programación orientada a objetos" },
  { archivo: "desafios.html", numero: "★", titulo: "Desafíos y proyecto final" },
];

// "" en index.html, "../" en las páginas de /unidades
const base = document.body.dataset.base ?? "";
const archivoActual = location.pathname.split("/").pop() || "index.html";

// ---------- Menú lateral ----------
function crearMenu() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const enlaceInicio = `
    <p class="nav-titulo">Curso</p>
    <ul class="nav-lista">
      <li>
        <a href="${base}index.html" ${archivoActual === "index.html" ? 'aria-current="page"' : ""}>
          <span class="nav-num">⌂</span> Inicio y cronograma
        </a>
      </li>
    </ul>
    <p class="nav-titulo">Unidades</p>`;

  const items = PAGINAS.map((pagina) => {
    const actual = pagina.archivo === archivoActual ? 'aria-current="page"' : "";
    return `
      <li>
        <a href="${base}unidades/${pagina.archivo}" ${actual}>
          <span class="nav-num">${pagina.numero}</span> ${pagina.titulo}
        </a>
      </li>`;
  });

  nav.innerHTML = `${enlaceInicio}<ul class="nav-lista">${items.join("")}</ul>`;
}

// ---------- Menú en celulares ----------
function configurarMenuMovil() {
  const boton = document.getElementById("btn-menu");
  const velo = document.querySelector(".velo");
  if (!boton) return;

  const cerrar = () => {
    document.body.classList.remove("menu-abierto");
    boton.setAttribute("aria-expanded", "false");
  };

  boton.addEventListener("click", () => {
    const abierto = document.body.classList.toggle("menu-abierto");
    boton.setAttribute("aria-expanded", String(abierto));
  });

  velo?.addEventListener("click", cerrar);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrar();
  });
}

// ---------- Modo claro / oscuro ----------
function configurarTema() {
  const boton = document.getElementById("btn-tema");
  if (!boton) return;

  const temaActual = () =>
    document.documentElement.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  boton.addEventListener("click", () => {
    const nuevo = temaActual() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nuevo;
    try {
      localStorage.setItem("tema", nuevo);
    } catch {
      // Sin acceso a localStorage: el tema dura hasta recargar.
    }
  });
}

// ---------- Bloques de código ----------
function prepararCodigo() {
  const bloques = document.querySelectorAll("pre > code");

  bloques.forEach((code) => {
    // Si el bloque no indica lenguaje, asumimos JavaScript.
    if (![...code.classList].some((c) => c.startsWith("language-"))) {
      code.classList.add("language-javascript");
    }

    const boton = document.createElement("button");
    boton.className = "btn-copiar";
    boton.type = "button";
    boton.textContent = "Copiar";
    boton.addEventListener("click", () => copiar(code.innerText, boton));
    code.parentElement.append(boton);
  });

  // highlight.js se carga desde un CDN; si no hay internet, el código se ve sin colores.
  if (window.hljs) {
    bloques.forEach((code) => window.hljs.highlightElement(code));
  }
}

async function copiar(texto, boton) {
  try {
    await navigator.clipboard.writeText(texto);
    boton.textContent = "¡Copiado!";
  } catch {
    boton.textContent = "No se pudo copiar";
  }
  setTimeout(() => (boton.textContent = "Copiar"), 1500);
}

// ---------- Índice "En esta página" ----------
function crearIndice() {
  const toc = document.getElementById("toc");
  const secciones = document.querySelectorAll(".articulo section[id]");
  if (!toc || secciones.length === 0) return;

  const links = [...secciones].map((seccion) => {
    const titulo = seccion.querySelector("h2");
    return `<li><a href="#${seccion.id}">${titulo?.textContent ?? seccion.id}</a></li>`;
  });
  toc.innerHTML = `<p class="toc-titulo">En esta página</p><ul>${links.join("")}</ul>`;

  // Marca la sección que se está leyendo.
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        toc.querySelectorAll("a").forEach((a) => {
          a.classList.toggle("activo", a.getAttribute("href") === `#${entrada.target.id}`);
        });
      });
    },
    { rootMargin: "-80px 0px -70% 0px" }
  );
  secciones.forEach((seccion) => observador.observe(seccion));
}

// ---------- Anterior / siguiente ----------
function crearPaginacion() {
  const contenedor = document.getElementById("paginacion");
  if (!contenedor) return;

  const indice = PAGINAS.findIndex((p) => p.archivo === archivoActual);
  const anterior = indice > 0 ? PAGINAS[indice - 1] : null;
  const siguiente = PAGINAS[indice + 1]; // en index.html (indice -1) da la Unidad 1

  let html = "";
  if (anterior) {
    html += `<a href="${base}unidades/${anterior.archivo}">
      <small>← Anterior</small>${anterior.titulo}</a>`;
  } else if (indice === 0) {
    html += `<a href="${base}index.html"><small>← Anterior</small>Inicio y cronograma</a>`;
  }
  if (siguiente) {
    html += `<a class="siguiente" href="${base}unidades/${siguiente.archivo}">
      <small>Siguiente →</small>${siguiente.titulo}</a>`;
  }
  contenedor.innerHTML = html;
}

crearMenu();
configurarMenuMovil();
configurarTema();
prepararCodigo();
crearIndice();
crearPaginacion();

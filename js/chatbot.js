(() => {
  "use strict";
  if (document.getElementById("portfolioChatWidget")) return;

  const style = document.createElement("style");
  style.textContent =
    "#portfolioChatWidget{position:fixed;left:0;right:0;bottom:8px;z-index:9999;font-family:inherit;color:#10233f;pointer-events:none}" +
    "#portfolioChatToggle{pointer-events:auto;position:absolute;left:0;bottom:0;display:flex;align-items:center;justify-content:center;width:100px;height:100px;border:0;border-radius:0;padding:0;background:transparent;box-shadow:none;cursor:pointer;animation:portfolioPikachuWalk 16s linear infinite;transform-origin:center center}" +
    "#portfolioChatToggle:hover{filter:drop-shadow(0 4px 5px #0002)}" +
    ".portfolio-pikachu{display:inline-flex;width:96px;height:96px;align-items:center;justify-content:center;overflow:visible;pointer-events:none}" +
    ".portfolio-pikachu img{display:block;width:96px;height:96px;object-fit:contain;image-rendering:pixelated;filter:drop-shadow(0 2px 2px #0002)}" +
    "#portfolioChatWindow{display:none;position:fixed;left:12px;bottom:82px;width:min(360px,calc(100vw - 24px));height:480px;max-height:calc(100vh - 110px);background:#fff;border:1px solid #d7e5f4;border-radius:18px;box-shadow:0 18px 55px #08274b30;overflow:hidden;flex-direction:column;pointer-events:auto}" +
    "@keyframes portfolioPikachuWalk{0%{left:0;transform:scaleX(1)}46%{left:calc(100vw - 100px);transform:scaleX(1)}50%{left:calc(100vw - 100px);transform:scaleX(-1)}96%{left:0;transform:scaleX(-1)}100%{left:0;transform:scaleX(1)}}" +
    "@keyframes portfolioPikachuBounce{from{transform:translateY(0)}to{transform:translateY(-5px)}}" +
    "@media(prefers-reduced-motion:reduce){#portfolioChatToggle,.portfolio-pikachu{animation:none}}" +
    "#portfolioChatWindow.open{display:flex}" +
    "#portfolioChatHeader{background:linear-gradient(135deg,#0877bd,#174a9b);color:#fff;padding:16px;display:flex;align-items:center;justify-content:space-between}" +
    "#portfolioChatHeader strong{display:block;font-size:15px}#portfolioChatHeader small{display:block;opacity:.86;margin-top:3px}" +
    "#portfolioChatClose{border:0;background:#ffffff24;color:#fff;font-size:24px;border-radius:8px;width:34px;height:34px;cursor:pointer}" +
    "#portfolioChatMessages{padding:14px;overflow:auto;flex:1;background:#f6faff}" +
    ".portfolio-chat-msg{font-size:13px;line-height:1.45;padding:10px 12px;border-radius:13px;margin:0 0 10px;max-width:92%;white-space:pre-wrap;overflow-wrap:anywhere}" +
    ".portfolio-chat-bot{background:#fff;border:1px solid #e0eaf5;margin-right:auto}.portfolio-chat-user{background:#dcefff;margin-left:auto}" +
    "#portfolioChatQuick{display:flex;gap:6px;flex-wrap:wrap;padding:0 12px 10px;background:#f6faff}" +
    ".portfolio-chat-quick{border:1px solid #a9cdec;background:#fff;color:#075b98;border-radius:999px;padding:7px 10px;font-size:12px;cursor:pointer}" +
    "#portfolioChatForm{display:flex;gap:8px;padding:12px;border-top:1px solid #e4edf6;background:#fff}" +
    "#portfolioChatInput{min-width:0;flex:1;border:1px solid #cbd9e8;border-radius:10px;padding:11px;font:inherit;font-size:13px;outline-color:#0877bd}" +
    "#portfolioChatSend{border:0;border-radius:10px;padding:0 14px;background:#0877bd;color:#fff;font-weight:700;cursor:pointer}" +
    "@media(max-width:480px){#portfolioChatWidget{right:12px;bottom:12px}#portfolioChatWindow{right:0;width:calc(100vw - 24px);height:min(500px,calc(100vh - 95px))}}";
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "portfolioChatWidget";
  widget.innerHTML = '<section id="portfolioChatWindow" role="dialog" aria-label="Asistente virtual" aria-hidden="true">' +
    '<header id="portfolioChatHeader"><div><strong>Asistente virtual</strong><small>Portafolio académico · UPLA</small></div>' +
    '<button id="portfolioChatClose" type="button" aria-label="Cerrar chat">×</button></header>' +
    '<div id="portfolioChatMessages" aria-live="polite"></div>' +
    '<div id="portfolioChatQuick">' +
    '<button class="portfolio-chat-quick" type="button" data-question="¿Quién eres?">Mi perfil</button>' +
    '<button class="portfolio-chat-quick" type="button" data-question="¿Qué cursos hay?">Mis cursos</button>' +
    '<button class="portfolio-chat-quick" type="button" data-question="¿Cómo veo los trabajos?">Mis trabajos</button>' +
    '<button class="portfolio-chat-quick" type="button" data-question="¿Cómo entro al área privada?">Área privada</button></div>' +
    '<form id="portfolioChatForm"><input id="portfolioChatInput" type="text" maxlength="300" placeholder="Escribe tu pregunta..." aria-label="Escribe tu pregunta" autocomplete="off">' +
    '<button id="portfolioChatSend" type="submit">Enviar</button></form></section>' +
    '<button id="portfolioChatToggle" type="button" aria-expanded="false" aria-label="Pikachu, abre el asistente virtual"><span class="portfolio-pikachu" aria-hidden="true"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif" alt="" loading="eager"></span></button>';
  document.body.appendChild(widget);

  const win = document.getElementById("portfolioChatWindow");
  const toggle = document.getElementById("portfolioChatToggle");
  const close = document.getElementById("portfolioChatClose");
  const messages = document.getElementById("portfolioChatMessages");
  const form = document.getElementById("portfolioChatForm");
  const input = document.getElementById("portfolioChatInput");

  function addMessage(text, who) {
    const item = document.createElement("div");
    item.className = "portfolio-chat-msg " + (who === "user" ? "portfolio-chat-user" : "portfolio-chat-bot");
    const parts = String(text).split(/(https?:\/\/[^\s]+)/g);
    parts.forEach(part => {
      if (/^https?:\/\//i.test(part)) {
        const link = document.createElement("a");
        link.href = part.replace(/[),.]+$/, "");
        link.textContent = link.href.includes("supabase") ? "Abrir o descargar trabajo" : link.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.color = "#075b98";
        link.style.fontWeight = "700";
        item.appendChild(link);
        if (part.length > link.href.length) item.appendChild(document.createTextNode(part.slice(link.href.length)));
      } else {
        item.appendChild(document.createTextNode(part));
      }
    });
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }

  const COURSE_INFO = {
    desarrollo: {
      name: "Desarrollo de Aplicaciones",
      description: "Asignatura orientada a convertir una necesidad en una aplicación de software funcional: comprender el problema, diseñar la solución, programarla, probarla, corregir errores y mantenerla.",
      topics: [
        "Análisis de requisitos: identificar el problema, los usuarios, las entradas, los procesos y los resultados que debe ofrecer el sistema.",
        "Diseño de la solución: dividir el programa en clases, módulos, funciones o componentes; definir responsabilidades y relaciones.",
        "Programación orientada a objetos: clases, objetos, atributos, métodos, encapsulamiento, herencia, polimorfismo, abstracción, clases abstractas e interfaces cuando corresponda.",
        "Construcción de interfaces: formularios, controles, validación de datos y comunicación entre la interfaz y la lógica de negocio.",
        "Persistencia de datos: conexión con bases de datos, consultas, operaciones de registro, lectura, actualización y eliminación, según los requisitos.",
        "Pruebas y depuración: comprobar casos normales y errores, interpretar mensajes, localizar fallos y verificar resultados.",
        "Organización y entrega del proyecto: estructura de archivos, documentación, evidencias, instalación o publicación de la aplicación."
      ]
    },
    algoritmos: {
      name: "Algoritmos y Estructura de Datos",
      description: "Asignatura centrada en diseñar soluciones paso a paso, analizar su lógica y escoger estructuras adecuadas para almacenar, recorrer, buscar y modificar información.",
      topics: [
        "Algoritmos: secuencia de pasos finitos, precisos y ordenados para resolver un problema.",
        "Representación de soluciones: pseudocódigo, diagramas de flujo, variables, constantes, operadores y seguimiento manual de instrucciones.",
        "Control de flujo: secuencia, decisiones condicionales y repetición mediante ciclos.",
        "Métodos o funciones: parámetros, retorno de resultados, reutilización, modularidad y separación de responsabilidades.",
        "Arreglos y matrices: declarar, recorrer, buscar, ordenar, insertar o modificar elementos, según el ejercicio.",
        "Estructuras lineales: listas, pilas y colas; operaciones básicas y situaciones en las que conviene usar cada una.",
        "Búsqueda y ordenamiento: estrategias para encontrar elementos y organizar colecciones.",
        "Recursividad y análisis de eficiencia: resolver problemas por subproblemas y comparar, de manera básica, el tiempo y la memoria que necesitan las soluciones."
      ]
    }
  };
  let worksCache = null;
  let worksPromise = null;

  function normalizeText(value) {
    return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function findCourse(q) {
    if (/desarrollo|aplicaciones|programacion de aplicaciones/.test(q)) return "desarrollo";
    if (/algoritmos|estructura de datos/.test(q)) return "algoritmos";
    return null;
  }
  function courseLabel(key) { return COURSE_INFO[key]?.name || "el curso"; }
  function localWeek(globalWeek) {
    const n = Number(globalWeek);
    if (!Number.isInteger(n) || n < 1 || n > 16) return null;
    return { period: Math.floor((n - 1) / 4) + 1, week: ((n - 1) % 4) + 1, global: n };
  }
  function getGlobalWeekFromQuestion(q) {
    let m = q.match(/(?:semana|sem)\s*(?:n(?:ro|umero)?\.?\s*)?(\d{1,2})/);
    if (!m) return null;
    const n = Number(m[1]);
    return n >= 1 && n <= 16 ? n : null;
  }
  function getPeriodFromQuestion(q) {
    const m = q.match(/periodo\s*(?:n(?:ro|umero)?\.?\s*)?(\d)/);
    const n = m ? Number(m[1]) : null;
    return n >= 1 && n <= 4 ? n : null;
  }
  async function loadPublicWorks() {
    if (worksCache) return worksCache;
    if (worksPromise) return worksPromise;
    worksPromise = (async () => {
      if (typeof supabaseClient === "undefined" || !supabaseClient) return { error: "No se pudo conectar con el catálogo público de trabajos." };
      let result = await supabaseClient.from("trabajos")
        .select("id,curso,periodo,semana,actividad,titulo,descripcion,fecha,archivo_url,archivo_nombre,creado_en")
        .order("fecha", { ascending: false })
        .limit(500);
      if (result.error && /actividad|column/i.test(result.error.message || "")) {
        result = await supabaseClient.from("trabajos")
          .select("id,curso,periodo,semana,titulo,descripcion,fecha,archivo_url,archivo_nombre,creado_en")
          .order("fecha", { ascending: false })
          .limit(500);
      }
      if (result.error) return { error: "No pude consultar los trabajos publicados en este momento." };
      worksCache = (result.data || []).filter(w => {
        const c = normalizeText(w.curso);
        return (c.includes("desarrollo") && (c.includes("aplic") || c.includes("software") || c.includes("program"))) ||
          c.includes("algorit") || c.includes("estructura") || c.includes("datos");
      });
      return { data: worksCache };
    })();
    const result = await worksPromise;
    if (result.error) worksPromise = null;
    return result;
  }
  function workTitle(w) {
    const raw = w.titulo || w.descripcion || w.archivo_nombre || "Trabajo académico";
    return String(raw).replace(/^actividad\s*#?\s*\d+\s*[-:–—]?\s*/i, "").trim();
  }
  function workLink(w) {
    const url = w.archivo_url || "";
    return /^https?:\/\//i.test(url) ? url : "";
  }
  function describeWork(w, i) {
    const activity = w.actividad ? " · Actividad " + w.actividad : "";
    const filename = w.archivo_nombre ? " · Archivo: " + w.archivo_nombre : "";
    const url = workLink(w);
    return (i + 1) + ". " + workTitle(w) + activity + filename + (url ? "\n" + url : "\nArchivo: no hay enlace público registrado");
  }
  async function reply(question) {
    const raw = question.trim();
    const q = normalizeText(raw);
    const course = findCourse(q);
    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|saludos)[!. ]*$/.test(q))
      return "¡Hola! ⚡ Soy Pikachu, tu asistente del portafolio. Puedo contarte sobre el perfil académico publicado, los dos cursos y los trabajos disponibles. ¿Qué deseas consultar?";
    if (/(quien eres|perfil|presentacion|estudiante|nombre|carrera|mis datos|informacion personal|informacion sobre mi)/.test(q) && !/(curso|trabajo|actividad)/.test(q))
      return "El portafolio pertenece a Franco Roy Taipe Quispe, estudiante de Ingeniería de Sistemas y Computación en la Universidad Peruana Los Andes (UPLA), IV ciclo. La página organiza sus trabajos académicos en dos cursos: Desarrollo de Aplicaciones y Algoritmos y Estructura de Datos. No muestra otros datos personales de contacto.";
    if (/(que cursos|cuales cursos|mis cursos|lista de cursos|cursos registrados)/.test(q))
      return "El portafolio contiene únicamente estos dos cursos:\n\n1. Desarrollo de Aplicaciones: análisis de requisitos, diseño, programación, orientación a objetos, interfaces, bases de datos, pruebas y mantenimiento.\n\n2. Algoritmos y Estructura de Datos: lógica, pseudocódigo, control de flujo, métodos, arreglos, matrices, estructuras lineales, búsqueda, ordenamiento y eficiencia.\n\nCada curso está organizado en 4 períodos de 4 semanas (16 semanas numeradas de forma continua). Pídeme un curso para darte más detalles o dime la semana/actividad para buscar trabajos publicados.";
    if (/(periodo|periodos|semana|semanas)/.test(q) && !course && !/(trabajo|actividad|archivo|documento)/.test(q))
      return "La numeración de semanas es continua: período 1 = semanas 1–4; período 2 = semanas 5–8; período 3 = semanas 9–12; período 4 = semanas 13–16.";
    if (course && /(que es|informacion|contenido|temas|explica|explicame|resumen|de que trata|sobre el curso|sobre la asignatura)/.test(q) && !/(actividad|trabajo|archivo|documento|semana)/.test(q)) {
      const result = await loadPublicWorks();
      if (result.error) return COURSE_INFO[course].name + ": " + COURSE_INFO[course].description + "\n" + result.error;
      const rows = result.data.filter(w => normalizeText(w.curso).includes(course === "desarrollo" ? "desarrollo" : "algorit") || (course === "algoritmos" && normalizeText(w.curso).includes("estructura")));
      const titles = [...new Set(rows.map(workTitle).filter(Boolean))].slice(0, 8);
      return COURSE_INFO[course].name + "\n\n" + COURSE_INFO[course].description + "\n\nTemas que puedes estudiar:\n• " + COURSE_INFO[course].topics.join("\n• ") + "\n\nEn el portafolio hay " + rows.length + " trabajo(s) publicado(s) para este curso." + (titles.length ? "\nAlgunos títulos del catálogo:\n• " + titles.join("\n• ") : "") + "\n\nTambién puedo buscar los archivos registrados. Ejemplos: «Dame los trabajos de Desarrollo de Aplicaciones, semana 5» o «Busca la actividad 2 de Algoritmos, período 2».";
    }
    if (course && /(trabajo|trabajos|actividad|actividades|archivo|documento|dame|mostrar|buscar|descargar|enlace|pdf|word)/.test(q)) {
      const result = await loadPublicWorks();
      if (result.error) return result.error;
      let rows = result.data.filter(w => {
        const wc = normalizeText(w.curso);
        return course === "desarrollo"
          ? wc.includes("desarrollo") && (wc.includes("aplic") || wc.includes("software") || wc.includes("program"))
          : wc.includes("algorit") || wc.includes("estructura");
      });
      const globalWeek = getGlobalWeekFromQuestion(q);
      const periodAsked = getPeriodFromQuestion(q);
      if (globalWeek !== null) {
        const parsed = localWeek(globalWeek);
        // If a period is explicitly stated and the week number is 1-4, treat it as the
        // local week in that period. Otherwise the week is the continuous 1-16 number.
        const m = q.match(/(?:semana|sem)\s*(?:n(?:ro|umero)?\.?\s*)?(\d{1,2})/);
        const statedWeek = Number(m?.[1]);
        const target = periodAsked && statedWeek <= 4
          ? { period: periodAsked, week: statedWeek, global: (periodAsked - 1) * 4 + statedWeek }
          : parsed;
        rows = rows.filter(w => Number(w.periodo) === target.period && Number(w.semana) === target.week);
      } else if (periodAsked) {
        rows = rows.filter(w => Number(w.periodo) === periodAsked);
      }
      const activityMatch = q.match(/actividad\s*(?:n(?:ro|umero)?\.?\s*)?#?\s*(\d+)/);
      if (activityMatch && rows.some(w => w.actividad !== undefined && w.actividad !== null)) {
        const wanted = Number(activityMatch[1]);
        rows = rows.filter(w => Number(w.actividad) === wanted || normalizeText(w.titulo).includes("actividad " + wanted));
      } else if (activityMatch) {
        const wanted = Number(activityMatch[1]);
        rows = rows.filter(w => normalizeText(w.titulo).includes("actividad " + wanted) || normalizeText(w.archivo_nombre).includes("actividad " + wanted));
      }
      if (!rows.length) {
        return "No encontré trabajos publicados que coincidan con esa consulta en " + courseLabel(course) + ". Verifica el curso, el período, la semana y el número de actividad. Los datos guardados no se modificaron.";
      }
      const heading = courseLabel(course) + (globalWeek ? " · Semana " + (periodAsked && Number(q.match(/(?:semana|sem)\s*(\d{1,2})/)?.[1]) <= 4 ? (periodAsked - 1) * 4 + Number(q.match(/(?:semana|sem)\s*(\d{1,2})/)?.[1]) : globalWeek) : "") + (periodAsked ? " · Período " + periodAsked : "");
      return heading + "\nEncontré " + rows.length + " trabajo(s):\n\n" + rows.slice(0, 12).map(describeWork).join("\n\n") + (rows.length > 12 ? "\n\nMostrando los primeros 12 resultados. Especifica el número de actividad para afinar la búsqueda." : "");
    }
    if (/(privad|iniciar sesion|login|entrar|acceso|subir|cargar)/.test(q))
      return "Para acceder al área privada, usa «Iniciar sesión» en la parte superior. Desde allí puedes administrar los trabajos. No compartas tu contraseña en este chat.";
    if (/(dato|contacto|correo|email|telefono|celular)/.test(q))
      return "La información publicada en la sección «Mis datos» es: Franco Roy Taipe Quispe, Ingeniería de Sistemas y Computación, IV ciclo, UPLA.";
    if (/(gracias|muchas gracias)/.test(q)) return "¡Pika-pika! ⚡ ¡Con gusto! Pregúntame por tu perfil, uno de los dos cursos o por una actividad/trabajo publicado.";
    return "Puedo consultar el perfil académico público y los trabajos de estos dos cursos: Desarrollo de Aplicaciones y Algoritmos y Estructura de Datos. Prueba: «¿Qué temas tiene Desarrollo de Aplicaciones?» o «Dame la actividad 2 de Algoritmos, semana 5».";
  }

  async function ask(question) {
    const clean = question.trim();
    if (!clean) return;
    addMessage(clean, "user");
    const waiting = document.createElement("div");
    waiting.className = "portfolio-chat-msg portfolio-chat-bot";
    waiting.textContent = "Pikachu está buscando la información…";
    messages.appendChild(waiting);
    messages.scrollTop = messages.scrollHeight;
    try {
      const response = await reply(clean);
      waiting.remove();
      addMessage(response, "bot");
    } catch (_error) {
      waiting.remove();
      addMessage("No pude consultar esa información ahora. Inténtalo otra vez o consulta directamente la sección de cursos y trabajos.", "bot");
    }
  }

  function openChat() {
    win.classList.add("open");
    win.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    if (!messages.childElementCount) addMessage("¡Pika-pika! ⚡ ¡Hola! Soy tu asistente virtual. ¿Qué deseas saber o consultar? Puedes preguntarme por el perfil, los cursos, los trabajos o el área privada.", "bot");
    input.focus();
  }
  function closeChat() {
    win.classList.remove("open");
    win.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", () => win.classList.contains("open") ? closeChat() : openChat());
  close.addEventListener("click", closeChat);
  form.addEventListener("submit", event => {
    event.preventDefault();
    ask(input.value);
    input.value = "";
    input.focus();
  });
  widget.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => ask(button.dataset.question)));
})();
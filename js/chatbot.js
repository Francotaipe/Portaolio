(() => {
  "use strict";
  if (document.getElementById("portfolioChatWidget")) return;

  const style = document.createElement("style");
  style.textContent =
    "#portfolioChatWidget{position:fixed;left:auto;right:10px;bottom:10px;width:145px;height:145px;z-index:9999;font-family:inherit;color:#10233f;pointer-events:none}" +
    "#portfolioChatToggle{pointer-events:auto;position:absolute;right:0;bottom:0;left:auto;display:flex;align-items:center;justify-content:center;width:138px;height:138px;border:0;border-radius:0;padding:0;background:transparent;box-shadow:none;cursor:pointer;animation:none!important;transform:none!important}" +
    "#portfolioChatToggle:hover{filter:drop-shadow(0 4px 5px #0002)}" +
    "#portfolioChatToggle:hover{filter:drop-shadow(0 4px 5px #0002)}" +
    ".portfolio-robot{display:inline-flex;position:relative;z-index:2;width:130px;height:130px;align-items:center;justify-content:center;overflow:visible;pointer-events:none;filter:drop-shadow(0 4px 5px #06335b35)}" +
    ".portfolio-robot-svg{display:block;position:relative;z-index:2;width:126px;height:131px;overflow:visible;transform-origin:center bottom;animation:portfolioRobotFloat 3s ease-in-out infinite}" +
    ".robot-eye{transform-box:fill-box;transform-origin:center;animation:portfolioRobotBlink 5.4s ease-in-out infinite}" +
    "#robotAntennaLight{transform-box:fill-box;transform-origin:center;animation:portfolioRobotPulse 1.8s ease-in-out infinite}" +
    "#portfolioRobotBubble{position:absolute;left:50%;bottom:126px;transform:translateX(-50%) scaleX(1)!important;transform-origin:center center;width:max-content;max-width:145px;padding:6px 9px;border-radius:12px;background:#fff;border:1px solid #bde8f4;box-shadow:0 3px 12px #08274b24;color:#16436b;font-size:10px;font-weight:700;line-height:1.2;text-align:center;white-space:normal;animation:portfolioBubbleFloat 2.8s ease-in-out infinite;pointer-events:none}" +
    "#portfolioRobotBubble:after{content:\"\";position:absolute;left:50%;bottom:-7px;width:12px;height:12px;background:#fff;border-right:1px solid #bde8f4;border-bottom:1px solid #bde8f4;transform:translateX(-50%) rotate(45deg)}" +
    "@keyframes portfolioBubbleFloat{0%,100%{translate:0 0}50%{translate:0 -3px}}" +
    "#portfolioChatWindow{display:none;position:fixed;left:auto;right:18px;bottom:150px;width:min(360px,calc(100vw - 36px));height:480px;max-height:calc(100vh - 285px);background:#fff;border:1px solid #d7e5f4;border-radius:18px;box-shadow:0 18px 55px #08274b30;overflow:hidden;flex-direction:column;pointer-events:auto}" +
    "@keyframes portfolioRobotFloat{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-7px) rotate(-1.5deg)}50%{transform:translateY(-2px) rotate(1deg)}75%{transform:translateY(-6px) rotate(-.8deg)}}" +
    "@keyframes portfolioRobotBlink{0%,43%,47%,100%{transform:scaleY(1)}45%{transform:scaleY(.12)}}" +
    "@keyframes portfolioRobotPulse{0%,100%{opacity:.72;filter:drop-shadow(0 0 2px #73e8ff)}50%{opacity:1;filter:drop-shadow(0 0 9px #73e8ff)}}" +
    "#portfolioChatToggle{isolation:isolate;overflow:visible}" +
    "#portfolioChatToggle::before{content:'';position:absolute;z-index:1;inset:15px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(119,231,255,.32),rgba(96,158,255,.12) 50%,transparent 72%);animation:portfolioRobotHalo 3.2s ease-in-out infinite}" +
    "@keyframes portfolioRobotHalo{0%,100%{transform:scale(.94);opacity:.55}50%{transform:scale(1.12);opacity:1}}" +
    "@media(prefers-reduced-motion:reduce){#portfolioChatToggle::before,.portfolio-robot-svg,.robot-eye,#robotAntennaLight,#portfolioRobotBubble{animation:none!important}}" +
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
    "@media(max-width:480px){#portfolioChatWidget{right:2px;bottom:4px;width:112px;height:112px}#portfolioChatToggle{width:106px;height:106px}.portfolio-robot{width:100px;height:100px}.portfolio-robot-svg{width:96px;height:100px}#portfolioRobotBubble{bottom:101px;max-width:130px;font-size:9px;padding:5px 7px}#portfolioChatWindow{right:10px;left:auto;bottom:120px;width:calc(100vw - 20px);height:min(500px,calc(100vh - 140px));max-height:calc(100vh - 140px)}}";
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
    '<button id="portfolioChatToggle" type="button" aria-expanded="false" aria-label="Robotito, abre el asistente virtual"><span id="portfolioRobotBubble">¡Hola! ¿En qué puedo ayudarte?</span><span class="portfolio-robot" aria-hidden="true"><svg class="portfolio-robot-svg" viewBox="0 0 240 260"><defs><linearGradient id="robotShell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#d9f5ff"/><stop offset="1" stop-color="#8bc9e8"/></linearGradient><linearGradient id="robotBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#79e8f3"/><stop offset="1" stop-color="#5478d9"/></linearGradient><linearGradient id="robotScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#163c68"/><stop offset="1" stop-color="#071a39"/></linearGradient></defs><ellipse cx="120" cy="244" rx="66" ry="9" fill="#174b78" opacity=".17"/><path d="M120 28V15" stroke="#6bcde8" stroke-width="7" stroke-linecap="round"/><circle id="robotAntennaLight" cx="120" cy="11" r="9" fill="#7cf1ff" stroke="#3186bb" stroke-width="3"/><path d="M77 105L58 122l-2 43q0 12 12 12h9M163 105l19 17 2 43q0 12-12 12h-9" fill="none" stroke="#4d91c6" stroke-width="14" stroke-linecap="round"/><circle cx="66" cy="181" r="12" fill="#dff8ff" stroke="#4d91c6" stroke-width="5"/><circle cx="174" cy="181" r="12" fill="#dff8ff" stroke="#4d91c6" stroke-width="5"/><rect x="91" y="142" width="58" height="21" rx="9" fill="#579bc8"/><path d="M94 157v18m52-18v18" stroke="#4c86b9" stroke-width="8" stroke-linecap="round"/><rect x="65" y="163" width="110" height="73" rx="25" fill="url(#robotBody)" stroke="#397eb4" stroke-width="5"/><rect x="88" y="178" width="64" height="39" rx="12" fill="#e5fbff"/><circle cx="108" cy="197" r="5" fill="#31a8d4"/><circle cx="132" cy="197" r="5" fill="#31a8d4"/><path d="M111 207q9 7 18 0" fill="none" stroke="#3183b8" stroke-width="3" stroke-linecap="round"/><rect x="87" y="231" width="25" height="19" rx="8" fill="#d4f4ff" stroke="#4c91c4" stroke-width="4"/><rect x="128" y="231" width="25" height="19" rx="8" fill="#d4f4ff" stroke="#4c91c4" stroke-width="4"/><path d="M67 56q0-21 22-21h62q22 0 22 21v53q0 29-29 29h-48q-29 0-29-29z" fill="url(#robotShell)" stroke="#5798c5" stroke-width="5"/><rect x="79" y="57" width="82" height="61" rx="19" fill="url(#robotScreen)" stroke="#8bdff3" stroke-width="4"/><g class="robot-eye"><ellipse cx="102" cy="85" rx="8" ry="12" fill="#71edff"/><ellipse cx="138" cy="85" rx="8" ry="12" fill="#71edff"/><circle cx="100" cy="81" r="2.5" fill="#fff"/><circle cx="136" cy="81" r="2.5" fill="#fff"/></g><path d="M108 103q12 9 24 0" fill="none" stroke="#7bf0ff" stroke-width="4" stroke-linecap="round"/><path d="M66 73H54q-10 0-10 11v14q0 10 10 10h12M174 73h12q10 0 10 11v14q0 10-10 10h-12" fill="#a8e6f4" stroke="#5798c5" stroke-width="5"/><circle cx="53" cy="91" r="4" fill="#fff"/><circle cx="187" cy="91" r="4" fill="#fff"/><path d="M88 44q32-18 64 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/></svg></span></button>';
  document.body.appendChild(widget);

  // Mascota original del asistente: robotito animado, sin transformaciones programadas.
  const robotToggle = document.getElementById("portfolioChatToggle");
  robotToggle.setAttribute("aria-label", "Robotito, abre el asistente virtual");

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
      return "¡Hola! 🤖 Soy Robotito, tu asistente del portafolio. Puedo contarte sobre el perfil académico publicado, los dos cursos y los trabajos disponibles. ¿Qué deseas consultar?";
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
    // Si el usuario no indica el curso, buscar la actividad en ambos cursos.
    // Ejemplo: "dame la actividad 2 de la semana 7".
    if (!course && /(trabajo|trabajos|actividad|actividades|archivo|documento|dame|mostrar|buscar|descargar|enlace|pdf|word)/.test(q) &&
        (getGlobalWeekFromQuestion(q) !== null || getPeriodFromQuestion(q) !== null || /actividad\s*(?:n(?:ro|umero)?\.?\s*)?#?\s*\d+/.test(q))) {
      const result = await loadPublicWorks();
      if (result.error) return result.error;
      let rows = [...result.data];
      const globalWeek = getGlobalWeekFromQuestion(q);
      const periodAsked = getPeriodFromQuestion(q);
      if (globalWeek !== null) {
        const parsed = localWeek(globalWeek);
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
      if (activityMatch) {
        const wanted = Number(activityMatch[1]);
        rows = rows.filter(w =>
          (w.actividad !== undefined && w.actividad !== null && Number(w.actividad) === wanted) ||
          normalizeText(w.titulo).includes("actividad " + wanted) ||
          normalizeText(w.archivo_nombre).includes("actividad " + wanted)
        );
      }
      if (!rows.length) {
        return "No encontré una actividad publicada que coincida con esa semana o período en los dos cursos. Verifica el número y, si quieres, dime también el nombre del curso. Los trabajos guardados no se modificaron.";
      }
      const weekLabel = globalWeek !== null ? " · Semana " + globalWeek : "";
      const periodLabel = periodAsked ? " · Período " + periodAsked : "";
      return "Encontré " + rows.length + " trabajo(s) coincidente(s)" + weekLabel + periodLabel + " en tus cursos:\n\n" +
        rows.slice(0, 12).map((w, i) => courseLabel(normalizeText(w.curso).includes("desarrollo") ? "desarrollo" : "algoritmos") + "\n" + describeWork(w, i)).join("\n\n") +
        (rows.length > 12 ? "\n\nMostrando los primeros 12 resultados." : "");
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
    if (/(que es un algoritmo|que es algoritmo|define algoritmo|definicion de algoritmo|explica.*algoritmo)/.test(q))
      return "¡Claro! ⚡ Un algoritmo es una secuencia finita, ordenada y precisa de pasos para resolver un problema o realizar una tarea. Debe indicar qué hacer, en qué orden y cuándo terminar.\n\nEjemplo para sumar dos números:\n1. Leer A y B.\n2. Calcular S = A + B.\n3. Mostrar S.\n\nEn programación, un algoritmo puede representarse con pseudocódigo, un diagrama de flujo o código. Sus características principales son instrucciones claras, resultado y fin en un número finito de pasos.";
    if (/(que es una estructura de datos|que son las estructuras de datos|estructura de datos|estructuras de datos)/.test(q))
      return "Una estructura de datos es una forma de organizar y almacenar información para usarla eficientemente. Ejemplos:\n• Arreglos: elementos accesibles por índice.\n• Matrices: datos en filas y columnas.\n• Listas: colección de elementos que puede crecer o reducirse.\n• Pilas: el último en entrar es el primero en salir (LIFO).\n• Colas: el primero en entrar es el primero en salir (FIFO). La elección depende de las operaciones que se necesiten.";
    if (/(pseudocodigo|diagrama de flujo)/.test(q))
      return "El pseudocódigo describe los pasos de un algoritmo con instrucciones parecidas al lenguaje humano, sin depender de un lenguaje específico. Un diagrama de flujo representa los pasos con símbolos y flechas: óvalo para inicio/fin, rectángulo para proceso, paralelogramo para entrada/salida y rombo para decisión.";
    if (/(arreglo|arreglos|array|matriz|matrices)/.test(q))
      return "Un arreglo almacena varios elementos bajo un mismo nombre y permite acceder a ellos mediante índices. Una matriz organiza elementos en filas y columnas. Operaciones comunes: recorrer, buscar, actualizar, sumar elementos y encontrar máximos o mínimos. En Java: int[] numeros = {3, 5, 8};";
    if (/(pila|pilas|cola|colas)/.test(q))
      return "Las pilas y colas son estructuras lineales. Una pila sigue LIFO: el último en entrar sale primero; sus operaciones típicas son push y pop. Una cola sigue FIFO: el primero en entrar sale primero; sus operaciones típicas son encolar y desencolar. Las pilas pueden servir para deshacer acciones y las colas para gestionar turnos.";
    if (/(condicional|condicionales|if else|ciclo|ciclos|bucle|bucles|for|while)/.test(q))
      return "Las estructuras de control determinan cómo avanza un algoritmo: la secuencia ejecuta instrucciones en orden; la selección (if/else, switch) elige entre alternativas; y la repetición (for, while, do-while) ejecuta instrucciones varias veces mientras se cumpla una condición.";
    if (/(metodo|metodos|funcion|funciones|poo|programacion orientada a objetos|encapsulamiento|herencia|polimorfismo|abstraccion|interfaz)/.test(q) && (course === "desarrollo" || /poo|programacion orientada a objetos|encapsulamiento|herencia|polimorfismo|abstraccion|interfaz/.test(q)))
      return "En Desarrollo de Aplicaciones, la programación orientada a objetos organiza el programa mediante clases y objetos. Una clase define atributos y métodos; un objeto es una instancia. Encapsulamiento protege el estado interno, herencia permite especializar una clase, polimorfismo permite distintas implementaciones de una interfaz común y abstracción destaca lo esencial. Los métodos agrupan acciones reutilizables y las interfaces definen operaciones que una clase debe implementar.";
    if (/(variable|variables|constante|constantes|tipo de dato|tipos de datos|int |string|boolean|double|float)/.test(q))
      return "En programación, una variable es un espacio con nombre donde se guarda un dato que puede cambiar durante la ejecución. Una constante representa un valor que no debe cambiar. Los tipos de datos indican qué clase de valor se almacena, por ejemplo enteros (int), decimales (double), texto (String) y valores lógicos (boolean). Elegir el tipo adecuado ayuda a evitar errores y a realizar operaciones correctas.";
    if (/(operador|operadores|operacion aritmetica|operadores logicos|operadores relacionales)/.test(q))
      return "Los operadores permiten trabajar con datos. Los aritméticos (+, -, *, /, %) calculan; los relacionales (==, !=, <, >, <=, >=) comparan; y los lógicos (&&, ||, !) combinan condiciones. Por ejemplo, edad >= 18 && tieneDocumento comprueba dos condiciones a la vez.";
    if (/(lista enlazada|listas enlazadas|nodo|nodos)/.test(q))
      return "Una lista enlazada es una estructura formada por nodos; cada nodo almacena un dato y una referencia al siguiente nodo (y, en una lista doble, también al anterior). A diferencia de un arreglo, sus elementos no necesitan estar contiguos en memoria. Es útil cuando se insertan o eliminan elementos con frecuencia.";
    if (/(busqueda|buscar elemento|busqueda lineal|busqueda binaria)/.test(q))
      return "La búsqueda permite localizar un elemento. La búsqueda lineal revisa los elementos uno por uno y funciona aunque no estén ordenados. La búsqueda binaria divide repetidamente el intervalo por la mitad, pero requiere que los datos estén ordenados. Para elegir, considera si la colección está ordenada y cuántas búsquedas realizarás.";
    if (/(ordenamiento|ordenar|burbuja|insercion|seleccion|quicksort|mergesort)/.test(q))
      return "Un algoritmo de ordenamiento organiza datos según un criterio, como de menor a mayor. Burbuja compara elementos vecinos e intercambia los que están en el orden incorrecto; selección busca el menor elemento restante; inserción coloca cada elemento en su posición dentro de la parte ya ordenada. Para comparar algoritmos se observa su tiempo de ejecución y uso de memoria.";
    if (/(recursividad|recursivo|recursion)/.test(q))
      return "La recursividad ocurre cuando una función se llama a sí misma para resolver un problema más pequeño. Necesita un caso base que detenga las llamadas y un paso recursivo que acerque la solución al caso base. Sin caso base correcto, puede producir llamadas infinitas o desbordamiento de pila.";
    if (/(complejidad|big o|notacion o|eficiencia|tiempo de ejecucion|memoria del algoritmo)/.test(q))
      return "La complejidad algorítmica describe cómo crece el costo de una solución al aumentar los datos. O(1) es constante; O(log n) crece logarítmicamente; O(n) recorre proporcionalmente los datos; O(n log n) aparece en varios ordenamientos eficientes; y O(n²) suele aparecer en algoritmos con dos recorridos anidados. Big O describe el crecimiento, no un tiempo exacto en segundos.";
    if (/(clase|clases|objeto|objetos|atributo|atributos|metodo|metodos|funcion|funciones|poo|programacion orientada a objetos|encapsulamiento|herencia|polimorfismo|abstraccion|interfaz|clase abstracta)/.test(q))
      return "En Desarrollo de Aplicaciones, la programación orientada a objetos organiza el código mediante clases y objetos. Una clase define atributos (datos) y métodos (acciones); un objeto es una instancia. Encapsulamiento protege el estado interno, herencia permite especializar una clase, polimorfismo permite distintas implementaciones bajo una interfaz común y abstracción destaca lo esencial. Las funciones o métodos permiten reutilizar instrucciones y separar responsabilidades.";
    if (/(arbol|arboles|arbol binario|arboles binarios|arbol de busqueda|abb|monticulo|heap|grafo|grafos|vertice|vertices|arista|aristas|recorrido en profundidad|dfs|recorrido en anchura|bfs|tabla hash|hashing|diccionario|conjunto|set|mapa|map|programacion dinamica|voraz|greedy|divide y venceras|divide and conquer|backtracking|vuelta atras|fibonacci|factorial|torre de hanoi|insertion sort|selection sort|bubble sort|quick sort|merge sort|shell sort|radix sort|busqueda binaria|busqueda lineal|ordenamiento|ordenar|complejidad|big o|notacion o|recursividad|recursion|lista doble|lista circular|lista simple|cola de prioridad|deque|lifo|fifo|lifo|fifo|tabla de verdad|expresion logica|logica booleana|caso base|pseudocodigo|diagrama de flujo|traza|prueba de escritorio|entrada|proceso|salida|eficiencia|memoria|tiempo de ejecucion)/.test(q)) {
      return "Este tema forma parte de Algoritmos y Estructura de Datos. Puedo explicarlo con definición, funcionamiento, pasos del algoritmo, ejemplo resuelto y código si corresponde.\n\nPara analizar cualquier problema, identifica: 1) entradas, 2) resultado esperado, 3) pasos o estrategia, 4) estructura de datos adecuada, 5) casos de prueba y 6) eficiencia en tiempo y memoria.\n\nSi me dices el tema exacto o compartes el enunciado, te lo desarrollo paso a paso y adapto el ejemplo a Java cuando sea útil.";
    }
    if (/(algoritmo|pseudocodigo|diagrama de flujo|arreglo|arreglos|array|matriz|matrices|pila|pilas|cola|colas|lista enlazada|listas enlazadas|ciclo|ciclos|bucle|bucles|condicional|condicionales|estructura de datos|programacion|codigo|java|depuracion|base de datos|interfaz|aplicacion|software)/.test(q))
      return "Esa pregunta está relacionada con tus cursos. En Algoritmos y Estructura de Datos, conviene identificar primero los datos de entrada, el proceso y el resultado esperado; luego elegir estructuras de control y datos apropiadas. En Desarrollo de Aplicaciones, se traduce la solución a código organizado, se divide en métodos o componentes y se prueba con distintos casos. Si me indicas el concepto exacto (por ejemplo, ciclos, arreglos, métodos, clases o bases de datos), te lo explico paso a paso con un ejemplo.";
    if (/(que es|que son|como funciona|como se hace|explica|explicame|para que sirve|diferencia entre|ejemplo de)/.test(q) && !course)
      return "Ese tema no parece estar relacionado con los dos cursos de este portafolio. Puedo ayudarte con Desarrollo de Aplicaciones o Algoritmos y Estructura de Datos. Pregúntame sobre variables, algoritmos, pseudocódigo, arreglos, estructuras de datos, métodos, clases, programación o actividades publicadas.";
    if (/(gracias|muchas gracias)/.test(q)) return "¡Con gusto! 🤖 Pregúntame por tu perfil, uno de los dos cursos o por una actividad/trabajo publicado."
    return "Puedo consultar el perfil académico público y los trabajos de estos dos cursos: Desarrollo de Aplicaciones y Algoritmos y Estructura de Datos. Prueba: «¿Qué temas tiene Desarrollo de Aplicaciones?» o «Dame la actividad 2 de Algoritmos, semana 5».";
  }

  // Se completará con la URL pública del servicio de Render después de desplegarlo.
  const AI_API_URL = "https://RENDER_SERVICE_URL.onrender.com/api/chat";

  async function ask(question) {
    const clean = question.trim();
    if (!clean) return;
    addMessage(clean, "user");
    const waiting = document.createElement("div");
    waiting.className = "portfolio-chat-msg portfolio-chat-bot";
    waiting.textContent = "Robotito está buscando la información…";
    messages.appendChild(waiting);
    messages.scrollTop = messages.scrollHeight;
    try {
      let answer;
      if (AI_API_URL.includes("RENDER_SERVICE_URL")) {
        // Hasta desplegar Render, conserva el asistente actual sin interrumpir sus funciones.
        answer = await reply(clean);
      } else {
        const history = [...messages.querySelectorAll(".portfolio-chat-msg")]
          .slice(-10)
          .map(el => ({
            role: el.classList.contains("portfolio-chat-user") ? "user" : "assistant",
            content: el.textContent.trim()
          }))
          .filter(m => m.content)
          .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
        const res = await fetch(AI_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "No se pudo consultar la API.");
        answer = data.answer || "No recibí una respuesta. Inténtalo de nuevo.";
      }
      waiting.remove();
      addMessage(answer, "bot");
    } catch (error) {
      waiting.remove();
      addMessage(error?.message || "No pude consultar la IA ahora. Inténtalo otra vez.", "bot");
    }
  }

  function openChat() {
    win.classList.add("open");
    win.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    if (!messages.childElementCount) addMessage("¡Hola! 🤖 Soy Robotito, tu asistente virtual. ¿Qué deseas saber o consultar? Puedes preguntarme por el perfil, los cursos, los trabajos o el área privada.", "bot");
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
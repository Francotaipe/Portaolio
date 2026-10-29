(() => {
  "use strict";
  if (document.getElementById("portfolioChatWidget")) return;

  const style = document.createElement("style");
  style.textContent =
    "#portfolioChatWidget{position:fixed;left:0;right:0;bottom:8px;z-index:9999;font-family:inherit;color:#10233f;pointer-events:none}" +
    "#portfolioChatToggle{pointer-events:auto;position:absolute;left:10px;bottom:0;display:flex;align-items:center;gap:8px;border:2px solid #d99000;border-radius:18px;padding:7px 12px 8px 7px;background:#fff6bd;color:#4b3200;font-weight:800;box-shadow:0 5px 18px #08274b40;cursor:pointer;animation:portfolioPikachuWalk 18s linear infinite}" +
    "#portfolioChatToggle:hover{animation-play-state:paused;transform:translateY(-3px)}" +
    ".portfolio-pikachu{display:inline-flex;width:68px;height:58px;flex:0 0 68px;align-items:center;justify-content:center;overflow:visible}" +
    ".portfolio-pikachu img{display:block;width:68px;height:58px;object-fit:contain;mix-blend-mode:darken;filter:drop-shadow(0 2px 2px #0003)}" +
    "#portfolioChatWindow{display:none;position:fixed;left:12px;bottom:82px;width:min(360px,calc(100vw - 24px));height:480px;max-height:calc(100vh - 110px);background:#fff;border:1px solid #d7e5f4;border-radius:18px;box-shadow:0 18px 55px #08274b30;overflow:hidden;flex-direction:column;pointer-events:auto}" +
    "@keyframes portfolioPikachuWalk{0%{left:10px}45%{left:calc(100vw - 175px)}50%{left:calc(100vw - 175px)}95%{left:10px}100%{left:10px}}" +
    "@keyframes portfolioPikachuBounce{from{transform:translateY(0) rotate(-3deg)}to{transform:translateY(-4px) rotate(3deg)}}" +
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
    '<button id="portfolioChatToggle" type="button" aria-expanded="false" aria-label="Pikachu, abre el asistente virtual"><span class="portfolio-pikachu" aria-hidden="true"><img src="https://clipart-library.com/data_images/428676.gif" alt="" loading="eager"></span><span>¡Pikachu!<br><small>¿Qué deseas consultar?</small></span></button>';
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
    item.textContent = text;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  }

  function reply(question) {
    const q = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (/(hola|buenas|buenos dias|buenas tardes|buenas noches|saludos)/.test(q))
      return "¡Hola! Soy el asistente del portafolio académico de Franco Roy Taipe Quispe. Puedo orientarte sobre su perfil, cursos, trabajos y acceso privado.";
    if (/(quien eres|perfil|presentacion|estudiante|nombre|carrera|upla)/.test(q))
      return "Este es el portafolio académico de Franco Roy Taipe Quispe, estudiante de Ingeniería de Sistemas y Computación en la Universidad Peruana Los Andes (UPLA). Aquí organiza sus actividades y trabajos universitarios.";
    if (/(curso|cursos|asignatura|asignaturas)/.test(q)) {
      document.getElementById("cursos")?.scrollIntoView({behavior:"smooth"});
      return "En la sección «Mis cursos» encontrarás Desarrollo de Aplicaciones y Algoritmos y Estructura de Datos. Selecciona un curso para consultar sus períodos y semanas.";
    }
    if (/(trabajo|trabajos|archivo|documento|actividad|actividades|semana|periodo|período)/.test(q)) {
      document.getElementById("cursos")?.scrollIntoView({behavior:"smooth"});
      return "Para consultar trabajos, abre «Mis cursos», elige un curso y después el período y la semana. La numeración es continua: período 1 (semanas 1–4), período 2 (5–8), período 3 (9–12) y período 4 (13–16).";
    }
    if (/(privad|iniciar sesion|login|entrar|acceso|subir|cargar)/.test(q))
      return "Para acceder al área privada, usa el botón «Iniciar sesión» en la parte superior. Desde el panel privado puedes administrar tus trabajos. No compartas tu contraseña en este chat.";
    if (/(dato|contacto|correo|email|telefono|celular)/.test(q)) {
      document.getElementById("datos")?.scrollIntoView({behavior:"smooth"});
      return "Puedes revisar la sección «Mis datos» del portafolio para consultar la información académica publicada.";
    }
    if (/(gracias|muchas gracias)/.test(q)) return "¡Con gusto! Si necesitas más ayuda, puedes preguntarme por el perfil, los cursos, los trabajos o el área privada.";
    return "Puedo ayudarte con el perfil académico, los cursos, cómo consultar trabajos y cómo ingresar al área privada. Prueba una de las opciones o formula tu pregunta de otra manera.";
  }

  function ask(question) {
    const clean = question.trim();
    if (!clean) return;
    addMessage(clean, "user");
    addMessage(reply(clean), "bot");
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
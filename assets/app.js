/* ABRXSVAV STATUS — asistente local + utilidades compartidas */
(function () {
  "use strict";

  /* ── nav: marca página activa ── */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page");
  });

  /* ── asistente local: búsqueda por puntuación sobre KB ── */
  function tokenize(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9ñ]+/).filter(function (w) { return w.length > 2; });
  }
  function search(query) {
    var qs = tokenize(query);
    if (!qs.length) return [];
    return KB.map(function (e) {
      var hay = tokenize(e.q + " " + e.tags.join(" ") + " " + e.a.replace(/<[^>]*>/g, " ")).join(" ");
      var score = 0;
      qs.forEach(function (w) {
        if (e.tags.join(" ").indexOf(w) >= 0) score += 3;
        if (tokenize(e.q).indexOf(w) >= 0) score += 2;
        if (hay.indexOf(w) >= 0) score += 1;
      });
      return { e: e, score: score };
    }).filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 3).map(function (r) { return r.e; });
  }

  var fab, panel, log, input, opened = false;
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function addMsg(role, html) {
    var m = el("div", "msg " + role, html);
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }
  function answer(query) {
    var hits = search(query);
    if (!hits.length) {
      return "No encontré esa información en mi base local. Prueba con palabras como " +
        "<i>canter, dresser, x-roll, handoff, delivery, mcp, instalar, estado</i> — o consulta la " +
        '<a href="support.html">página de soporte</a>.';
    }
    var h = hits[0];
    var html = h.a + '<span class="src">Más: <a href="' + h.link + '">ver sección</a></span>';
    if (hits.length > 1) {
      html += '<span class="src">Relacionado: ' + hits.slice(1).map(function (e) {
        return '<a href="' + e.link + '">' + e.q + "</a>";
      }).join(" · ") + "</span>";
    }
    return html;
  }
  function ask(q) {
    if (!q.trim()) return;
    addMsg("user", q.replace(/</g, "&lt;"));
    input.value = "";
    setTimeout(function () { addMsg("bot", answer(q)); }, 180);
  }

  function buildChat() {
    fab = el("button", "chat-fab", "✦");
    fab.title = "Asistente AbrxsVAV (local)";
    fab.setAttribute("aria-label", "Abrir asistente");
    panel = el("div", "chat-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Asistente AbrxsVAV");
    var head = el("div", "chat-head",
      '<span class="live-dot"></span><div><b>Asistente AbrxsVAV</b><span class="k">Respuestas locales · sin nube</span></div>');
    var close = el("button", "", "✕");
    close.style.cssText = "margin-left:auto;background:none;border:none;color:var(--tx2);cursor:pointer;font-size:14px";
    close.onclick = function () { panel.classList.remove("open"); opened = false; };
    head.appendChild(close);
    log = el("div", "chat-log");
    var chips = el("div", "chips");
    ["¿Qué hace cada estación?", "¿Cómo agrego b-rolls a 20 videos?", "¿Cómo entrego a DaVinci?",
     "¿Es gratis? ¿Qué necesita API key?", "¿En qué estado va?"].forEach(function (q) {
      var b = el("button", "", q);
      b.onclick = function () { ask(q); };
      chips.appendChild(b);
    });
    input = document.createElement("input");
    input.placeholder = "Pregunta sobre la app…";
    input.setAttribute("aria-label", "Pregunta al asistente");
    var send = el("button", "", "➤");
    send.setAttribute("aria-label", "Enviar");
    send.onclick = function () { ask(input.value); };
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") ask(input.value);
    });
    var ci = el("div", "chat-input");
    ci.appendChild(input); ci.appendChild(send);
    var priv = el("div", "privacy", "Asistente local: la búsqueda corre en tu navegador. Nada se envía a ningún servidor.");
    panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips);
    panel.appendChild(ci); panel.appendChild(priv);
    fab.onclick = function () {
      opened = !opened;
      panel.classList.toggle("open", opened);
      if (opened && !log.children.length) {
        addMsg("bot", "Hola — soy el asistente de AbrxsVAV. Pregúntame qué hace la app, cómo se " +
          "usa cada herramienta, los flujos de trabajo, errores comunes o el estado del proyecto.");
      }
      if (opened) input.focus();
    };
    document.body.appendChild(fab);
    document.body.appendChild(panel);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildChat);
  else buildChat();
})();

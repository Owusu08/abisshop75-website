/* Contact + sign-in forms (uses ABIS_validate from app.js) */
(function () {
  "use strict";
  var A = window.ABIS, CFG = (A && A.config) || {};
  var icon = A ? A.icon : function () { return ""; };
  var esc = A ? A.esc : function (s) { return s; };

  /* ---------- Contact ---------- */
  var cf = document.getElementById("contact-form");
  if (cf) {
    var q = new URLSearchParams(window.location.search).get("product");
    if (q) {
      cf.elements.topic.value = "retail";
      cf.elements.message.value = "Hello, I'd like to know more about " + q + ".";
    }
    if (window.location.hash === "#wholesale") { cf.elements.topic.value = "wholesale"; }
    cf.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!window.ABIS_validate(cf)) { return; }
      var f = cf.elements, topicText = f.topic.options[f.topic.selectedIndex].text;
      var text = "Hello ABISSHOP 75, my name is " + f.name.value.trim() + " (" + topicText + ").\n" + f.message.value.trim() + (f.phone.value.trim() ? "\nPhone: " + f.phone.value.trim() : "") + "\nEmail: " + f.email.value.trim();
      var wa = CFG.whatsapp ? '<a class="btn btn-gold" target="_blank" rel="noopener" href="https://wa.me/' + esc(CFG.whatsapp) + "?text=" + encodeURIComponent(text) + '">' + icon("message-circle") + " Continue on WhatsApp</a>" : "";
      var box = document.getElementById("contact-done");
      box.innerHTML = '<div class="success" role="status">' + icon("circle-check") + "<h2>Message received.</h2>" +
        "<p>Thank you, " + esc(f.name.value.trim().split(" ")[0]) + ". We will reply to <strong>" + esc(f.email.value.trim()) + "</strong> as soon as we can.</p>" +
        (CFG.previewMode ? '<p class="preview-note">' + icon("eye") + " Preview mode — messages are not sent anywhere yet.</p>" : "") + wa + "</div>";
      cf.hidden = true; box.hidden = false; box.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------- Sign in / create account ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-tab]"));
  var forms = { signin: document.getElementById("form-signin"), signup: document.getElementById("form-signup") };
  if (tabs.length) {
    var title = document.getElementById("auth-title"), sub = document.getElementById("auth-sub");
    var COPY = { signin: ["Welcome back", "Sign in to view your orders and saved pieces."], signup: ["Create your account", "Join for early access to new arrivals and member offers."] };
    var show = function (name) {
      tabs.forEach(function (t) { var on = t.getAttribute("data-tab") === name; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
      Object.keys(forms).forEach(function (k) { forms[k].hidden = k !== name; });
      title.textContent = COPY[name][0]; sub.textContent = COPY[name][1];
    };
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { show(t.getAttribute("data-tab")); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") { var o = tabs[tabs.indexOf(t) ? 0 : 1]; o.focus(); o.click(); }
      });
    });
    if (window.location.hash === "#signup") { show("signup"); }
    Object.keys(forms).forEach(function (k) {
      forms[k].addEventListener("submit", function (e) {
        e.preventDefault();
        if (!window.ABIS_validate(forms[k])) { return; }
        var done = document.getElementById("auth-done");
        var nm = forms[k].elements.name ? forms[k].elements.name.value.trim().split(" ")[0] : "";
        done.innerHTML = '<div class="success" role="status">' + icon("circle-check") + "<h2>" + (k === "signup" ? "Welcome" + (nm ? ", " + esc(nm) : "") + "." : "You're signed in.") + "</h2>" +
          "<p>Customer accounts are part of the upcoming online store. This page is a preview of how sign-in will look.</p>" +
          '<a class="btn btn-gold" href="products.html">Browse the collection ' + icon("arrow-right") + "</a></div>";
        forms.signin.hidden = forms.signup.hidden = true; document.getElementById("auth-tabs").hidden = true;
        title.hidden = sub.hidden = true; done.hidden = false;
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-pw-toggle]"), function (b) {
      b.addEventListener("click", function () {
        var inp = b.parentNode.querySelector("input"), show = inp.type === "password";
        inp.type = show ? "text" : "password";
        b.setAttribute("aria-label", show ? "Hide password" : "Show password");
        b.innerHTML = icon(show ? "eye-off" : "eye");
      });
    });
  }
})();

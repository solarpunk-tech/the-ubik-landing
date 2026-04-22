(function () {
  var SUPPORTED = [
    "en","de","fr","es","it","pt","nl","pl","sv","no","da","fi",
    "cs","sk","hu","ro","bg","hr","el","sl","et","lv","lt","mt"
  ];

  var LANG_NAMES = {
    en:"English", de:"Deutsch", fr:"Français", es:"Español",
    it:"Italiano", pt:"Português", nl:"Nederlands", pl:"Polski",
    sv:"Svenska", no:"Norsk", da:"Dansk", fi:"Suomi",
    cs:"Čeština", sk:"Slovenčina", hu:"Magyar", ro:"Română",
    bg:"Български", hr:"Hrvatski", el:"Ελληνικά", sl:"Slovenščina",
    et:"Eesti", lv:"Latviešu", lt:"Lietuvių", mt:"Malti"
  };

  function detectLang() {
    var saved = localStorage.getItem("ubik-lang");
    if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;

    var navLangs = (navigator.languages && navigator.languages.length)
      ? Array.from(navigator.languages)
      : [navigator.language || "en"];

    for (var i = 0; i < navLangs.length; i++) {
      var code = navLangs[i].split("-")[0].toLowerCase();
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return "en";
  }

  var currentLang = detectLang();
  var cache = {};

  function loadLang(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch("/locales/" + lang + ".json")
      .then(function (r) {
        if (!r.ok) throw new Error("locale " + lang + " not found");
        return r.json();
      })
      .then(function (data) {
        cache[lang] = data;
        return data;
      });
  }

  function apply(t) {
    var year = new Date().getFullYear();

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.dataset.i18n;
      if (t[key] === undefined) return;
      var val = t[key].replace("{year}", year);
      // Use innerHTML to support keys that embed links
      el.innerHTML = val;
    });

    if (t["page.title"]) document.title = t["page.title"];
    var descEl = document.querySelector('meta[name="description"]');
    if (descEl && t["meta.description"]) descEl.setAttribute("content", t["meta.description"]);

    document.documentElement.lang = currentLang;

    var picker = document.getElementById("lang-picker");
    if (picker) picker.value = currentLang;
  }

  function buildPicker() {
    var picker = document.getElementById("lang-picker");
    if (!picker) return;
    SUPPORTED.forEach(function (code) {
      var opt = document.createElement("option");
      opt.value = code;
      opt.textContent = LANG_NAMES[code];
      picker.appendChild(opt);
    });
    picker.value = currentLang;
    picker.addEventListener("change", function (e) {
      var lang = e.target.value;
      if (SUPPORTED.indexOf(lang) === -1) return;
      currentLang = lang;
      localStorage.setItem("ubik-lang", lang);
      loadLang(lang).then(apply).catch(function () {
        loadLang("en").then(apply);
      });
    });
  }

  function init() {
    buildPicker();
    loadLang(currentLang)
      .then(apply)
      .catch(function () {
        if (currentLang !== "en") {
          currentLang = "en";
          loadLang("en").then(apply);
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

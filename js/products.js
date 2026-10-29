/* Collection page: filter chips, live search, sorting, URL state */
(function () {
  "use strict";
  var A = window.ABIS; if (!A) { return; }
  var grid = document.getElementById("catalog-grid");
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var search = document.getElementById("catalog-search");
  var sort = document.getElementById("catalog-sort");
  var meta = document.getElementById("results-count");
  var empty = document.getElementById("catalog-empty");

  var FILTERS = {
    all: function () { return true; },
    perfume: function (p) { return p.category === "perfume"; },
    jewellery: function (p) { return p.category === "jewellery"; },
    best: function (p) { return p.tags.indexOf("best") > -1; },
    him: function (p) { return p.tags.indexOf("him") > -1; },
    unisex: function (p) { return p.tags.indexOf("unisex") > -1; },
    new: function (p) { return p.tags.indexOf("new") > -1; }
  };
  var LABEL = { all: "", perfume: "perfumes", jewellery: "jewellery pieces", best: "best sellers", him: "picks for him", unisex: "unisex fragrances", new: "new arrivals" };

  var params = new URLSearchParams(window.location.search);
  var state = {
    filter: FILTERS[params.get("filter")] ? params.get("filter") : "all",
    q: (params.get("q") || "").trim(),
    sort: "featured"
  };
  search.value = state.q;

  function matchesQuery(p, q) {
    if (!q) { return true; }
    var hay = (p.name + " " + p.desc + " " + p.category + " " + p.tags.join(" ")).toLowerCase();
    return q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
  }

  function render() {
    var list = A.products.filter(FILTERS[state.filter]).filter(function (p) { return matchesQuery(p, state.q); });
    if (state.sort === "low") { list.sort(function (a, b) { return (a.price == null) - (b.price == null) || a.price - b.price; }); }
    if (state.sort === "high") { list.sort(function (a, b) { return (a.price == null) - (b.price == null) || b.price - a.price; }); }
    if (state.sort === "az") { list.sort(function (a, b) { return a.name.localeCompare(b.name); }); }

    grid.innerHTML = list.map(function (p, i) { return A.card(p, i); }).join("");
    grid.hidden = !list.length; empty.hidden = !!list.length;
    var n = list.length;
    meta.textContent = n + (n === 1 ? " piece" : " pieces") + (state.filter !== "all" ? " · " + LABEL[state.filter] : "") + (state.q ? " · matching “" + state.q + "”" : "");
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-filter") === state.filter)); });
    A.observe();
    try {
      var u = new URL(window.location.href);
      state.filter === "all" ? u.searchParams.delete("filter") : u.searchParams.set("filter", state.filter);
      state.q ? u.searchParams.set("q", state.q) : u.searchParams.delete("q");
      window.history.replaceState(null, "", u.pathname + u.search + u.hash);
    } catch (e) { /* file:// may block this — safe to ignore */ }
  }

  chips.forEach(function (c) { c.addEventListener("click", function () { state.filter = c.getAttribute("data-filter"); render(); }); });
  search.addEventListener("input", function () { state.q = search.value.trim(); render(); });
  sort.addEventListener("change", function () { state.sort = sort.value; render(); });
  document.getElementById("clear-filters").addEventListener("click", function () {
    state.filter = "all"; state.q = ""; search.value = ""; render();
  });
  render();
})();

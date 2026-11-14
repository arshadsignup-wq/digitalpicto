/* Client-side site search over search-index.json. No dependencies, no network
   beyond the one index fetch. */
(function () {
  'use strict';
  var form = document.getElementById('search-form');
  var input = document.getElementById('q');
  var out = document.getElementById('search-results');
  var meta = document.getElementById('search-meta');
  if (!form || !input || !out) return;

  var index = null;

  function load() {
    if (index) return Promise.resolve(index);
    return fetch('search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { index = d; return d; });
  }

  function score(page, terms) {
    var s = 0;
    terms.forEach(function (t) {
      var title = page.t.toLowerCase();
      if (title === t) s += 60;
      if (title.indexOf(t) !== -1) s += 24;
      if (page.k.indexOf(t) !== -1) s += 14;
      if ((page.d || '').toLowerCase().indexOf(t) !== -1) s += 8;
      if (page.b.indexOf(t) !== -1) s += 3;
    });
    return s;
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!terms.length) {
      out.innerHTML = '';
      meta.textContent = 'Searching 54 pages across services, work, virtual assistants and the blog.';
      return;
    }
    var hits = index
      .map(function (p) { return { p: p, s: score(p, terms) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 25);

    meta.textContent = hits.length
      ? hits.length + (hits.length === 1 ? ' result for ' : ' results for ') + '“' + q + '”'
      : 'No results for “' + q + '”. Try a broader term.';

    out.innerHTML = hits.map(function (x) {
      return '<a class="search-hit" href="' + esc(x.p.u) + '">' +
             '<span class="search-hit-section">' + esc(x.p.s) + '</span>' +
             '<h2>' + esc(x.p.t) + '</h2>' +
             '<p>' + esc(x.p.d) + '</p></a>';
    }).join('');
  }

  function run() {
    var q = input.value.trim();
    load().then(function () { render(q); });
    var url = new URL(window.location);
    if (q) { url.searchParams.set('q', q); } else { url.searchParams.delete('q'); }
    window.history.replaceState({}, '', url);
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); run(); });

  var t;
  input.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(run, 180);
  });

  var initial = new URLSearchParams(window.location.search).get('q');
  if (initial) { input.value = initial; run(); } else { load(); }
})();

/* Dr Marc Divaris interactions du prototype (vanilla JS, sans dépendance) */
(function () {
  'use strict';

  /* --- Navigation : source unique, un seul niveau de dropdown ---
     Générée en JS pour rester cohérente sur toutes les pages. Seul
     "Interventions" ouvre un panneau (liste plate des 6 pôles) ; chaque
     pôle mène directement à sa page, qui gère sa propre hiérarchie de
     contenu (pas de cascade de sous-menus dans la nav elle-même). */
  var INTERVENTIONS_ITEMS = [
    ['Visage', 'visage.html'],
    ['Silhouette', 'silhouette.html'],
    ['Cheveux', 'cheveux.html'],
    ['Regard', 'interventions.html#regard'],
    ['Chirurgie intime', 'interventions.html#intime'],
    ['Injections', 'interventions.html#injections']
  ];

  var MENU = [
    { label: 'Vous orienter', href: 'index.html' },
    { label: 'Mirror Face Lift', href: 'methode.html' },
    { label: 'Interventions', href: 'interventions.html', children: INTERVENTIONS_ITEMS },
    { label: 'Parcours', href: 'parcours.html' },
    { label: 'Publications', href: 'publications.html' },
    { label: 'Journal', href: 'blog.html' }
  ];

  var CLOSE_DELAY = 350; // ms laisse le temps à la souris de glisser vers le panneau

  // Normalise en retirant un éventuel ".html" final : les serveurs statiques
  // (ex. `serve`, Netlify, Vercel) servent souvent des URLs "propres" du type
  // /methode plutôt que /methode.html la comparaison doit marcher dans les deux cas.
  function stripHtml(s) { return s.replace(/\.html$/, ''); }

  function currentFile() {
    var f = location.pathname.split('/').pop();
    return stripHtml(f && f.length ? f : 'index.html');
  }

  function isMobileNav() { return window.innerWidth <= 1080; }

  // Construit un <li> ; "Interventions" reçoit un panneau à plat (pas de
  // caret visible l'état ouvert/fermé se lit uniquement sur son propre lien).
  function renderItem(item, here) {
    var li = document.createElement('li');
    var isCurrent = stripHtml(item.href.split('#')[0]) === here;

    if (item.children && item.children.length) {
      li.className = 'has-menu';

      var top = document.createElement('a');
      top.className = 'top';
      top.href = item.href;
      top.textContent = item.label;
      top.setAttribute('aria-haspopup', 'true');
      top.setAttribute('aria-expanded', 'false');
      if (isCurrent) top.setAttribute('aria-current', 'page');
      li.appendChild(top);

      var sub = document.createElement('ul');
      sub.className = 'submenu';
      item.children.forEach(function (c) {
        var cl = document.createElement('li');
        var ca = document.createElement('a');
        ca.href = c[1]; ca.textContent = c[0];
        cl.appendChild(ca); sub.appendChild(cl);
      });
      li.appendChild(sub);

      // Mobile (pas de survol) : le lien devient le déclencheur de l'accordéon
      // plutôt qu'une navigation directe. Desktop : clic normal, le survol
      // ouvre déjà le panneau.
      top.addEventListener('click', function (e) {
        if (isMobileNav()) {
          e.preventDefault();
          var willOpen = !li.classList.contains('open-sub');
          li.classList.toggle('open-sub', willOpen);
          top.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        }
      });

      attachHoverIntent(li);
    } else {
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (isCurrent) a.setAttribute('aria-current', 'page');
      li.appendChild(a);
    }
    return li;
  }

  // Ouverture immédiate au survol, fermeture différée (la souris a le temps
  // de glisser depuis le lien vers le panneau sans que celui-ci se ferme).
  function attachHoverIntent(li) {
    var closeTimer = null;
    function open() {
      clearTimeout(closeTimer);
      li.classList.add('open-sub');
      li.querySelector('.top').setAttribute('aria-expanded', 'true');
    }
    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () {
        li.classList.remove('open-sub');
        li.querySelector('.top').setAttribute('aria-expanded', 'false');
      }, CLOSE_DELAY);
    }
    li.addEventListener('mouseenter', open);
    li.addEventListener('mouseleave', scheduleClose);
  }

  function buildNav() {
    var list = document.getElementById('nav-links');
    if (!list) return;
    var here = currentFile();
    list.innerHTML = '';

    MENU.forEach(function (item) {
      list.appendChild(renderItem(item, here));
    });

    var ctaLi = document.createElement('li');
    var cta = document.createElement('a');
    cta.className = 'nav-cta btn';
    cta.href = 'consultation.html';
    cta.textContent = 'Prendre rendez-vous';
    if (here === 'consultation') cta.setAttribute('aria-current', 'page');
    ctaLi.appendChild(cta);
    list.appendChild(ctaLi);
  }
  buildNav();

  /* --- Footer : source unique, identique sur toutes les pages ---
     Exception assumée : admin.html garde son propre footer minimal
     (espace privé, pas de plan du site à afficher) et n'a pas
     l'élément #site-footer ci-dessous, donc cette fonction l'ignore. */
  function buildFooter() {
    var footer = document.getElementById('site-footer');
    if (!footer) return;
    footer.innerHTML =
      '<div class="wrap">' +
        '<div class="footer-grid">' +
          '<div><h4>Cabinet</h4><address>Dr Marc Divaris<br>32 avenue Georges Mandel<br>75116 Paris</address></div>' +
          '<div><h4>Navigation</h4><ul>' +
            '<li><a href="methode.html">Mirror Face Lift</a></li>' +
            '<li><a href="interventions.html">Interventions</a></li>' +
            '<li><a href="parcours.html">Parcours</a></li>' +
            '<li><a href="publications.html">Publications</a></li>' +
            '<li><a href="blog.html">Journal</a></li>' +
            '<li><a href="consultation.html">Consultation</a></li>' +
          '</ul></div>' +
          '<div><h4>Pôles</h4><ul>' +
            '<li><a href="visage.html">Visage</a></li>' +
            '<li><a href="silhouette.html">Silhouette</a></li>' +
            '<li><a href="cheveux.html">Cheveux</a></li>' +
          '</ul></div>' +
          '<div><h4>Contact</h4><ul>' +
            '<li><a href="tel:+33145534014">01 45 53 40 14</a></li>' +
            '<li><a href="consultation.html">Prendre rendez-vous</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="legal">' +
          '<p>Les informations présentées sont générales et ne remplacent pas une consultation médicale.</p>' +
          '<p>© <span data-year>2026</span> Cabinet du Dr Marc Divaris. Tous droits réservés.</p>' +
        '</div>' +
      '</div>';
  }
  buildFooter();

  /* --- Menu mobile (hamburger + accordéon tactile) --- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) {
        Array.prototype.forEach.call(links.querySelectorAll('.has-menu.open-sub'), function (li) {
          li.classList.remove('open-sub');
        li.querySelector('.top').setAttribute('aria-expanded', 'false');
        });
      }
    });
    links.addEventListener('click', function (e) {
      var t = e.target;
      if (t.tagName === 'A' && !t.classList.contains('top')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Referme le panneau ouvert au clic en dehors de la nav (desktop).
  document.addEventListener('click', function (e) {
    if (links && !links.contains(e.target)) {
      Array.prototype.forEach.call(links ? links.querySelectorAll('.has-menu.open-sub') : [], function (li) {
        li.classList.remove('open-sub');
        li.querySelector('.top').setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !links) return;
    links.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    Array.prototype.forEach.call(links.querySelectorAll('.has-menu.open-sub'), function (li) {
      li.classList.remove('open-sub');
      li.querySelector('.top').setAttribute('aria-expanded', 'false');
    });
  });

  /* --- Slider de comparaison (avant/après illustratif) --- */
  var compare = document.getElementById('compare');
  if (compare) {
    var range = compare.querySelector('.compare-range');
    var paneA = compare.querySelector('.pane-a');
    var handle = compare.querySelector('.compare-handle');
    var grip = compare.querySelector('.compare-grip');
    var dragging = false;

    function setSplit(pct) {
      pct = Math.max(0, Math.min(100, pct));
      paneA.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
      grip.style.left = pct + '%';
      if (range) range.value = pct;
    }
    function pctFromX(clientX) {
      var r = compare.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    }
    if (range) range.addEventListener('input', function () { setSplit(parseFloat(range.value)); });
    compare.addEventListener('pointerdown', function (e) {
      dragging = true; compare.setPointerCapture(e.pointerId); setSplit(pctFromX(e.clientX));
    });
    compare.addEventListener('pointermove', function (e) { if (dragging) setSplit(pctFromX(e.clientX)); });
    compare.addEventListener('pointerup', function (e) { dragging = false; try { compare.releasePointerCapture(e.pointerId); } catch (x) {} });
    compare.addEventListener('pointercancel', function () { dragging = false; });
    setSplit(50);
  }

  /* --- Emplacements vidéo YouTube (façade -> iframe) ---
     Chaque .video-slot peut porter un data-youtube="ID". Au clic, on
     remplace la façade par l'iframe. Sans ID, on affiche une note. */
  var slots = document.querySelectorAll('.video-slot');
  Array.prototype.forEach.call(slots, function (slot) {
    slot.addEventListener('click', function () {
      var id = slot.getAttribute('data-youtube');
      if (!id) {
        slot.querySelector('.vs-note').textContent = 'Aucune vidéo associée pour l’instant emplacement réservé';
        return;
      }
      var iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.position = 'absolute';
      iframe.style.inset = '0';
      iframe.style.border = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.title = slot.getAttribute('aria-label') || 'Vidéo';
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      slot.innerHTML = '';
      slot.appendChild(iframe);
    });
  });

  /* --- Année dynamique footer --- */
  /* --- Lecteur intégré des publications scientifiques --- */
  var pdfReader = document.getElementById('pdf-reader');
  if (pdfReader) {
    var pdfFrame = document.getElementById('pdf-reader-frame');
    var pdfTitle = document.getElementById('pdf-reader-title');
    var pdfExternal = document.getElementById('pdf-reader-external');
    var pdfClose = pdfReader.querySelector('.pdf-reader-close');
    var lastPdfTrigger = null;

    Array.prototype.forEach.call(document.querySelectorAll('[data-pdf]'), function (trigger) {
      trigger.addEventListener('click', function () {
        var src = trigger.getAttribute('data-pdf');
        lastPdfTrigger = trigger;
        pdfTitle.textContent = trigger.getAttribute('data-pdf-title') || 'Publication';
        pdfFrame.src = src;
        pdfExternal.href = src;
        pdfReader.showModal();
      });
    });

    function closePdf() {
      pdfReader.close();
      pdfFrame.src = '';
    }
    pdfClose.addEventListener('click', closePdf);
    pdfReader.addEventListener('click', function (event) {
      if (event.target === pdfReader) closePdf();
    });
    pdfReader.addEventListener('close', function () {
      pdfFrame.src = '';
      if (lastPdfTrigger) lastPdfTrigger.focus();
    });
  }

  var y = document.querySelectorAll('[data-year]');
  Array.prototype.forEach.call(y, function (el) { el.textContent = new Date().getFullYear(); });
})();

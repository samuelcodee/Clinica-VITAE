/* Clínica Vitae — comportamento do site.
 * Lê tudo de window.CLINIC (config.js). Nenhum dado de formulário é
 * armazenado: a mensagem é montada no navegador e entregue ao WhatsApp. */
(function () {
  'use strict';

  var C = window.CLINIC || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idle = window.requestIdleCallback
    ? function (cb, timeout) { return window.requestIdleCallback(cb, { timeout: timeout }); }
    : function (cb) { return setTimeout(function () { cb({ timeRemaining: function () { return 10; } }); }, 50); };
  // roda depois que a página terminou de abrir (foto principal, fontes e estilos já baixados)
  function afterLoad(fn) {
    if (document.readyState === 'complete') fn(); else window.addEventListener('load', fn, { once: true });
  }

  /* ------------------------------------------------------------------
   * Ícones (traço fino, 24×24)
   * ------------------------------------------------------------------ */
  var TOOTH = 'M12 5.2C10.8 5.2 10 4 7.9 4 5.6 4 4 5.9 4 8.3c0 1.9.8 3.1 1.3 4.8.6 2.1.8 4.7 1.5 6.7.4 1.2 1.8 1.2 2.2 0l1.2-3.5c.3-.9 1.3-1.1 1.8-1.1s1.5.2 1.8 1.1l1.2 3.5c.4 1.2 1.8 1.2 2.2 0 .7-2 .9-4.6 1.5-6.7.5-1.7 1.3-2.9 1.3-4.8C20 5.9 18.4 4 16.1 4 14 4 13.2 5.2 12 5.2Z';
  var ICONS = {
    stethoscope: '<path d="M11 2v2M5 2v2M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/><path d="M20 3v4M22 5h-4"/>',
    aligner: '<path d="M3 8.5c2.4 4.2 5.4 6.3 9 6.3s6.6-2.1 9-6.3"/><path d="M3.2 11.8c2.5 3.6 5.4 5.4 8.8 5.4s6.3-1.8 8.8-5.4"/><path d="M6.6 12.9v2.6M10.2 14.6v2.6M13.8 14.6v2.6M17.4 12.9v2.6"/>',
    brackets: '<path d="M3 11c2.6 3.3 5.6 5 9 5s6.4-1.7 9-5"/><rect x="5" y="11.4" width="2.6" height="2.6" rx=".5"/><rect x="9.1" y="13.4" width="2.6" height="2.6" rx=".5"/><rect x="12.3" y="13.4" width="2.6" height="2.6" rx=".5"/><rect x="16.4" y="11.4" width="2.6" height="2.6" rx=".5"/>',
    implant: '<path d="M7.6 3.4c1.4-.6 2.9-.6 4.4 0 1.5-.6 3-.6 4.4 0 .9 2 .5 3.9-.8 5.1H8.4c-1.3-1.2-1.7-3.1-.8-5.1Z"/><path d="M10 8.5h4v2h-4z"/><path d="M10.4 10.5h3.2l-.6 9.2L12 21l-1-1.3z"/><path d="M9.6 13h4.8M9.9 15.5h4.2M10.3 18h3.4"/>',
    tooth: '<path d="' + TOOTH + '"/>',
    canal: '<path d="' + TOOTH + '"/><path d="M10.6 8.2v4.6M13.4 8.2v4.6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUp: '<path d="M7 17 17 7M8 7h9v9"/>',
    pin: '<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4.5M12 16h.01"/>',
    checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m8.5 12.2 2.4 2.4 4.6-4.9"/>'
  };
  function icon(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ------------------------------------------------------------------
   * Endereço, WhatsApp e mapas — um lugar só
   * ------------------------------------------------------------------ */
  var A = C.address || {};
  var hasAddress = !!(A.street && A.city);
  function addressLine() {
    if (!hasAddress) return '';
    var parts = [A.street];
    if (A.neighborhood) parts.push(A.neighborhood);
    parts.push(A.city + (A.state ? ' — ' + A.state : ''));
    return parts.join(', ') + (A.zip ? ', CEP ' + A.zip : '');
  }
  function mapsQuery() {
    if (C.geo && C.geo.lat != null) return C.geo.lat + ',' + C.geo.lng;
    return [A.street, A.neighborhood, A.city, A.state, A.zip].filter(Boolean).join(', ');
  }
  var Links = {
    whatsapp: function (text) {
      if (!C.whatsapp) return '';
      return 'https://wa.me/' + String(C.whatsapp).replace(/\D/g, '') + (text ? '?text=' + encodeURIComponent(text) : '');
    },
    tel: function () { return C.phone ? 'tel:' + String(C.phone).replace(/[^\d+]/g, '') : ''; },
    maps: function () { return hasAddress ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapsQuery()) : ''; },
    directions: function () { return hasAddress ? 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(mapsQuery()) : ''; },
    embed: function () {
      if (!hasAddress) return '';
      if (C.googleMapsEmbedKey) return 'https://www.google.com/maps/embed/v1/place?key=' + encodeURIComponent(C.googleMapsEmbedKey) + '&q=' + encodeURIComponent(mapsQuery());
      return 'https://www.google.com/maps?q=' + encodeURIComponent(mapsQuery()) + '&output=embed';
    },
    instagram: function () { return C.instagram && C.instagram[0] ? C.instagram[0].url : ''; }
  };
  var DEFAULT_WA_TEXT = 'Olá! Vim pelo site da Clínica Vitae e gostaria de mais informações.';

  function serviceById(id) {
    return (C.services || []).filter(function (s) { return s.id === id; })[0] || null;
  }

  /* ------------------------------------------------------------------
   * Dados da config nos elementos [data-bind] e [data-href]
   * ------------------------------------------------------------------ */
  function hoursText() {
    var h = C.openingHours || [];
    if (!h.length) return C.scheduleNote || '';
    return h.map(function (x) { return x.days + ': ' + x.hours; }).join(' · ');
  }
  function igLink(p) {
    return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">@' + esc(p.handle) + '</a>';
  }
  function renderInstagram() {
    var list = C.instagram || [];
    $$('[data-instagram-list]').forEach(function (el) {
      var items = el.getAttribute('data-instagram-list') === 'more' ? list.slice(1) : list;
      if (!items.length) { (el.closest('.contacts__more') || el).hidden = true; return; }
      el.innerHTML = items.map(igLink).join(el.getAttribute('data-instagram-list') === 'more' ? ' · ' : '');
    });
  }
  function bindConfig() {
    var values = {
      phoneDisplay: C.phoneDisplay || '',
      address: addressLine(),
      street: A.street || '',
      cityLine: [A.neighborhood, A.city && A.city + (A.state ? ' — ' + A.state : ''), A.zip && 'CEP ' + A.zip].filter(Boolean).join(' · '),
      hours: hoursText(),
      hoursInline: (C.openingHours || []).length ? hoursText() : hoursText().charAt(0).toLowerCase() + hoursText().slice(1),
      cro: C.technicalResponsible && C.technicalResponsible.cro,
      instagram: C.instagram && C.instagram[0] ? '@' + C.instagram[0].handle : '',
      year: String(new Date().getFullYear())
    };
    $$('[data-bind]').forEach(function (el) {
      var v = values[el.getAttribute('data-bind')];
      if (v) { el.textContent = v; el.classList.remove('pending'); }
      // sem valor: o texto padrão do HTML ("a confirmar") continua visível
    });
    $$('[data-href]').forEach(function (el) {
      var kind = el.getAttribute('data-href');
      var url = kind === 'whatsapp' ? Links.whatsapp(el.getAttribute('data-wa-text') || DEFAULT_WA_TEXT) : (Links[kind] ? Links[kind]() : '');
      if (url) {
        el.setAttribute('href', url);
        if (/^https?:/.test(url)) { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
      } else {
        // destino não configurado: não deixa link quebrado na página
        el.hidden = true;
      }
    });
  }

  /* ------------------------------------------------------------------
   * Listas geradas a partir da config
   * ------------------------------------------------------------------ */
  function renderServices() {
    var list = $('#services-list');
    var services = C.services || [];
    if (list) {
      list.innerHTML = services.map(function (s, i) {
        var ask = Links.whatsapp('Olá! Gostaria de saber mais sobre ' + s.name.toLowerCase() + ' na Clínica Vitae.');
        return '<li class="svc-row" data-reveal style="--d:' + (i % 3) * 70 + 'ms">' +
          '<div>' + icon(s.icon, 'svc-row__icon') + '</div>' +
          '<div class="svc-row__main">' +
            '<div class="svc-row__title"><span class="svc-row__num">' + String(i + 1).padStart(2, '0') + '</span><h3>' + esc(s.name) + '</h3></div>' +
            '<p class="svc-row__cat">' + esc(s.category) + '</p>' +
            '<p class="svc-row__desc">' + esc(s.description) + '</p>' +
          '</div>' +
          '<div class="svc-row__actions">' +
            '<a class="link-arrow" href="#agendamento" data-book="' + esc(s.id) + '">Agendar' + icon('arrow') + '<span class="sr-only"> ' + esc(s.name) + '</span></a>' +
            (ask ? '<a class="link-arrow link-arrow--quiet" href="' + esc(ask) + '" target="_blank" rel="noopener">Tirar dúvidas<span class="sr-only"> sobre ' + esc(s.name) + ' no WhatsApp</span></a>' : '') +
          '</div>' +
        '</li>';
      }).join('');
    }
    var foot = $('#footer-services');
    if (foot) {
      foot.innerHTML = services.map(function (s) {
        return '<li><a href="#agendamento" data-book="' + esc(s.id) + '">' + esc(s.name) + '</a></li>';
      }).join('');
    }
  }

  function renderFaq() {
    var box = $('#faq-list');
    if (!box) return;
    var names = (C.services || []).map(function (s) { return s.name.toLowerCase(); });
    var servicesText = names.length ? names.slice(0, -1).join(', ') + ' e ' + names[names.length - 1] : '';
    servicesText = servicesText.charAt(0).toUpperCase() + servicesText.slice(1);
    var igText = (C.instagram || []).map(function (p) { return '@' + p.handle; }).join(', ');
    var fill = function (t) {
      return t.replace(/\{telefone\}/g, C.phoneDisplay || 'WhatsApp da clínica')
        .replace(/\{endereco\}/g, addressLine() || 'localização a confirmar')
        .replace(/\{servicos\}/g, servicesText)
        .replace(/\{instagram\}/g, igText);
    };
    box.innerHTML = (C.faq || []).map(function (item, i) {
      var id = 'qa-' + (i + 1);
      return '<div class="qa">' +
        '<h3><button class="qa__q" type="button" id="' + id + '" aria-expanded="false" aria-controls="' + id + '-p">' +
          '<span>' + esc(item.q) + '</span><span class="qa__icon" aria-hidden="true"></span></button></h3>' +
        '<div class="qa__panel" id="' + id + '-p" role="region" aria-labelledby="' + id + '"><div><p>' + esc(fill(item.a)) + '</p></div></div>' +
      '</div>';
    }).join('');
    box.addEventListener('click', function (e) {
      var btn = e.target.closest('.qa__q');
      if (!btn) return;
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.closest('.qa').classList.toggle('is-open', open);
    });
  }

  /* ------------------------------------------------------------------
   * Barra fixa, link ativo e botão flutuante
   * ------------------------------------------------------------------ */
  function initChrome() {
    var topbar = $('#topbar');
    var hero = $('#inicio');
    var wa = $('.wa-float');
    var booking = $('#agendamento');
    // Observadores em vez de medir a página a cada rolagem: nada de layout forçado.
    var heroVisible = true, heroMostly = true, formInView = false;
    function sync() {
      if (topbar) topbar.classList.toggle('is-visible', !heroVisible);
      if (hero) hero.classList.toggle('is-away', !heroVisible);
      // o botão flutuante fica de fora da primeira dobra (que já tem os botões de
      // agendamento) e some enquanto o formulário está na tela, para não cobrir o envio
      if (wa) wa.classList.toggle('is-hidden', heroMostly || formInView);
    }
    if ('IntersectionObserver' in window && hero) {
      new IntersectionObserver(function (en) {
        heroVisible = en[0].isIntersecting;
        sync();
      }, { rootMargin: '-140px 0px 0px 0px' }).observe(hero);
      new IntersectionObserver(function (en) {
        heroMostly = en[0].intersectionRatio > .5;
        sync();
      }, { threshold: [0, .5, 1] }).observe(hero);
      if (booking) new IntersectionObserver(function (en) {
        formInView = en[0].isIntersecting;
        sync();
      }, { rootMargin: '-40% 0px -40% 0px' }).observe(booking);
    } else {
      heroVisible = heroMostly = false;
      sync();
    }

    var links = $$('.topbar__nav a[href^="#"]');
    if ('IntersectionObserver' in window && links.length) {
      var byId = {};
      links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          // seções sem item no menu (doutora, agendamento, dúvidas) não deixam outro item aceso
          var a = byId[en.target.id];
          if (a) a.setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('main > section[id]').forEach(function (s) { io.observe(s); });
    }
  }

  /* ------------------------------------------------------------------
   * Menu mobile
   * ------------------------------------------------------------------ */
  var drawer, burger, closeWatcher = null;
  function setDrawer(open) {
    if (!drawer || open === drawer.classList.contains('is-open')) return;
    // Antes de desativar o menu, tira o foco de dentro dele. Se o navegador fizer isso
    // sozinho, o foco "pula" e cancela a rolagem animada que o link acabou de iniciar.
    if (!open && drawer.contains(document.activeElement)) burger.focus({ preventScroll: true });
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (open) drawer.removeAttribute('inert'); else drawer.setAttribute('inert', '');
    document.body.style.overflow = open ? 'hidden' : '';
    // No Android, o gesto/botão "voltar" fecha o menu em vez de sair do site
    if (open && 'CloseWatcher' in window) {
      try {
        closeWatcher = new window.CloseWatcher();
        closeWatcher.onclose = function () { closeWatcher = null; setDrawer(false); };
      } catch (err) { closeWatcher = null; }
    }
    if (!open && closeWatcher) { var w = closeWatcher; closeWatcher = null; w.destroy(); }
    if (open) {
      var first = $('.drawer__nav a', drawer);
      if (first) setTimeout(function () { if (drawer.classList.contains('is-open')) first.focus({ preventScroll: true }); }, 350);
    }
  }
  // Se a pessoa mexer na página (dedo, roda do mouse, teclado), a correção para na hora:
  // o site nunca "puxa de volta" quem já está rolando por conta própria.
  var USER_SCROLL = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
  var stopNav = null; // encerra a navegação em andamento, se houver
  /*
   * Leva até uma seção. As seções abaixo da dobra são montadas sob demanda
   * (content-visibility), então as do meio do caminho podem mudar de altura
   * enquanto a página rola: ao terminar, conferimos onde paramos e corrigimos.
   * opts: { hash, focus (padrão true), onArrive }
   */
  function goToSection(target, opts) {
    opts = opts || {};
    if (stopNav) stopNav(); // um novo link substitui a navegação anterior
    if (opts.focus !== false) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    var behavior = reduceMotion ? 'auto' : 'smooth';
    var pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    var tries = 0, finished = false, timer = 0;
    var stop = function () {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      window.removeEventListener('scrollend', check);
      USER_SCROLL.forEach(function (t) { window.removeEventListener(t, stop, true); });
      if (stopNav === stop) stopNav = null;
    };
    var check = function () {
      if (finished) return;
      var off = target.getBoundingClientRect().top - pad;
      if (Math.abs(off) > 3 && tries++ < 4) {
        target.scrollIntoView({ behavior: behavior, block: 'start' });
        arm();
      } else {
        stop();
        if (opts.onArrive) opts.onArrive();
      }
    };
    // rede de segurança para navegadores sem o evento scrollend (ou quando nem houve rolagem)
    var arm = function () { clearTimeout(timer); timer = setTimeout(check, 1400); };
    if ('onscrollend' in window) window.addEventListener('scrollend', check);
    USER_SCROLL.forEach(function (t) { window.addEventListener(t, stop, { capture: true, passive: true }); });
    stopNav = stop;
    var y0 = window.scrollY;
    target.scrollIntoView({ behavior: behavior, block: 'start' });
    if (opts.hash && history.pushState) history.pushState(null, '', opts.hash);
    arm();
    // já estava no lugar (nada rolou): confere logo, sem esperar a rede de segurança
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (window.scrollY === y0) check(); }); });
  }
  // Todos os links internos (#secao) passam pela rolagem conferida
  function initInPageLinks() {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.hasAttribute('data-book') || a.closest('#drawer')) return;
      var hash = a.getAttribute('href');
      var target = hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
      if (!target) return;
      e.preventDefault();
      goToSection(target, { hash: hash });
    });
  }
  // Depois que a página abre, monta as seções restantes em tempo ocioso, uma por vez.
  // A abertura continua leve e, quando a pessoa for navegar, as alturas já são as reais.
  function renderRestInIdle() {
    var secs = $$('main > .sec, .footer');
    var i = 0;
    var step = function (deadline) {
      // fatias curtas (~8 ms): num celular simples, um toque nunca espera por esta montagem
      var t0 = performance.now();
      while (i < secs.length && deadline.timeRemaining() > 6 && performance.now() - t0 < 8) {
        secs[i].classList.add('is-rendered');
        void secs[i].offsetHeight; // monta esta seção agora, dentro do tempo ocioso
        i++;
      }
      if (i < secs.length) idle(step, 1200);
    };
    afterLoad(function () { idle(step, 2500); });
  }

  /*
   * Fotos abaixo da dobra. No HTML elas ficam em data-src/data-srcset para não
   * disputarem a conexão com a foto principal. Depois da abertura, cada seção baixa
   * as suas quando chega perto da tela e, em seguida, o resto baixa em segundo plano
   * (menos no modo de economia de dados): a rolagem nunca encontra foto em branco.
   * Observamos as seções, e não as fotos, porque o conteúdo de uma seção fora da tela
   * não é montado (content-visibility) e a foto em si ainda não tem posição.
   */
  function initLazyMedia() {
    if (!$('img[data-src]')) return;
    function load(img) {
      if (!img.hasAttribute('data-src')) return;
      var pic = img.parentNode && img.parentNode.tagName === 'PICTURE' ? img.parentNode : null;
      if (pic) $$('source[data-srcset]', pic).forEach(function (s) { s.srcset = s.getAttribute('data-srcset'); s.removeAttribute('data-srcset'); });
      var shown = function () { img.classList.add('is-loaded'); };
      img.addEventListener('load', shown, { once: true });
      img.addEventListener('error', shown, { once: true });
      if (img.hasAttribute('data-srcset')) { img.srcset = img.getAttribute('data-srcset'); img.removeAttribute('data-srcset'); }
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }
    var loadIn = function (root) { $$('img[data-src]', root).forEach(load); };
    afterLoad(function () {
      if (!('IntersectionObserver' in window)) { loadIn(document); return; }
      var holders = [];
      $$('img[data-src]').forEach(function (img) {
        var h = img.closest('.sec, .footer') || img;
        if (holders.indexOf(h) < 0) holders.push(h);
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); loadIn(en.target); } });
      }, { rootMargin: '150% 0px' });
      holders.forEach(function (h) { io.observe(h); });
      var saveData = navigator.connection && navigator.connection.saveData;
      if (!saveData) idle(function () { loadIn(document); }, 3000);
    });
  }
  function initDrawer() {
    drawer = $('#drawer');
    burger = $('.burger');
    if (!drawer || !burger) return;
    burger.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { setDrawer(false); return; }
      var a = e.target.closest('a');
      if (!a) return;
      var hash = a.getAttribute('href') || '';
      var target = hash.length > 1 && hash.charAt(0) === '#' && !a.hasAttribute('data-book') ? document.querySelector(hash) : null;
      if (target) { e.preventDefault(); setDrawer(false); goToSection(target, { hash: hash }); return; }
      setDrawer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (!drawer.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setDrawer(false); burger.focus(); return; }
      // Tab fica preso entre o botão de fechar e os itens do menu enquanto ele estiver aberto
      if (e.key === 'Tab') {
        var items = [burger].concat($$('a[href], button', drawer));
        var i = items.indexOf(document.activeElement);
        var next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === -1 || i === items.length - 1 ? 0 : i + 1);
        e.preventDefault();
        items[next].focus();
      }
    });
    window.matchMedia('(min-width: 1080px)').addEventListener('change', function (m) { if (m.matches) setDrawer(false); });
  }

  /* ------------------------------------------------------------------
   * Revelação ao rolar
   * ------------------------------------------------------------------ */
  function initReveal() {
    var els = $$('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
   * Antes / depois
   * ------------------------------------------------------------------ */
  function initCompare() {
    $$('.compare__stage').forEach(function (stage) {
      var range = $('.compare__range', stage);
      if (!range) return;
      var set = function () { stage.style.setProperty('--pos', range.value + '%'); };
      range.addEventListener('input', set);
      set();

      // Dedo e mouse em qualquer ponto da foto. No toque, só vira arraste depois de um
      // movimento horizontal claro: quem está rolando a página na vertical não mexe no corte.
      var pointer = null, startX = 0, dragging = false, rect = null, frame = 0, lastX = 0;
      var moveTo = function (x) {
        lastX = x;
        if (frame) return;
        frame = requestAnimationFrame(function () {
          frame = 0;
          var pct = Math.max(0, Math.min(100, ((lastX - rect.left) / rect.width) * 100));
          range.value = String(Math.round(pct));
          set();
        });
      };
      var begin = function (e) {
        dragging = true;
        stage.classList.add('is-dragging');
        try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ponteiro já liberado */ }
      };
      var end = function (e) {
        if (e.pointerId !== pointer) return;
        if (!dragging && e.type === 'pointerup') moveTo(e.clientX); // toque rápido: pula para o ponto
        pointer = null; dragging = false;
        stage.classList.remove('is-dragging');
      };
      stage.addEventListener('pointerdown', function (e) {
        if (e.button > 0 || pointer !== null) return;
        pointer = e.pointerId; startX = e.clientX; rect = stage.getBoundingClientRect();
        if (e.pointerType === 'mouse') { e.preventDefault(); begin(e); moveTo(e.clientX); }
      });
      stage.addEventListener('pointermove', function (e) {
        if (e.pointerId !== pointer) return;
        if (!dragging && Math.abs(e.clientX - startX) > 6) begin(e);
        if (dragging) moveTo(e.clientX);
      });
      stage.addEventListener('pointerup', end);
      stage.addEventListener('pointercancel', end); // o navegador assumiu a rolagem vertical
    });
  }

  /* ------------------------------------------------------------------
   * Vídeo da doutora
   * ------------------------------------------------------------------ */
  function initVideo() {
    $$('[data-video]').forEach(function (wrap) {
      var video = $('video', wrap);
      var btn = $('.vplay', wrap);
      if (!video || !btn) return;
      // sem JS o vídeo fica com os controles nativos; com JS, capa com botão de play
      video.removeAttribute('controls');
      btn.hidden = false;
      btn.addEventListener('click', function () {
        video.setAttribute('controls', '');
        // play() devolve uma promessa que é rejeitada se a pessoa pausar antes de o
        // vídeo começar; os controles nativos continuam disponíveis, então só ignoramos
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
        btn.hidden = true;
      });
      video.addEventListener('ended', function () { btn.hidden = false; });
    });
  }

  /* ------------------------------------------------------------------
   * Mapa (carrega o Google Maps só depois do clique)
   * ------------------------------------------------------------------ */
  function initMap() {
    var map = $('#map');
    if (!map) return;
    var addr = $('.map__addr', map);
    var btn = $('[data-load-map]', map);
    var note = $('.map__note', map);
    if (!hasAddress) {
      if (addr) addr.textContent = 'Localização disponível em breve.';
      if (btn) btn.hidden = true;
      if (note) note.hidden = true;
      return;
    }
    if (addr) addr.textContent = A.street;
    if (btn) btn.addEventListener('click', function () {
      // um mapa só, mesmo com toque duplo ou clique repetido
      if (btn.disabled || $('iframe', map)) return;
      btn.disabled = true;
      btn.textContent = 'Carregando o mapa…';
      var iframe = document.createElement('iframe');
      iframe.src = Links.embed();
      iframe.title = 'Mapa com a localização da Clínica Vitae';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      map.appendChild(iframe);
      var ph = $('.map__ph', map);
      iframe.addEventListener('load', function () { if (ph) ph.hidden = true; });
    });
  }

  /* ------------------------------------------------------------------
   * Política de privacidade
   * ------------------------------------------------------------------ */
  function initPrivacy() {
    var dlg = $('#privacy');
    if (!dlg) return;
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-privacy]')) {
        e.preventDefault();
        if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
      }
      if (e.target.closest('[data-privacy-close]')) dlg.close ? dlg.close() : dlg.removeAttribute('open');
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* ------------------------------------------------------------------
   * Agendamento em 3 etapas → mensagem no WhatsApp
   * ------------------------------------------------------------------ */
  var Booking = (function () {
    var form, steps, nextBtn, backBtn, nextLabel, count, done, alertBox;
    var STEP_NAMES = ['Serviço', 'Data e horário', 'Seus dados'];
    var state = { step: 1, service: '', professional: '', date: '', time: '', name: '', note: '' };

    function todayISO() {
      var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 10);
    }
    function serviceName(id) {
      if (id === 'outro') return C.otherServiceLabel || 'Outro';
      var s = serviceById(id); return s ? s.name : '';
    }
    function professionalName(id) {
      var p = (C.professionals || []).filter(function (x) { return x.id === id; })[0];
      return p ? p.name : '';
    }
    function formatDate(iso) {
      if (!iso) return '';
      var p = iso.split('-').map(Number);
      var d = new Date(p[0], p[1] - 1, p[2]);
      var s = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
      return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function buildMessage() {
      var lines = [
        'Olá! Gostaria de solicitar um agendamento na Clínica Vitae.',
        '',
        'Nome: ' + state.name.trim(),
        'Serviço desejado: ' + serviceName(state.service)
      ];
      if (state.professional) lines.push('Profissional: ' + professionalName(state.professional));
      lines.push('Data desejada: ' + formatDate(state.date));
      lines.push('Horário desejado: ' + state.time);
      if (state.note.trim()) lines.push('Observações: ' + state.note.trim());
      lines.push('', 'Aguardo o retorno para confirmar a disponibilidade.', '', 'Obrigado(a)!');
      return lines.join('\n');
    }

    function setError(key, msg) {
      var box = $('#err-' + key);
      var input = key === 'service' ? null : $('#b-' + key);
      if (box) {
        box.innerHTML = msg ? icon('alert') + '<span>' + esc(msg) + '</span>' : '';
        box.hidden = !msg;
      }
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }
    function validate(step) {
      var errors = {};
      if (step === 1 && !state.service) errors.service = 'Escolha o serviço desejado para continuar.';
      if (step === 2) {
        if (!state.date) errors.date = 'Informe a data desejada.';
        else if (state.date < todayISO()) errors.date = 'Escolha uma data a partir de hoje.';
        if (!state.time) errors.time = 'Informe o horário desejado.';
      }
      if (step === 3 && state.name.trim().length < 2) errors.name = 'Informe seu nome.';
      ['service', 'date', 'time', 'name'].forEach(function (k) { setError(k, errors[k] || ''); });
      var first = Object.keys(errors)[0];
      if (first) {
        var target = first === 'service' ? $('input[name="service"]', form) : $('#b-' + first);
        if (target) target.focus();
      }
      return !first;
    }

    function renderSummary() {
      var dl = $('#summary-list');
      if (!dl) return;
      var rows = [
        ['Serviço', serviceName(state.service), 1],
        ['Profissional', state.professional ? professionalName(state.professional) : 'Sem preferência', 1],
        ['Data', formatDate(state.date), 2],
        ['Horário', state.time, 2]
      ];
      dl.innerHTML = rows.map(function (r) {
        return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd><dd><button type="button" class="summary__edit" data-goto="' + r[2] + '">Alterar<span class="sr-only"> ' + r[0].toLowerCase() + '</span></button></dd></div>';
      }).join('');
    }

    function render(focus) {
      form.setAttribute('data-step', String(state.step));
      steps.forEach(function (el) {
        var on = Number(el.getAttribute('data-step')) === state.step;
        var entering = on && el.hidden;
        el.hidden = !on;
        if (entering && !reduceMotion && el.animate) {
          el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
            { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
        }
      });
      count.textContent = 'Etapa ' + state.step + ' de 3 · ' + STEP_NAMES[state.step - 1];
      nextLabel.textContent = state.step === 3 ? 'Enviar pelo WhatsApp' : 'Continuar';
      backBtn.tabIndex = state.step > 1 ? 0 : -1;
      backBtn.setAttribute('aria-hidden', state.step > 1 ? 'false' : 'true');
      if (state.step === 3) renderSummary();
      if (focus) {
        var legend = $('.bstep[data-step="' + state.step + '"] .bstep__title', form);
        if (legend) { legend.setAttribute('tabindex', '-1'); legend.focus({ preventScroll: true }); }
        keepFormTopInView();
      }
    }
    // No celular, o botão "Continuar" fica bem abaixo do título da etapa. Ao trocar de
    // etapa, se o topo do formulário ficou acima da tela, rola até ele.
    function keepFormTopInView() {
      var pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (form.getBoundingClientRect().top < pad) {
        form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }

    function go(step) { state.step = step; render(true); }

    function send() {
      alertBox.hidden = true;
      var url = Links.whatsapp(buildMessage());
      if (!url) {
        alertBox.textContent = 'O WhatsApp da clínica ainda não foi configurado. Ligue para a clínica para agendar.';
        alertBox.hidden = false;
        return;
      }
      nextBtn.disabled = true;
      nextBtn.classList.add('is-loading');
      nextLabel.textContent = 'Abrindo o WhatsApp…';
      // No computador, a aba é aberta ainda dentro do clique (evita bloqueio de pop-up).
      // No celular, o WhatsApp abre na hora (logo após mostrar o "Abrindo…"), ainda dentro
      // da janela em que o navegador considera a navegação um toque da pessoa e abre o app.
      var mobile = window.matchMedia('(pointer: coarse)').matches;
      var win = null;
      if (!mobile) { try { win = window.open('', '_blank'); if (win) win.opener = null; } catch (err) { win = null; } }
      setTimeout(function () {
        if (win && !win.closed) win.location.href = url; else window.location.href = url;
        showDone(url);
      }, mobile ? 250 : 700);
    }

    function showDone(url) {
      nextBtn.disabled = false;
      nextBtn.classList.remove('is-loading');
      form.setAttribute('data-step', 'done');
      steps.forEach(function (el) { el.hidden = true; });
      $('.stepnav', form).hidden = true;
      count.textContent = 'Solicitação pronta';
      $('#done-link').setAttribute('href', url);
      done.hidden = false;
      var h = $('h3', done); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true });
      keepFormTopInView();
    }

    function reset() {
      state = { step: 1, service: '', professional: '', date: '', time: '', name: '', note: '' };
      form.reset();
      syncFromForm();
      done.hidden = true;
      $('.stepnav', form).hidden = false;
      go(1);
    }

    function syncFromForm() {
      var s = $('input[name="service"]:checked', form);
      var p = $('input[name="professional"]:checked', form);
      state.service = s ? s.value : '';
      state.professional = p ? p.value : '';
      state.date = $('#b-date').value;
      state.time = $('#b-time').value;
      state.name = $('#b-name').value;
      state.note = $('#b-note').value;
    }

    function renderChoices() {
      var chips = $('#service-chips');
      var options = (C.services || []).map(function (s) { return { id: s.id, name: s.name }; });
      options.push({ id: 'outro', name: C.otherServiceLabel || 'Outro' });
      chips.innerHTML = options.map(function (o) {
        return '<label class="chip"><input type="radio" name="service" value="' + esc(o.id) + '"><span>' + esc(o.name) + '</span></label>';
      }).join('');
      var pros = $('#pro-chips');
      var list = (C.professionals || []).map(function (p) {
        return '<label class="chip"><input type="radio" name="professional" value="' + esc(p.id) + '"><span>' + esc(p.name) + '</span></label>';
      });
      list.push('<label class="chip"><input type="radio" name="professional" value="" checked><span>Sem preferência</span></label>');
      pros.innerHTML = list.join('');
      if (!(C.professionals || []).length) $('#pro-field').hidden = true;
    }

    function start(opts) {
      opts = opts || {};
      if (!form) return;
      if (!done.hidden) reset();
      if (opts.service) {
        var r = $('input[name="service"][value="' + opts.service + '"]', form);
        if (r) r.checked = true;
      }
      if (opts.professional != null && opts.professional !== undefined) {
        var p = $('input[name="professional"][value="' + opts.professional + '"]', form);
        if (p) p.checked = true;
      }
      if (opts.note && !$('#b-note').value) $('#b-note').value = opts.note;
      syncFromForm();
      setError('service', '');
      state.step = 1;
      render(false);
      var target = $('input[name="service"]:checked', form) || $('input[name="service"]', form);
      goToSection(document.getElementById('agendamento'), {
        focus: false,
        onArrive: function () { if (target) target.focus({ preventScroll: true }); }
      });
    }

    function init() {
      form = $('#booking-form');
      if (!form) return;
      steps = $$('.bstep', form);
      nextBtn = $('.stepnav__next', form);
      backBtn = $('.stepnav__back', form);
      nextLabel = $('.stepnav__label', form);
      count = $('#bform-count');
      done = $('.bform__done', form);
      alertBox = $('.bform__alert', form);

      renderChoices();
      $('#b-date').min = todayISO();

      form.addEventListener('change', function (e) {
        syncFromForm();
        if (e.target.name === 'service') setError('service', '');
      });
      form.addEventListener('input', function (e) {
        syncFromForm();
        var key = e.target.id && e.target.id.replace('b-', '');
        if (key && $('#err-' + key) && !$('#err-' + key).hidden) setError(key, '');
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        syncFromForm();
        if (!validate(state.step)) return;
        if (state.step < 3) go(state.step + 1); else send();
      });
      backBtn.addEventListener('click', function () { if (state.step > 1) go(state.step - 1); });
      form.addEventListener('click', function (e) {
        var g = e.target.closest('[data-goto]');
        if (g) go(Number(g.getAttribute('data-goto')));
        if (e.target.closest('[data-reset]')) reset();
      });

      // ?servico=implante (ex.: link do Instagram) já chega com o serviço marcado
      var params = new URLSearchParams(location.search);
      var pre = params.get('servico');
      if (pre && (serviceById(pre) || pre === 'outro')) {
        var r = $('input[name="service"][value="' + pre + '"]', form);
        if (r) { r.checked = true; syncFromForm(); }
      }
      render(false);
    }

    return { init: init, start: start };
  })();

  // Todos os botões "Agendar" do site passam por aqui
  function initBookingTriggers() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-book]');
      if (!t) return;
      e.preventDefault();
      if (drawer && drawer.classList.contains('is-open')) setDrawer(false);
      Booking.start({
        service: t.getAttribute('data-book') || '',
        professional: t.hasAttribute('data-pro') ? t.getAttribute('data-pro') : undefined,
        note: t.getAttribute('data-note') || ''
      });
    });
  }

  window.Vitae = { startBooking: function (o) { Booking.start(o); }, links: Links };

  /* ------------------------------------------------------------------ */
  function init() {
    bindConfig();
    renderInstagram();
    renderServices();
    renderFaq();
    initChrome();
    initDrawer();
    initInPageLinks();
    renderRestInIdle();
    initLazyMedia();
    initCompare();
    initVideo();
    initMap();
    initPrivacy();
    Booking.init();
    initBookingTriggers();
    initReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

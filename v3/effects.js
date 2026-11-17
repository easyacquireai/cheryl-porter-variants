(function () {
  var reduce = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var EASE = 'cubic-bezier(.2,.7,.2,1)';

  function reveal(root) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; io.unobserve(el);
        var d = +el.dataset.cpDelay || 0;
        setTimeout(function () {
          if (el._cpHide) el._cpHide.cancel();
          el.animate([{ opacity: 0, transform: 'translateY(32px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 750, easing: EASE });
        }, d);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    root.querySelectorAll('section[data-screen-label]').forEach(function (sec, i) {
      if (i === 0) return;
      var box = sec.querySelector(':scope > div[style*="max-width"], :scope > div > div[style*="max-width"]') || sec.firstElementChild;
      if (!box) return;
      var kids = box.children.length > 1 ? Array.prototype.slice.call(box.children) : [box];
      kids.forEach(function (k, j) {
        if (k._cpSeen) return; k._cpSeen = 1;
        k.dataset.cpDelay = Math.min(j, 5) * 110;
        k._cpHide = k.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: 'forwards' });
        io.observe(k);
      });
    });
  }

  function pulseOne(a) {
    if (a._cpPulse) return; a._cpPulse = 1;
    a.animate([
      { transform: 'scale(1)', filter: 'brightness(1)' },
      { transform: 'scale(1.035)', filter: 'brightness(1.06)', offset: 0.18 },
      { transform: 'scale(1)', filter: 'brightness(1)', offset: 0.36 },
      { transform: 'scale(1.02)', offset: 0.5 },
      { transform: 'scale(1)', offset: 0.64 },
      { transform: 'scale(1)' }
    ], { duration: 2600, iterations: Infinity, easing: 'ease-in-out', delay: Math.random() * 600 });
  }
  function pulse(root) {
    root.querySelectorAll('a[href="#checkout"]').forEach(pulseOne);
    new MutationObserver(function () { root.querySelectorAll('a[href="#checkout"]').forEach(pulseOne); })
      .observe(root, { childList: true, subtree: true });
  }

  function shimmer(root) {
    var h = root.querySelector('section[data-screen-label] h1');
    if (!h || h._cpShine) return; h._cpShine = 1;
    if (getComputedStyle(h).position === 'static') h.style.position = 'relative';
    var s = document.createElement('span');
    s.setAttribute('aria-hidden', 'true');
    s.textContent = h.textContent;
    s.style.cssText = 'position:absolute;inset:0;display:block;pointer-events:none;color:transparent;text-shadow:none;' +
      'background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.95) 48%,#FFF6C8 50%,rgba(255,255,255,.95) 52%,transparent 62%) no-repeat;' +
      'background-size:250% 100%;-webkit-background-clip:text;background-clip:text';
    h.appendChild(s);
    h.animate([{ transform: 'scale(.86)', opacity: 0 }, { transform: 'scale(1.04)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)', opacity: 1 }], { duration: 700, easing: EASE, delay: 150 });
    s.animate([{ backgroundPosition: '130% 0' }, { backgroundPosition: '-30% 0', offset: 0.35 }, { backgroundPosition: '-30% 0' }],
      { duration: 4200, iterations: Infinity, delay: 900, easing: 'ease-in-out' });
  }

  window.cpEffects = function (opts) {
    if (reduce()) return;
    var root = document.body;
    if (opts.reveal) reveal(root);
    if (opts.pulse) pulse(root);
    if (opts.shimmer) shimmer(root);
  };
})();

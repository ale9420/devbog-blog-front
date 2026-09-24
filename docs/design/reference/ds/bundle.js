/* @ds-bundle: {"format":4,"namespace":"BogDev","components":[{"name":"Button"},{"name":"CategoryTag"},{"name":"NavBar"},{"name":"PostCard"},{"name":"NewsletterForm"},{"name":"CodeBlock"},{"name":"Callout"},{"name":"Logo"}]} */
(function () {
  var R = window.React, h = R.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(p, keys) { var o = {}; for (var k in p) if (keys.indexOf(k) < 0) o[k] = p[k]; return o; }

  var CATEGORIES = {
    privacidad: { label: 'Privacidad', color: 'var(--pinchaflor)' },
    diy: { label: 'DIY · Hazlo tú mismo', color: 'var(--golondrina)' },
    ia: { label: 'Inteligencia Artificial', color: 'var(--chillon)' },
    software: { label: 'Desarrollo de Software', color: 'var(--mirla)' },
    linux: { label: 'Linux y Código Abierto', color: 'var(--monjita)' }
  };


  // Logo oficial de BogDev (trazos exactos de bogdev.svg del repositorio del frontend)
  var LOGO = { t: "matrix(2.0019738,0,0,2.0019738,-128.36075,-162.58342)", p: [["a", "m 197.58848,114.47254 c -21.3116,-1.01331 -40.44391,4.22567 -58.00781,15.88672 -10.97562,7.28694 -24.35053,21.83191 -30.40236,33.05859 -5.71473,10.60135 -10.237416,25.07151 -11.230456,35.93555 -0.29456,3.22263 -0.64491,6.04742 -0.7793,6.27734 -0.26384,0.45145 -17.061744,-1.11785 -24.388674,-2.27929 -2.46797,-0.39126 -4.601664,-0.60498 -4.740234,-0.47461 -0.13857,0.13038 3.72865,1.48759 8.59375,3.01758 17.664008,5.55502 34.070024,8.60578 52.595694,9.77929 14.92525,0.94544 22.1654,0.95923 36.01173,0.0684 25.65276,-1.65049 50.09016,-5.91181 72.46094,-12.63476 l 5.34766,-1.60547 -0.50782,-3.375 c -1.38876,-9.26098 -8.51506,-21.27002 -16.67968,-28.10742 -10.26735,-8.59831 -20.95803,-12.45778 -34.13282,-12.32032 -14.61119,0.15245 -25.47202,4.87177 -36.375,15.8086 -7.31161,7.33432 -11.72685,15.70369 -13.84765,26.24804 l -1.41016,7.01954 H 124.50644 108.9166 l 0.22265,-4.29688 c 0.33314,-6.47418 2.28446,-15.09847 5.13281,-22.68164 14.12176,-37.59635 54.33687,-60.71228 92.43947,-53.13477 10.81584,2.15096 16.73778,4.23766 25.12695,8.84961 12.79697,7.03515 23.6694,17.53547 31.76562,30.67969 4.50621,7.31582 4.87958,7.69589 9.64844,9.8418 2.72838,1.22773 5.98036,2.95833 7.22656,3.8457 1.2462,0.88737 2.26563,1.36856 2.26563,1.07031 0,-1.33307 -5.85767,-14.99834 -7.97656,-18.60937 -16.78954,-28.613 -45.39816,-46.35606 -77.17969,-47.86719 z"], ["b", "m 286.7877,218.17567 -0.52735,4.0664 c -0.99554,7.67189 -5.35954,21.48714 -9.17578,29.05078 -12.89016,25.54777 -37.52536,44.6726 -65.41992,50.78711 -5.67314,1.24356 -24.16274,2.16899 -29.70117,1.48633 -20.92914,-2.57971 -39.24591,-11.20015 -54.52149,-25.65625 -13.99653,-13.24569 -22.44608,-27.74994 -27.37696,-47 -1.125446,-4.39376 -1.877566,-8.15428 -1.679676,-8.3789 0.20615,-0.19764 2.932626,0.19351 6.058586,0.86914 5.02569,1.08622 5.73599,1.46177 6.13672,3.24023 6.34685,28.16721 26.67274,51.28514 53.80469,61.19727 10.5895,3.86866 16.35305,4.83106 28.51563,4.76562 13.84855,-0.0745 24.48131,-2.52566 35.54297,-8.19531 23.42019,-12.00403 39.68108,-32.69977 45.38086,-57.75977 0.6778,-2.98006 1.46862,-5.41992 1.75781,-5.41992 0.28919,0 2.9286,-0.68558 5.86523,-1.52539 z"], ["b", "m 241.19785,160.68348 0.4004,5.85937 c 0.46358,6.76425 1.612,9.86828 5.5664,15.03907 3.27965,4.28847 2.76965,4.67352 -1.80273,1.36132 -1.7832,-1.29174 -3.23838,-2.08277 -3.23438,-1.75781 0.0125,1.00336 4.44205,8.31005 6.08985,10.04492 2.71839,2.86202 8.2343,7.14347 11.85351,9.19922 l 3.49805,1.98633 -7.01367,3.18555 c -11.47364,5.21256 -12.95873,5.79954 -24.02344,9.4707 -25.21927,8.36749 -53.20519,13.14046 -83.19922,14.18945 l -4.89844,0.16993 2.94532,5 c 3.91576,6.64875 8.49666,11.65022 14.875,16.23828 7.39999,5.32295 11.75128,7.26533 20.49023,9.15039 6.80106,1.46704 11.43766,1.48504 18.27734,0.0723 12.20672,-2.52136 20.76129,-7.31758 29.16797,-16.35547 5.21024,-5.60145 8.10344,-10.32571 11.03516,-18.01171 1.44921,-3.79937 1.63611,-3.95564 6.84765,-5.7461 5.62578,-1.93276 20.5296,-4.80078 24.95118,-4.80078 4.1894,0 12.93066,-2.30343 17.14257,-4.51758 2.28479,-1.2011 6.99723,-5.23622 11.35352,-9.72265 5.93976,-6.1172 8.35631,-8.04022 11.93359,-9.49414 3.34656,-1.36014 4.23129,-2.02648 3.48829,-2.62696 -1.78272,-1.44076 -11.21866,-4.88672 -13.38086,-4.88672 -1.15886,0 -5.39554,1.61073 -9.41602,3.58008 l -7.31055,3.58008 -3.71093,-2.83203 c -4.56111,-3.48158 -6.39407,-4.43943 -16.46094,-8.59961 -4.37801,-1.80923 -9.49428,-4.19076 -11.36914,-5.29102 -4.41336,-2.58998 -10.63961,-8.09222 -12.57422,-11.11132 z"], ["a", "m 96.388226,205.782 c -0.527471,-0.0625 -17.331815,-1.13555 -24.774724,-2.31537 -2.507037,-0.39747 -4.674506,-0.61457 -4.815269,-0.48213 -0.140764,0.13244 3.787671,1.51114 8.729782,3.06534 17.943615,5.64296 34.609335,8.74201 53.428235,9.93409 15.16151,0.96042 22.51625,0.97438 36.58177,0.0696 26.05881,-1.67662 50.88304,-6.00539 73.60794,-12.83477 l 5.43229,-1.63087 -0.51584,-3.42843 c -1.41075,-9.40757 -8.64986,-21.6067 -16.94373,-28.55234 -10.42987,-8.7344 -21.28976,-12.65497 -34.6731,-12.51533 -14.84248,0.15486 -25.87522,4.94888 -36.95078,16.05883 -7.42735,7.45041 -11.91248,15.95228 -14.06685,26.66353 l -1.43248,7.13065 h -15.83662 -15.83661 c 18.00164,1.56458 -6.7707,-0.55001 -11.934014,-1.16269 z"]] };
  function Logo(p) {
    var size = Number(p.size) || 40;
    var variant = p.variant || 'auto';
    var label = p.wordmark ? undefined : 'BogDev';
    var mark = h('svg', { key: 'm', className: 'bd-logo-mark', viewBox: '10 70 506 386', width: Math.round(size * 1.31), height: size, role: label ? 'img' : undefined, 'aria-label': label, 'aria-hidden': label ? undefined : 'true', focusable: 'false' },
      h('g', { transform: LOGO.t }, LOGO.p.map(function (x, i) { return h('path', { key: i, d: x[1], className: 'bd-logo-' + x[0] }); })));
    var kids = [mark];
    if (p.wordmark) kids.push(h('span', { key: 'w', className: 'bd-logo-word' }, 'Bog', h('span', { className: 'bd-logo-dev' }, 'Dev')));
    return h('span', { className: cx('bd-logo', 'bd-logo-' + variant, p.className), style: p.wordmark ? { fontSize: Math.round(size * 0.55) + 'px' } : undefined }, kids);
  }

  function Button(p) {
    var variant = p.variant || 'primary', size = p.size || 'md';
    var rest = omit(p, ['variant', 'size', 'className', 'children', 'arrow', 'href']);
    var cls = cx('bd-btn', 'bd-btn-' + variant, size === 'sm' && 'bd-btn-sm', p.className);
    var kids = [h('span', { key: 'l' }, p.children), p.arrow ? h('span', { key: 'a', className: 'bd-btn-arrow', 'aria-hidden': 'true' }, '→') : null];
    if (p.href) return h('a', Object.assign({ href: p.href, className: cls }, rest), kids);
    return h('button', Object.assign({ type: 'button', className: cls }, rest), kids);
  }

  function CategoryTag(p) {
    var cat = CATEGORIES[p.category] || CATEGORIES.software;
    var inner = [h('span', { key: 'd', className: 'bd-tag-dot', 'aria-hidden': 'true' }), h('span', { key: 't' }, p.children || cat.label)];
    var cls = cx('bd-tag', 'bd-tag-' + (p.category || 'software'), p.className);
    return p.href ? h('a', { href: p.href, className: cls }, inner) : h('span', { className: cls }, inner);
  }

  function NavBar(p) {
    var links = p.links || [
      { label: 'Inicio', href: '/es', active: true },
      { label: 'Blog', href: '/es/blog' },
      { label: 'Acerca de', href: '/es/about' }
    ];
    var lang = p.lang || 'es';
    var setLang = p.onLangChange || function () {};
    return h('header', { className: cx('bd-nav', p.className) },
      h('a', { className: 'bd-brand', href: p.homeHref || '/es', 'aria-label': 'BogDev, inicio' }, h(Logo, { size: 30 }), h('span', { className: 'bd-brand-word' }, 'Bog', h('span', { className: 'bd-brand-dev' }, 'Dev'))),
      h('nav', { 'aria-label': 'Principal', style: { marginLeft: 'auto' } },
        h('ul', { className: 'bd-nav-links' }, links.map(function (l) {
          return h('li', { key: l.href }, h('a', { className: 'bd-nav-link', href: l.href, 'aria-current': l.active ? 'page' : undefined }, l.label));
        }))),
      h('div', { className: 'bd-lang', role: 'group', 'aria-label': 'Idioma' },
        ['es', 'en'].map(function (code) {
          return h('button', { key: code, type: 'button', 'aria-pressed': lang === code ? 'true' : 'false', onClick: function () { setLang(code); } }, code.toUpperCase());
        })));
  }

  function PostCard(p) {
    var cat = CATEGORIES[p.category] || CATEGORIES.software;
    var media = p.image
      ? h('div', { className: 'bd-card-media' }, h('img', { src: p.image, alt: p.imageAlt || '' }))
      : h('div', { className: 'bd-card-media bd-card-media-empty', style: { '--cat': cat.color }, 'aria-hidden': 'true' });
    return h('article', { className: cx('bd-card', p.featured && 'bd-card-featured', p.className) },
      media,
      h('div', { className: 'bd-card-body' },
        p.featured ? h('span', { className: 'bd-eyebrow', style: { color: 'var(--chillon)' } }, p.eyebrow || 'Artículo destacado') : null,
        h('div', { className: 'bd-card-meta' },
          h(CategoryTag, { category: p.category }),
          h('time', { className: 'bd-meta', dateTime: p.dateTime }, p.date)),
        h(p.featured ? 'h2' : 'h3', { className: 'bd-card-title' }, h('a', { href: p.href || '#' }, p.title)),
        p.excerpt ? h('p', { className: 'bd-card-excerpt' }, p.excerpt) : null,
        h('div', { className: 'bd-card-foot' },
          h('span', { className: 'bd-meta' }, [p.author, p.readTime].filter(Boolean).join(' · ')),
          h('span', { className: 'bd-card-more', 'aria-hidden': 'true' }, (p.moreLabel || 'Leer más') + ' →'))));
  }

  function NewsletterForm(p) {
    var st = R.useState(p.status || 'idle'), status = st[0], setStatus = st[1];
    var em = R.useState(''), email = em[0], setEmail = em[1];
    var msg = p.message || (status === 'success' ? '✓ Listo. Revisa tu correo para confirmar.' : status === 'error' ? '✕ Ese correo no parece válido.' : null);
    function submit(e) {
      e.preventDefault();
      var ok = /.+@.+\..+/.test(email);
      setStatus(ok ? 'success' : 'error');
      if (ok && p.onSubmit) p.onSubmit(email);
    }
    var id = p.id || 'bd-news-email';
    return h('form', { className: cx('bd-news', p.className), onSubmit: submit, noValidate: true },
      h('span', { className: 'bd-eyebrow', style: { color: 'var(--mirla)' } }, p.eyebrow || 'Newsletter'),
      h('h3', null, p.title || 'Señales desde la sabana'),
      h('p', null, p.description || 'IA, software y Linux, contado desde Bogotá. Un correo al mes, sin spam.'),
      h('label', { htmlFor: id, className: 'bd-eyebrow', style: { color: 'var(--ink-muted)' } }, 'Correo electrónico'),
      h('div', { className: 'bd-news-row' },
        h('input', { id: id, className: 'bd-input', type: 'email', placeholder: p.placeholder || 'tu@correo.co', value: email, onChange: function (e) { setEmail(e.target.value); }, 'aria-invalid': status === 'error' ? 'true' : undefined, 'aria-describedby': msg ? id + '-msg' : undefined }),
        h(Button, { type: 'submit', variant: 'accent', arrow: true }, p.buttonLabel || 'Suscribirme')),
      msg ? h('p', { id: id + '-msg', role: 'status', className: cx('bd-news-msg', status === 'success' && 'bd-news-msg-success', status === 'error' && 'bd-news-msg-error') }, msg) : null);
  }

  function CodeBlock(p) {
    var c = R.useState(false), copied = c[0], setCopied = c[1];
    var lines = String(p.code || '').replace(/\n$/, '').split('\n');
    function copy() {
      var text = lines.map(function (l) { return l.replace(/^\$ /, ''); }).join('\n');
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { setCopied(true); setTimeout(function () { setCopied(false); }, 1600); }, function () {});
    }
    return h('figure', { className: cx('bd-code', p.className) },
      h('div', { className: 'bd-code-head' },
        p.lang ? h('span', { className: 'bd-code-lang' }, p.lang) : null,
        p.filename ? h('span', null, p.filename) : null,
        p.showCopy === false ? null : h('button', { type: 'button', className: 'bd-code-copy', onClick: copy }, copied ? 'Copiado ✓' : 'Copiar')),
      h('pre', null, h('code', null, lines.map(function (l, i) {
        var prompt = /^\$ /.test(l);
        return h(R.Fragment, { key: i }, prompt ? h('span', { className: 'bd-prompt' }, '$ ') : null, prompt ? l.slice(2) : l, i < lines.length - 1 ? '\n' : null);
      }))));
  }

  var TONES = { nota: 'Nota', aviso: 'Aviso', peligro: 'Peligro' };
  var GLYPH = { nota: '◆', aviso: '▲', peligro: '✕' };
  function Callout(p) {
    var tone = TONES[p.tone] ? p.tone : 'nota';
    return h('aside', { className: cx('bd-callout', 'bd-callout-' + tone, p.className), role: tone === 'peligro' ? 'alert' : 'note' },
      h('span', { className: 'bd-callout-label' }, GLYPH[tone] + ' ' + (p.title || TONES[tone])),
      h('div', { className: 'bd-callout-body' }, p.children));
  }

  window.BogDev = Object.assign(window.BogDev || {}, { Button: Button, CategoryTag: CategoryTag, NavBar: NavBar, PostCard: PostCard, NewsletterForm: NewsletterForm, CodeBlock: CodeBlock, Callout: Callout, Logo: Logo, CATEGORIES: CATEGORIES });
})();

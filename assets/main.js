// 逆サイボーグ — data/site.json を読み込んでページを組み立てる
(async () => {
  const res = await fetch('data/site.json', { cache: 'no-cache' });
  const d = await res.json();
  const $ = (id) => document.getElementById(id);

  // テキストをエスケープし、**太字** だけ許可する
  const fmt = (s = '') =>
    String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const head = (s) => `
    <header class="sec-head reveal">
      <p class="sec-num"><span>${fmt(s.num)}</span>${fmt(s.label)}</p>
      <h2 class="sec-title">${fmt(s.title)}</h2>
    </header>`;

  // ロゴ文字（CYBORG フォントのアウトライン）。1文字=幅1200のマスに中央寄せ
  const G = window.GROBYC_GLYPHS;
  const glyph = (ch) => G.glyphs[ch]
    ? `<svg viewBox="${-(1200 - G.glyphs[ch].adv) / 2 - 84} 0 1200 ${G.capHeight}" aria-hidden="true"><path d="${G.glyphs[ch].d}"/></svg>`
    : fmt(ch);
  const wordmark = (text) => `<span class="wm" role="img" aria-label="${fmt(text)}">${[...text].map(glyph).join('')}</span>`;

  const list = (items, cls = 'points') =>
    `<ul class="${cls}">${items.map((t) => `<li>${fmt(t)}</li>`).join('')}</ul>`;

  document.querySelector('.brand').innerHTML = wordmark(d.hero.to);

  // ---------- nav ----------
  $('nav').innerHTML = d.nav.map((n) => `<a href="#${n.id}" data-id="${n.id}">${fmt(n.label)}</a>`).join('');

  // ---------- hero ----------
  const h = d.hero;
  const letters = [...h.from];
  $('hero').innerHTML = `
    <div class="hero-inner">
      <p class="eyebrow">${fmt(h.eyebrow)}</p>
      <h1 class="word" aria-label="${fmt(h.to)}" style="--n:${letters.length}">
        ${letters.map((c, i) => `<span style="--i:${i}" aria-hidden="true">${glyph(c)}</span>`).join('')}
      </h1>
      <p class="hero-title">${fmt(h.title)}</p>
      <p class="hero-lead">${fmt(h.lead)}</p>
    </div>
    <a class="scroll" href="#definition">${fmt(h.scroll)}<i></i></a>`;

  // ---------- caption ----------
  const cp = d.caption;
  $('caption').innerHTML = `
    <div class="caption reveal">
      <div class="cap-side">
        <p class="cap-label">${fmt(cp.label)}</p>
        <p class="cap-name">${wordmark(cp.name)}</p>
        <p class="cap-alias">${fmt(cp.alias)}</p>
        <p class="cap-concept">${fmt(cp.concept)}</p>
      </div>
      <p class="cap-text">${fmt(cp.text)}</p>
    </div>`;

  // ---------- definition ----------
  const df = d.definition;
  const lg = df.matrix.legend;
  $('definition').innerHTML = `
    ${head(df)}
    <div class="def-grid">
      <div class="def-text reveal">
        <p class="body-lg">${fmt(df.body)}</p>
        ${list(df.points)}
      </div>
      <div class="matrix reveal" role="table" aria-label="サイボーグと逆サイボーグの比較">
        <div class="mx-row mx-headrow" role="row">
          <span role="columnheader"></span>
          ${df.matrix.columns.map((c, i) => `<span role="columnheader" class="mx-col ${i ? 'is-rev' : ''}">${fmt(c)}</span>`).join('')}
        </div>
        ${df.matrix.rows.map((r) => `
          <div class="mx-row" role="row">
            <span class="mx-label" role="rowheader">${fmt(r.label)}<small>${fmt(r.en)}</small></span>
            ${r.cells.map((c) => `<span class="cell cell-${c}" role="cell"><b>${fmt(lg[c])}</b></span>`).join('')}
          </div>`).join('')}
        <div class="mx-swap" aria-hidden="true">⇄</div>
      </div>
    </div>
    <div class="relatives reveal">
      <p class="note">${fmt(df.originality)}</p>
      <div class="rel-grid">
        ${df.relatives.map((r) => `
          <article class="rel">
            <h3>${fmt(r.name)}${r.who ? `<small>${fmt(r.who)}</small>` : ''}</h3>
            <p>${fmt(r.text)}</p>
          </article>`).join('')}
      </div>
    </div>`;

  // ---------- purpose ----------
  const p = d.purpose;
  $('purpose').innerHTML = `
    ${head(p)}
    <div class="purpose reveal">
      <p>${fmt(p.body)}</p>
      <blockquote>${fmt(p.emphasis)}</blockquote>
    </div>`;

  // ---------- origin ----------
  const o = d.origin;
  const m = d.magic;
  const magicTable = `
    <div class="magic">
      <div class="mg-row mg-head">
        ${m.columns.map((c) => `<span>${fmt(c)}</span>`).join('')}
      </div>
      ${m.rows.map((r) => `
        <div class="mg-row ${r.key ? 'is-key' : ''}">
          <span class="mg-el"><b>${fmt(r.element)}</b><small>${fmt(r.religion)}</small></span>
          <span class="mg-lost" data-k="${fmt(m.columns[1])}">${fmt(r.lost)}</span>
          <span class="mg-rev" data-k="${fmt(m.columns[2])}">${r.key ? `<em class="blank">？</em>` : ''}<b>${fmt(r.revive)}</b></span>
        </div>`).join('')}
    </div>`;
  const block = (b) => {
    switch (b.type) {
      case 'text': return `<p class="text">${fmt(b.text)}</p>`;
      case 'key': return `<p class="key">${fmt(b.text)}</p>`;
      case 'points': return list(b.items);
      case 'define': return `<div class="define"><span>${fmt(b.label)}</span><p>${fmt(b.text)}</p></div>`;
      case 'conclusion': return `<p class="conclusion">${fmt(b.text)}</p>`;
      case 'magic': return magicTable;
      default: return '';
    }
  };
  $('origin').innerHTML = `
    ${head(o)}
    <p class="lead reveal">${fmt(o.lead)}</p>
    <ol class="chain reveal">
      ${o.summary.map((s, i) => `
        <li><a href="#ch-${i}"><span class="chain-n">${i + 1}</span><b>${fmt(s.title)}</b><small>${fmt(s.text)}</small></a></li>`).join('')}
    </ol>
    <div class="chapters">
      ${o.chapters.map((c, i) => `
        <article class="chapter reveal" id="ch-${i}">
          <header><span>${fmt(c.num)}</span><h3>${fmt(c.title)}</h3></header>
          <div class="ch-body">${c.blocks.map(block).join('')}</div>
        </article>`).join('')}
    </div>`;

  // ---------- technology ----------
  const t = d.technology;
  $('technology').innerHTML = `
    ${head(t)}
    <p class="lead reveal">${fmt(t.lead)}</p>
    <div class="tech-grid">
      ${t.items.map((it) => `
        <article class="tech reveal ${it.role ? 'has-role' : ''}">
          <p class="tech-en">${fmt(it.en)}</p>
          <h3>${fmt(it.name)}</h3>
          <p>${fmt(it.text)}</p>
          ${it.role ? `<p class="role">${fmt(it.role)}</p>` : ''}
        </article>`).join('')}
    </div>`;

  // ---------- levels ----------
  const L = d.levels;
  const bar = (parts) => `
    <div class="bar">
      ${parts.map((s, i) => `<span class="seg seg-${s}"><i>${fmt(L.parts[i])}</i><b>${fmt(L.legend[s])}</b></span>`).join('')}
    </div>`;
  const levelCard = (it) => `
    <article class="level reveal ${it.final ? 'is-final' : ''}">
      <p class="lv">Lv.<b>${fmt(it.lv)}</b></p>
      <div class="lv-body">
        <h3>${fmt(it.title)}</h3>
        ${bar(it.parts)}
        ${list(it.points)}
      </div>
    </article>`;
  const rows = [];
  for (let i = 0; i < L.items.length; i++) {
    const it = L.items[i];
    if (it.branch && L.items[i + 1]?.branch) {
      rows.push(`<div class="lv-branch">${levelCard(it)}${levelCard(L.items[i + 1])}</div>`);
      i++;
    } else rows.push(levelCard(it));
  }
  $('levels').innerHTML = `
    ${head(L)}
    <p class="lead reveal">${fmt(L.lead)}</p>
    <div class="legend reveal">
      ${Object.entries(L.legend).map(([k, v]) => `<span class="lg lg-${k}">${fmt(v)}</span>`).join('')}
    </div>
    <div class="ladder">${rows.join('')}</div>`;

  // ---------- experiments ----------
  const e = d.experiments;
  $('experiments').innerHTML = `
    ${head(e)}
    <p class="lead reveal">${fmt(e.lead)}</p>
    <div class="exp-grid">
      ${e.items.map((x, i) => `
        <article class="exp reveal">
          <p class="exp-n">Q.${i + 1}</p>
          <h3>${fmt(x.q)}</h3>
          ${list(x.points)}
          <p class="answer"><span>A.</span>${fmt(x.answer)}</p>
        </article>`).join('')}
    </div>
    <div class="more reveal">
      <h3>${fmt(e.more.title)}</h3>
      ${e.more.groups.map((g, i) => `
        <details ${i === 0 ? 'open' : ''}>
          <summary>${fmt(g.name)}<span>${g.items.length}</span></summary>
          ${list(g.items)}
        </details>`).join('')}
    </div>`;

  // ---------- thesis ----------
  const th = d.thesis;
  $('thesis').innerHTML = `
    ${head(th)}
    <p class="lead reveal">${fmt(th.body)}</p>
    <div class="versus reveal">
      <div class="vs vs-l"><small>${fmt(th.left.en)}</small><b>${fmt(th.left.name)}</b><p>${fmt(th.left.text)}</p></div>
      <div class="vs-mid" aria-hidden="true"><span>vs</span></div>
      <div class="vs vs-r"><small>${fmt(th.right.en)}</small><b>${fmt(th.right.name)}</b><p>${fmt(th.right.text)}</p></div>
    </div>
    <p class="question reveal">${fmt(th.question)}</p>
    <p class="closing reveal">${fmt(th.closing)}</p>`;

  // ---------- footer ----------
  const mt = d.meta;
  $('footer').innerHTML = `
    <p class="ft-word" aria-hidden="true">${[...h.to].map(glyph).join('')}</p>
    <div class="ft-row">
      <p>${fmt(h.title)} — ${fmt(mt.author)}</p>
      <a href="${mt.portfolio.url}" rel="noopener">${fmt(mt.portfolio.label)} ↗</a>
    </div>
    <p class="ft-note">${fmt(mt.notice)}</p>`;
  document.title = mt.title;

  // ---------- behaviour ----------
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const word = document.querySelector('.word');
  if (reduce) word.classList.add('is-rev', 'no-anim');
  else setTimeout(() => word.classList.add('is-rev'), 900);
  word.addEventListener('click', () => word.classList.toggle('is-rev'));

  const io = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => (reduce ? el.classList.add('in') : io.observe(el)));

  // 現在のセクションをナビで強調
  const links = [...document.querySelectorAll('.nav a')];
  const spy = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => {
        const on = a.dataset.id === en.target.id;
        a.classList.toggle('on', on);
        if (on) {
          // ナビが横スクロールする幅のときだけ、該当リンクを見える位置へ寄せる
          const nav = a.parentElement;
          if (nav.scrollWidth > nav.clientWidth) nav.scrollLeft = a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2;
        }
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  d.nav.forEach((n) => $(n.id) && spy.observe($(n.id)));

  const bar$ = document.querySelector('.topbar');
  const onScroll = () => bar$.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
})();

// GTA VI trophy guide + tracker: checklist with per-trophy progress counters saved
// in localStorage (v2, migrated from v1 earned ids), export/import, search, grade +
// kind filters, a spoiler setting that hides story trophies until they are earned,
// and per-spot location lists drawn from data/trophies.json. Works fully offline;
// data lives in data/trophies.json. All art is inline SVG drawn for this guide.
const KEY = 'gta6-trophy-guide-progress-v2';
const OLD_KEY = 'gta6-trophy-guide-progress-v1';
const listEl = document.getElementById('list');
const emptyEl = document.getElementById('empty');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const earnedOnlyEl = document.getElementById('earnedOnly');
const spoilerEl = document.getElementById('spoiler');

let earned = new Set();
let counters = {}; // trophy id -> current count
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (raw && Array.isArray(raw.earned)) {
      earned = new Set(raw.earned.filter((n) => typeof n === 'number'));
      counters = raw.counters && typeof raw.counters === 'object' ? raw.counters : {};
      return;
    }
  } catch { /* fall through to v1 migration */ }
  try {
    const old = JSON.parse(localStorage.getItem(OLD_KEY) ?? '[]');
    if (Array.isArray(old)) earned = new Set(old.filter((n) => typeof n === 'number'));
  } catch { earned = new Set(); }
  // v1 earned ids become v2 counters at their targets where the trophy has one
  for (const id of earned) {
    const t = byIdSafe(id);
    if (t && t.counter) counters[id] = t.counter.target;
  }
}
function byIdSafe(id) { return trophies.find((t) => t.id === id); }

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
let openId = null;
load();
save(); // persist a v1 migration (or a fresh v2 file) immediately, not only on the next edit

function save() {
  localStorage.setItem(KEY, JSON.stringify({
    version: 2,
    earned: [...earned].sort((a, b) => a - b),
    counters,
  }));
}

function gradeLabel(g) {
  return g === 'platinum' ? 'Platinum' : g === 'gold' ? 'Gold' : g === 'silver' ? 'Silver' : 'Bronze';
}

// Drawn medallion badges: distinct shapes per grade, not just coloured pills.
function gradeBadge(g) {
  const shapes = {
    platinum: `<svg viewBox="0 0 24 24" class="badge" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#e8f7ff" stroke="#7fd4ff" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#7fd4ff" stroke-width="1.4"/><path d="M12 7l1.6 3.2 3.5.5-2.5 2.5.6 3.5-3.2-1.7-3.2 1.7.6-3.5-2.5-2.5 3.5-.5z" fill="#3aa7d6"/></svg>`,
    gold: `<svg viewBox="0 0 24 24" class="badge" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#ffc93c" stroke="#a67c00" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#a67c00" stroke-width="1.2"/><path d="M12 7.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#7a5a00"/></svg>`,
    silver: `<svg viewBox="0 0 24 24" class="badge" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#c9d4e3" stroke="#7c8aa0" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#7c8aa0" stroke-width="1.2"/><path d="M12 7.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#5a6b80"/></svg>`,
    bronze: `<svg viewBox="0 0 24 24" class="badge" aria-hidden="true"><path d="M12 2l8 5v10l-8 5-8-5V7z" fill="#e0915a" stroke="#8a4a1d" stroke-width="2"/><path d="M12 7.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#5e2f0e"/></svg>`,
  };
  return shapes[g] ?? '';
}

// Small inline icons per kind, drawn for this guide.
function kindIcon(kind) {
  const paths = {
    story: '<path d="M4 4h16v12H8l-4 4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 8h8M8 12h5" stroke="currentColor" stroke-width="2"/>',
    side: '<circle cx="12" cy="7" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 10v11M7 21l5-4 5 4" fill="none" stroke="currentColor" stroke-width="2"/>',
    activities: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" fill="none" stroke="currentColor" stroke-width="2"/>',
    crime: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2"/>',
    collectibles: '<path d="M6 3h12l2 5-8 13L4 8z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 8h16M12 3l-2 5 2 13 2-13z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    exploration: '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5L21 21M8 11h6M11 8v6" fill="none" stroke="currentColor" stroke-width="2"/>',
    money: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 .9-3 2.2c0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2s-3-1.1-3-2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  };
  return `<svg viewBox="0 0 24 24" class="kind-ico" aria-hidden="true">${paths[kind] ?? ''}</svg>`;
}

function countOf(t) { return counters[t.id] ?? 0; }
function setCount(t, n) {
  const target = t.counter.target;
  const v = Math.max(0, Math.min(target, Math.round(n) || 0));
  if (v === 0) delete counters[t.id];
  else counters[t.id] = v;
  // auto-mark earned at target, auto-unmark when lowered below it
  if (v >= target) earned.add(t.id);
  else if (t.counter) earned.delete(t.id);
  save();
}
function fmt(n) { return n.toLocaleString('en-US'); }
function counterText(t) {
  if (!t.counter) return '';
  return `${fmt(countOf(t))}/${fmt(t.counter.target)} ${t.counter.unit}`;
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  const pct = Math.round((n / total) * 100);
  document.getElementById('earnedCount').textContent = n;
  document.getElementById('pct').textContent = pct + '%';
  const fill = document.getElementById('barFill');
  fill.style.width = pct + '%';
  document.getElementById('barWrap').setAttribute('aria-valuenow', String(n));
  const counts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const tot = trophies.filter((t) => t.grade === g).length;
    const got = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    return `<b>${gradeLabel(g)} ${got}/${tot}</b>`;
  }).join(' &middot; ');
  document.getElementById('gradeCounts').innerHTML = counts;
  document.getElementById('platinumLine').textContent =
    n === total ? 'Platinum earned — Vice Got a Price! You are a Leonida Legend.'
    : `Platinum: Vice Got a Price! — ${total - n} to go.`;
}

function isHidden(t) {
  return spoilerEl.checked && t.story && !earned.has(t.id);
}

function matches(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
  if (earnedOnlyEl.checked && !earned.has(t.id)) return false;
  if (q) {
    const hay = `${t.name} ${t.description} ${t.guide} ${t.kind} ${(t.locations ?? []).map((l) => l.name + ' ' + l.where).join(' ')}`.toLowerCase();
    if (isHidden(t)) return false; // hidden entries cannot be searched
    if (!hay.includes(q)) return false;
  }
  return true;
}

function render() {
  renderProgress();
  listEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!matches(t)) continue;
    shown++;
    const hidden = isHidden(t);
    const li = document.createElement('li');
    li.className = 'card' + (earned.has(t.id) ? ' earned' : '') + (hidden ? ' hidden-spoiler' : '');
    li.dataset.id = t.id;

    const head = document.createElement('div');
    head.className = 'card-head';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${hidden ? 'story trophy' : t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) {
        earned.add(t.id);
        if (t.counter) counters[t.id] = t.counter.target;
      } else {
        earned.delete(t.id);
        if (t.counter) delete counters[t.id];
      }
      save();
      render();
    });
    box.addEventListener('click', (e) => e.stopPropagation());
    head.append(box);

    const main = document.createElement('div');
    main.className = 'card-main';
    const h = document.createElement('h3');
    h.textContent = hidden ? 'Hidden story trophy — earn it to reveal' : t.name;
    if (hidden) {
      const lock = document.createElement('span');
      lock.className = 'lock';
      lock.textContent = ' 🔒';
      h.append(lock);
    }
    main.append(h);
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = hidden ? 'Story spoiler hidden. Tick the box once you have earned it in-game.' : t.description;
    main.append(desc);

    const tags = document.createElement('div');
    tags.className = 'tags';
    const gradeTag = document.createElement('span');
    gradeTag.className = 'tag ' + t.grade;
    gradeTag.innerHTML = gradeBadge(t.grade) + '<span>' + gradeLabel(t.grade) + '</span>';
    tags.append(gradeTag);
    const kindTag = document.createElement('span');
    kindTag.className = 'tag kind';
    kindTag.innerHTML = kindIcon(t.kind) + '<span>' + t.kind + '</span>';
    tags.append(kindTag);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'tag missable';
      m.textContent = '⚠ Possibly missable';
      tags.append(m);
    }
    if (t.counter) {
      const c = document.createElement('span');
      c.className = 'tag counter-tag';
      c.textContent = counterText(t);
      tags.append(c);
    }
    if (t.locations) {
      const l = document.createElement('span');
      l.className = 'tag loc-tag';
      l.textContent = '⌖ ' + t.locations.length + ' spots';
      tags.append(l);
    }
    if (earned.has(t.id)) {
      const e = document.createElement('span');
      e.className = 'tag earned-tag';
      e.textContent = '✓ Earned';
      tags.append(e);
    }
    main.append(tags);

    // Inline counter controls on the card itself
    if (!hidden && t.counter) {
      const ctr = document.createElement('div');
      ctr.className = 'counter';
      ctr.addEventListener('click', (e) => e.stopPropagation());
      const minus = document.createElement('button');
      minus.type = 'button'; minus.className = 'step'; minus.textContent = '−';
      minus.setAttribute('aria-label', `Decrease ${t.name} counter`);
      minus.addEventListener('click', () => { setCount(t, countOf(t) - t.counter.step); render(); });
      const num = document.createElement('input');
      num.type = 'number'; num.min = '0'; num.max = String(t.counter.target);
      num.step = String(t.counter.step); num.value = String(countOf(t));
      num.setAttribute('aria-label', `${t.name} progress, out of ${t.counter.target} ${t.counter.unit}`);
      num.addEventListener('change', () => { setCount(t, Number(num.value)); render(); });
      num.addEventListener('click', (e) => e.stopPropagation());
      const plus = document.createElement('button');
      plus.type = 'button'; plus.className = 'step'; plus.textContent = '+';
      plus.setAttribute('aria-label', `Increase ${t.name} counter`);
      plus.addEventListener('click', () => { setCount(t, countOf(t) + t.counter.step); render(); });
      const lab = document.createElement('span');
      lab.className = 'counter-label';
      lab.textContent = `/ ${fmt(t.counter.target)} ${t.counter.unit} — ${t.counter.label}`;
      const mini = document.createElement('div');
      mini.className = 'counter-bar';
      const miniFill = document.createElement('div');
      miniFill.style.width = Math.round((countOf(t) / t.counter.target) * 100) + '%';
      mini.append(miniFill);
      ctr.append(minus, num, plus, lab);
      main.append(ctr);
      main.append(mini);
    }
    head.append(main);
    li.append(head);

    if (!hidden && openId === t.id) {
      const detail = document.createElement('div');
      detail.className = 'detail';
      const h4 = document.createElement('h4');
      h4.textContent = 'How to get it';
      detail.append(h4);
      const g = document.createElement('p');
      if (/still being confirmed/i.test(t.guide)) {
        const warn = document.createElement('span');
        warn.className = 'unconfirmed';
        warn.textContent = 'Method still being confirmed by the community. ';
        g.append(warn);
        g.append(t.guide.replace(/^Method still being confirmed by the community[ —–-]+/i, ''));
      } else {
        g.textContent = t.guide;
      }
      detail.append(g);
      if (t.counter) {
        const cp = document.createElement('p');
        cp.className = 'counter-note';
        cp.textContent = `Your progress: ${counterText(t)} (${t.counter.label}). The counter target is the trophy's own requirement — for 100% completion the checklist sometimes asks for more (e.g. 15 of 18 card sets, 300 of 397 stunts).`;
        detail.append(cp);
      }
      if (t.locations && t.locations.length) {
        const lh = document.createElement('h4');
        lh.textContent = 'Where to find them';
        detail.append(lh);
        if (t.locations_note) {
          const ln = document.createElement('p');
          ln.className = 'loc-note';
          ln.textContent = t.locations_note;
          detail.append(ln);
        }
        const ul = document.createElement('ul');
        ul.className = 'locs';
        for (const l of t.locations) {
          const item = document.createElement('li');
          const b = document.createElement('b');
          b.textContent = l.name;
          item.append(b);
          item.append(' — ' + l.where);
          if (l.verified === false) {
            const u = document.createElement('span');
            u.className = 'unconfirmed';
            u.textContent = ' (location unconfirmed — check the source guide)';
            item.append(u);
          }
          if (l.note) {
            const n = document.createElement('span');
            n.className = 'loc-flag';
            n.textContent = ' ' + l.note;
            item.append(n);
          }
          ul.append(item);
        }
        detail.append(ul);
      }
      const src = document.createElement('p');
      src.className = 'src';
      src.innerHTML = '<b>Sources:</b> ';
      src.append(t.sources.join(' · ') + ' — official name, description and grade as published 18 Nov 2026.');
      detail.append(src);
      const off = document.createElement('p');
      off.className = 'src';
      off.textContent = 'Official description: “' + t.description + '”';
      detail.append(off);
      li.append(detail);
    }
    if (!hidden) {
      li.addEventListener('click', () => {
        openId = openId === t.id ? null : t.id;
        render();
      });
    }
    listEl.append(li);
  }
  emptyEl.hidden = shown !== 0;
  document.getElementById('showing').textContent =
    `Showing ${shown} of ${trophies.length} trophies · ${earned.size} earned`;
}

document.getElementById('export').addEventListener('click', () => {
  const payload = {
    game: 'Grand Theft Auto VI',
    guide: 'gta6-trophy-guide-01',
    version: 2,
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b).map((id) => byId.get(id)?.name ?? id),
    earnedIds: [...earned].sort((a, b) => a - b),
    counters: Object.fromEntries(
      Object.entries(counters).map(([id, n]) => [byId.get(Number(id))?.name ?? id, n]),
    ),
    counterIds: counters,
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : (data.earnedIds ?? data.earned ?? []);
    const next = new Set();
    for (const v of ids) {
      if (typeof v === 'number' && byId.has(v)) next.add(v);
      else if (typeof v === 'string') {
        const t = trophies.find((x) => x.name === v);
        if (t) next.add(t.id);
      }
    }
    // v2 counters: by id or by trophy name
    const nextCounters = {};
    const rawCounters = data.counterIds ?? data.counters ?? {};
    if (rawCounters && typeof rawCounters === 'object') {
      for (const [k, v] of Object.entries(rawCounters)) {
        const num = Number(v);
        if (!Number.isFinite(num)) continue;
        if (/^\d+$/.test(k) && byId.has(Number(k))) nextCounters[Number(k)] = num;
        else {
          const t = trophies.find((x) => x.name === k);
          if (t) nextCounters[t.id] = num;
        }
      }
    }
    // old v1 files carry earned ids only: fill counters to target for earned ones
    for (const id of next) {
      const t = byId.get(id);
      if (t?.counter && nextCounters[id] === undefined) nextCounters[id] = t.counter.target;
    }
    // clamp counters to their targets and re-derive earned from them
    for (const [id, n] of Object.entries(nextCounters)) {
      const t = byId.get(Number(id));
      if (!t?.counter) { delete nextCounters[id]; continue; }
      nextCounters[id] = Math.max(0, Math.min(t.counter.target, Math.round(n)));
      if (nextCounters[id] >= t.counter.target) next.add(t.id);
      else next.delete(t.id);
      if (nextCounters[id] === 0) delete nextCounters[id];
    }
    earned = next;
    counters = nextCounters;
    save();
    render();
  } catch {
    alert('That file could not be imported as trophy progress.');
  }
  e.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies and counters?')) {
    earned = new Set();
    counters = {};
    openId = null;
    save();
    render();
  }
});

for (const el of [searchEl, gradeEl, kindEl, earnedOnlyEl, spoilerEl]) {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
}

render();

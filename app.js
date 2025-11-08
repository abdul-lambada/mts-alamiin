// Tahun otomatis di footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Marquee sederhana
(function marquee() {
  const el = document.getElementById('marquee');
  if (!el) return;
  let x = 0;
  function step() {
    x -= 0.5; // kecepatan
    const width = el.scrollWidth;
    if (Math.abs(x) > width) x = 0;
    el.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(step);
  }
  step();
})();

// Collapse widgets
(function collapses() {
  document.querySelectorAll('[data-collapse]').forEach(btn => {
    const targetSel = btn.getAttribute('data-collapse');
    const target = document.querySelector(targetSel);
    if (!target) return;
    // default: terbuka
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('svg');
      if (target.classList.contains('hidden')) {
        target.classList.remove('hidden');
        icon && icon.classList.remove('rotate-180');
      } else {
        target.classList.add('hidden');
        icon && icon.classList.add('rotate-180');
      }
    });
  });
})();

// Galeri: filter dan lightbox
(function gallery(){
  const grid = document.getElementById('galeri-grid');
  const filterBtns = document.querySelectorAll('.galeri-filter');
  const items = grid ? Array.from(grid.querySelectorAll('.galeri-item')) : [];
  if (!grid || items.length === 0) return;

  // Filter
  function applyFilter(cat){
    items.forEach(it => {
      const c = it.getAttribute('data-cat');
      const show = (cat === 'all') || (c === cat);
      it.style.display = show ? '' : 'none';
    });
    filterBtns.forEach(b=>{
      if (b.getAttribute('data-cat') === cat) b.classList.add('bg-emerald-600','text-white');
      else b.classList.remove('bg-emerald-600','text-white');
    });
  }
  filterBtns.forEach(btn=>btn.addEventListener('click',()=>applyFilter(btn.getAttribute('data-cat')||'all')));
  applyFilter('all');

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const btnClose = document.getElementById('lb-close');
  const btnPrev = document.getElementById('lb-prev');
  const btnNext = document.getElementById('lb-next');
  const btnZoomIn = document.getElementById('lb-zoom-in');
  const btnZoomOut = document.getElementById('lb-zoom-out');
  const btnReset = document.getElementById('lb-reset');

  let current = 0;
  let scale = 1;

  function visibleItems(){
    return items.filter(it => it.style.display !== 'none');
  }
  function showAt(i){
    const vis = visibleItems();
    if (vis.length === 0) return;
    current = ((i % vis.length) + vis.length) % vis.length;
    const el = vis[current];
    const src = el.getAttribute('data-full') || el.querySelector('img')?.src || '';
    lbImg.src = src;
    scale = 1;
    lbImg.style.transform = 'scale(1)';
  }
  function openAt(index){
    lb.classList.remove('hidden');
    showAt(index);
  }
  function close(){ lb.classList.add('hidden'); }

  items.forEach((it, idx)=>{
    it.addEventListener('click',()=>{
      // index relatif terhadap item visible; gunakan indeks asli lalu hitung pos di visible
      const vis = visibleItems();
      const pos = vis.indexOf(it);
      openAt(pos === -1 ? 0 : pos);
    });
  });

  btnClose && btnClose.addEventListener('click', close);
  lb && lb.addEventListener('click', (e)=>{ if (e.target === lb) close(); });
  btnPrev && btnPrev.addEventListener('click', ()=> showAt(current - 1));
  btnNext && btnNext.addEventListener('click', ()=> showAt(current + 1));
  btnZoomIn && btnZoomIn.addEventListener('click', ()=>{ scale = Math.min(3, scale + 0.2); lbImg.style.transform = `scale(${scale})`; });
  btnZoomOut && btnZoomOut.addEventListener('click', ()=>{ scale = Math.max(0.5, scale - 0.2); lbImg.style.transform = `scale(${scale})`; });
  btnReset && btnReset.addEventListener('click', ()=>{ scale = 1; lbImg.style.transform = 'scale(1)'; });

  document.addEventListener('keydown', (e)=>{
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') showAt(current - 1);
    if (e.key === 'ArrowRight') showAt(current + 1);
  });
})();

// Slider sederhana
(function sliderInit() {
  const slider = document.getElementById('slider');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dots = Array.from(slider.querySelectorAll('.dot'));
  let idx = 0;

  function show(i) {
    slides.forEach((s, n) => {
      s.style.opacity = n === i ? '1' : '0';
    });
    dots.forEach((d, n) => {
      d.style.background = n === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)';
    });
    idx = i;
  }

  dots.forEach((d, i) => d.addEventListener('click', () => show(i)));

  setInterval(() => show((idx + 1) % slides.length), 5000);
  show(0);
})();

// Kalender sederhana (bulan berjalan)
(function calendar() {
  const cal = document.getElementById('calendar');
  if (!cal) return;
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const days = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

  cal.innerHTML = '';
  // header hari
  days.forEach(d => {
    const el = document.createElement('div');
    el.textContent = d;
    el.className = 'font-semibold text-emerald-700 py-1';
    cal.appendChild(el);
  });

  // spacer sebelum tanggal 1
  let start = first.getDay(); // 0 Minggu ... 6 Sabtu
  // Ubah ke format Senin-awal: 1..6,0
  start = start === 0 ? 6 : start - 1;
  for (let i = 0; i < start; i++) {
    const s = document.createElement('div');
    s.className = 'py-1';
    cal.appendChild(s);
  }

  const today = now.getDate();
  for (let d = 1; d <= last.getDate(); d++) {
    const el = document.createElement('div');
    const isToday = d === today;
    el.textContent = String(d);
    el.className = 'py-1 rounded text-sm ' + (isToday ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-emerald-50');
    cal.appendChild(el);
  }
})();

// Pencarian konten
(function searchWidget() {
  const input = document.getElementById('q');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  const btn = input.parentElement?.querySelector('button');

  function normalize(s) { return (s || '').toString().toLowerCase(); }

  function collectItems() {
    const items = [];
    // Pengumuman
    document.querySelectorAll('#berita article').forEach((el, i) => {
      const title = el.querySelector('h3')?.textContent || 'Pengumuman';
      const body = el.textContent || '';
      items.push({ el, section: 'Pengumuman', title, text: body });
    });
    // Agenda
    document.querySelectorAll('#agenda li').forEach((el) => {
      const t = el.textContent || '';
      items.push({ el, section: 'Agenda', title: 'Agenda', text: t });
    });
    return items;
  }

  const allItems = collectItems();

  function highlight(el) {
    el.classList.add('ring', 'ring-emerald-400', 'ring-offset-2', 'ring-offset-emerald-50');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => el.classList.remove('ring', 'ring-emerald-400', 'ring-offset-2', 'ring-offset-emerald-50'), 1800);
  }

  function search(q) {
    const query = normalize(q);
    results.innerHTML = '';
    if (!query) {
      results.innerHTML = '<div class="text-slate-500">Ketik kata kunci, lalu tekan Enter atau klik Cari.</div>';
      return;
    }

    const found = allItems
      .map((it) => {
        const text = normalize(it.text);
        const idx = text.indexOf(query);
        if (idx === -1) return null;
        const start = Math.max(0, idx - 30);
        const end = Math.min(it.text.length, idx + query.length + 30);
        const snippet = it.text.substring(start, end).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return { ...it, snippet };
      })
      .filter(Boolean);

    if (found.length === 0) {
      results.innerHTML = '<div class="text-slate-500">Tidak ada hasil.</div>';
      return;
    }

    const list = document.createElement('div');
    list.className = 'divide-y divide-emerald-100 border border-emerald-100 rounded';
    found.slice(0, 10).forEach((it) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'w-full text-left px-3 py-2 hover:bg-emerald-50';
      row.innerHTML = `<div class="text-xs text-emerald-700 font-semibold">${it.section}</div>
        <div class="font-medium">${it.title}</div>
        <div class="text-xs text-slate-600 line-clamp-2">${it.snippet}</div>`;
      row.addEventListener('click', () => highlight(it.el));
      list.appendChild(row);
    });
    results.appendChild(list);
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') search(input.value);
  });
  btn && btn.addEventListener('click', () => search(input.value));
})();

// Polling sederhana dengan localStorage
(function poll() {
  const form = document.getElementById('poll-form');
  const result = document.getElementById('poll-result');
  const resetBtn = document.getElementById('poll-reset');
  if (!form || !result) return;

  const KEY = 'mts_poll_votes';
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }
  function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }
  function render() {
    const data = load();
    // Migrasi data lama: 'perlu' -> 'kurang'
    if (data.perlu && !data.kurang) {
      data.kurang = (data.kurang || 0) + data.perlu;
      delete data.perlu;
      save(data);
    }
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 0;
    const sangat = data.sangat_bagus || 0;
    const bagus = data.bagus || 0;
    const cukup = data.cukup || 0;
    const kurang = data.kurang || 0;
    result.innerHTML = `Total: ${total} | Sangat bagus: ${sangat} • Bagus: ${bagus} • Cukup: ${cukup} • Kurang: ${kurang}`;
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const vote = fd.get('vote');
    if (!vote) { result.textContent = 'Pilih salah satu opsi.'; return; }
    const data = load();
    data[vote] = (data[vote] || 0) + 1;
    save(data);
    render();
  });
  resetBtn && resetBtn.addEventListener('click', () => {
    localStorage.removeItem(KEY);
    render();
  });
  render();
})();

// Buku Tamu sederhana dengan localStorage
(function guestbook() {
  const form = document.getElementById('guestbook-form');
  const list = document.getElementById('guestbook-list');
  const clearBtn = document.getElementById('gb-clear');
  if (!form || !list) return;

  const KEY = 'mts_guestbook';
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  }
  function save(items) { localStorage.setItem(KEY, JSON.stringify(items)); }
  function render() {
    const items = load().slice(-10).reverse();
    list.innerHTML = '';
    items.forEach(it => {
      const li = document.createElement('li');
      li.className = 'p-2 rounded border border-emerald-100';
      li.innerHTML = `<div class="text-xs text-slate-500">${new Date(it.t).toLocaleString()}</div><div class="font-medium">${it.n}</div><div class="text-sm text-slate-700">${it.m}</div>`;
      list.appendChild(li);
    });
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('gb-name').value.trim();
    const msg = document.getElementById('gb-message').value.trim();
    if (!name || !msg) return;
    const items = load();
    items.push({ n: name, m: msg, t: Date.now() });
    save(items);
    form.reset();
    render();
  });
  clearBtn && clearBtn.addEventListener('click', () => {
    localStorage.removeItem(KEY);
    render();
  });
  render();
})();

(function contactForm(){
  const form = document.getElementById('contact-form');
  const alertEl = document.getElementById('contact-alert');
  if (!form || !alertEl) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim();
    const message = (fd.get('message')||'').toString().trim();
    if (!name || !email || !message) return;
    alertEl.classList.remove('hidden');
    setTimeout(()=>alertEl.classList.add('hidden'), 3000);
    form.reset();
  });
})();

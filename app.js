/* ─── Connexier · app.js ─── */

const pad = n => String(n).padStart(2, '0');
const now = new Date();
const todayStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7);

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const ICONS  = ['ti-users','ti-phone','ti-chart-bar','ti-stethoscope',
                'ti-rocket','ti-briefcase','ti-coffee','ti-device-laptop',
                'ti-presentation','ti-clipboard-list'];

/* ─── State ─── */
let events = loadEvents();
let nextId = events.length ? Math.max(...events.map(e=>e.id)) + 1 : 1;
let curView   = 'all';
let curFilter = 'all';

/* ─── Storage ─── */
function loadEvents() {
  try {
    const raw = localStorage.getItem('connexier_events');
    return raw ? JSON.parse(raw) : defaultEvents();
  } catch { return defaultEvents(); }
}
function saveEvents() {
  try { localStorage.setItem('connexier_events', JSON.stringify(events)); } catch {}
}
function defaultEvents() {
  return [
    { id:1, title:'Reunión de equipo',    date:'2026-05-10', time:'09:00', desc:'Stand-up semanal',      src:'both'    },
    { id:2, title:'Llamada con cliente',  date:'2026-05-10', time:'11:30', desc:'Demo del producto',     src:'google'  },
    { id:3, title:'Revisión presupuesto', date:'2026-05-12', time:'14:00', desc:'Q2 financiero',         src:'both'    },
    { id:4, title:'Dentista',             date:'2026-05-14', time:'10:00', desc:'',                      src:'outlook' },
    { id:5, title:'Lanzamiento v2.0',     date:'2026-05-20', time:'09:00', desc:'Release del producto',  src:'both'    },
  ];
}

/* ─── Helpers ─── */
function stripeStyle(src) {
  if (src === 'google')  return 'background:#34C759';
  if (src === 'outlook') return 'background:#0A84FF';
  return 'background:linear-gradient(180deg,#34C759 50%,#0A84FF 50%)';
}
function tagHtml(src) {
  const g = '<span class="tag tag-g">Google</span>';
  const o = '<span class="tag tag-o">Outlook</span>';
  if (src === 'both')    return g + o;
  if (src === 'google')  return g;
  return o;
}
function fmtDisplay(date, time) {
  const [, m, d] = date.split('-');
  return `${parseInt(d)} ${MONTHS[parseInt(m)-1]} · ${time}h`;
}
function randIcon(id) { return ICONS[id % ICONS.length]; }

/* ─── Filter logic ─── */
function getVisible() {
  let list = [...events];
  if (curView === 'google')  list = list.filter(e => e.src === 'google'  || e.src === 'both');
  if (curView === 'outlook') list = list.filter(e => e.src === 'outlook' || e.src === 'both');
  if (curFilter === 'today')  list = list.filter(e => e.date === todayStr);
  if (curFilter === 'synced') list = list.filter(e => e.src === 'both');
  if (curFilter === 'week') {
    list = list.filter(e => {
      const d = new Date(e.date + 'T00:00:00');
      return d >= now && d <= weekEnd;
    });
  }
  return list;
}

/* ─── Render ─── */
function render() {
  const list = getVisible();
  const el   = document.getElementById('ev-list');

  if (!list.length) {
    el.innerHTML = `
      <div class="empty">
        <i class="ti ti-calendar-off" aria-hidden="true"></i>
        <p>Sin eventos</p>
      </div>`;
  } else {
    el.innerHTML = list.map((ev, i) => `
      <div class="ev" role="listitem" style="animation-delay:${i * 45}ms">
        <div class="ev-stripe" style="${stripeStyle(ev.src)}"></div>
        <div class="ev-body">
          <div class="ev-title">${escHtml(ev.title)}</div>
          <div class="ev-time">${fmtDisplay(ev.date, ev.time)}${ev.desc ? ' · ' + escHtml(ev.desc) : ''}</div>
          <div class="ev-tags">${tagHtml(ev.src)}</div>
        </div>
        <div class="ev-icon" aria-hidden="true">
          <i class="ti ${randIcon(ev.id)}"></i>
        </div>
      </div>
    `).join('');
  }

  /* stats */
  document.getElementById('s-total').textContent = events.length;
  document.getElementById('s-sync').textContent  = events.filter(e => e.src === 'both').length;
  document.getElementById('s-today').textContent = events.filter(e => e.date === todayStr).length;
  document.getElementById('month-label').textContent =
    `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── View / filter controls ─── */
function setView(v, btn) {
  curView = v;
  document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  render();
}
function setFilter(f, btn) {
  curFilter = f;
  document.querySelectorAll('.chip').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  render();
}

/* ─── New event sheet ─── */
function openSheet() {
  document.getElementById('f-date').value = todayStr;
  const h  = pad(now.getHours());
  const m2 = pad(Math.ceil(now.getMinutes() / 15) * 15 % 60 || 0);
  document.getElementById('f-time').value = `${h}:${m2}`;
  document.getElementById('f-title').value = '';
  document.getElementById('f-desc').value  = '';
  document.getElementById('chk-g').checked = true;
  document.getElementById('chk-o').checked = true;
  document.getElementById('opt-g').classList.add('sel');
  document.getElementById('opt-o').classList.add('sel');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('f-title').focus(), 380);
}
function closeSheet() {
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function bgClose(e) { if (e.target === document.getElementById('overlay')) closeSheet(); }
function togOpt(id, cb) { document.getElementById(id).classList.toggle('sel', cb.checked); }

function saveEv() {
  const title = document.getElementById('f-title').value.trim();
  if (!title) { document.getElementById('f-title').focus(); return; }
  const g = document.getElementById('chk-g').checked;
  const o = document.getElementById('chk-o').checked;
  if (!g && !o) { toast('Selecciona al menos un calendario'); return; }
  const src = g && o ? 'both' : g ? 'google' : 'outlook';

  events.push({
    id:    nextId++,
    title,
    date:  document.getElementById('f-date').value  || todayStr,
    time:  document.getElementById('f-time').value  || '09:00',
    desc:  document.getElementById('f-desc').value.trim(),
    src,
  });
  events.sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1));
  saveEvents();
  render();
  closeSheet();

  const msg = src === 'both'    ? '✓ Guardado en Google + Outlook'
            : src === 'google'  ? '✓ Guardado en Google Calendar'
            :                     '✓ Guardado en Outlook';
  toast(msg);
}

/* ─── Settings ─── */
function openSettings() {
  document.getElementById('settings-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSettings() {
  document.getElementById('settings-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function bgCloseSettings(e) {
  if (e.target === document.getElementById('settings-overlay')) closeSettings();
}
function clearEvents() {
  if (!confirm('¿Borrar todos los eventos locales?')) return;
  events = [];
  saveEvents();
  render();
  closeSettings();
  toast('Eventos borrados');
}

/* ─── Toast ─── */
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-txt').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ─── Splash → App ─── */
function initApp() {
  render();
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('fab').style.display = 'flex';
  }, 2050);
}

/* ─── Service Worker registration ─── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('[Connexier] SW registered'))
      .catch(err => console.warn('[Connexier] SW error:', err));
  });
}

/* ─── Keyboard shortcuts ─── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeSheet(); closeSettings(); }
  if (e.key === 'n' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
    openSheet();
  }
});

/* ─── Init ─── */
initApp();

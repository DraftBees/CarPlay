/* Simulatore display aftermarket FlyThings/ZKOS 1920×720.
   Usa le immagini originali del backup (res/ui) e i testi reali (res/tr).
   Le modifiche (testi e immagini) restano nel browser e si esportano per adb push. */
(() => {
'use strict';

const LANGS = window.LANGS, LANG_FILES = window.LANG_FILES, CFG = window.DEVICE_CFG, IMAGES = window.IMAGES;
const THEME = window.THEME || { images: {}, strings: {} };
const LANG_ORDER = [ // ordine del menu Lingua (language_select dell'apparecchio = indice)
  ['zh_CN', 'language_simp'], ['en_US', 'language_english'], ['ft_TR', 'language_trad'], ['ri_JA', 'language_japanese'],
  ['ko_KR', 'language_korean'], ['de_GE', 'language_german'], ['fa_FR', 'language_french'], ['pu_PO', 'language_portugal'],
  ['yi_IT', 'language_italy'], ['xi_SP', 'language_spanish'], ['bl_PO', 'language_poland'], ['el_RU', 'language_russia'],
  ['al_AR', 'language_arabic'], ['hl_HO', 'language_dutch'], ['teq_TU', 'language_turkish'],
];

/* Geometria dei due quadranti su dash_bg_english.png (pixel dell'immagine 1920×720).
   outer/inner: [fondo, vertice, cima]. split = frazione della scala al vertice. */
const DASH = {
  speed: { max: 160, split: 100 / 160, outer: [[345, 670], [130, 290], [318, 50]], inner: [[460, 670], [270, 290], [425, 52]] },
  rpm:   { max: 8,   split: 5 / 8,     outer: [[1615, 670], [1845, 288], [1640, 50]], inner: [[1495, 670], [1685, 290], [1530, 52]] },
};

/* ------------------------------------------------------------------ stato */
const S = {
  lang: LANG_ORDER[CFG.language_select] ? LANG_ORDER[CFG.language_select][0] : (window.DEVICE_PREFS.sys_lang_code_key || 'yi_IT'),
  bg: (CFG.screen_bg | 0) + 1,            // screen_bg è 0-based → bg1..bg6
  brightness: CFG.brightness ?? 70,
  autoBright: !!CFG.is_auto_bright_switch,
  vol: { media: CFG.car_volume ?? 30, tel: 25, rev: CFG.reverse_volume ?? 7, nav: 20 },
  eq: { style: 4, bass: CFG.bass_volume ?? 10, alto: CFG.alto_volume ?? 10, high: CFG.high_volume ?? 10 },
  hour24: !CFG.hour_mode,
  clockOffset: 0,
  sw: { turn: !!CFG.left_right_back_switch, radar: !!CFG.radar_back_switch, radarDisp: !!CFG.radar_display_switch, track: true, backDisp: !!CFG.back_display_switch, btOn: true, btAuto: true, miracast: false },
  customBg: null,
  theme: true,   // tema BMW attivo (false = grafica originale)
  strOv: {},   // { lang: { key: valore } }
  imgOv: {},   // { 'HomePage/x.png': dataURL }
  screen: { name: 'home' }, history: [],
  edit: false, dashGuide: false,
  music: { playing: false, pos: 0, idx: 0, list: false, shuffle: false },
  dash: { auto: true, speed: 0, rpm: 0.8, t: 0 },
  doors: { lf: false, rf: false, lr: false, rr: false, hood: false, trunk: false },
  call: null, dial: '', popup: null,
};

const SAMPLE_TRACKS = [
  { t: 'Strada di notte', a: 'Esempio', al: 'Demo USB', d: 214 },
  { t: 'Autostrada A1', a: 'Esempio', al: 'Demo USB', d: 187 },
  { t: 'Tangenziale', a: 'Esempio', al: 'Demo USB', d: 242 },
  { t: 'Galleria', a: 'Esempio', al: 'Demo USB', d: 199 },
];
const SAMPLE_CONTACTS = ['Anna (esempio)', 'Marco (esempio)', 'Officina (esempio)', 'Casa (esempio)', 'Ufficio (esempio)'];

/* ------------------------------------------------------------------ storage */
const store = {
  db: null,
  async open() {
    try {
      this.db = await new Promise((res, rej) => {
        const r = indexedDB.open('displayauto-sim', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('kv');
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      });
    } catch (e) { this.db = null; }
  },
  async get(k) {
    if (!this.db) return undefined;
    try { return await new Promise((res, rej) => { const q = this.db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); } catch (e) { return undefined; }
  },
  async set(k, v) {
    if (!this.db) return;
    try { await new Promise((res, rej) => { const tx = this.db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); } catch (e) { /* ignorato */ }
  },
};
const saveEdits = () => { store.set('strOv', S.strOv); store.set('imgOv', S.imgOv); store.set('customBg', S.customBg); updateCounts(); };
const savePrefs = () => {
  try { localStorage.setItem('displayauto-prefs', JSON.stringify({ theme: S.theme, lang: S.lang, bg: S.bg, brightness: S.brightness, autoBright: S.autoBright, vol: S.vol, eq: S.eq, hour24: S.hour24, sw: S.sw })); } catch (e) { /* ignorato */ }
};
const loadPrefs = () => {
  try { const p = JSON.parse(localStorage.getItem('displayauto-prefs') || 'null'); if (p) Object.assign(S, p); } catch (e) { /* ignorato */ }
};

/* ------------------------------------------------------------------ helpers */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const screenEl = $('#screen');

function tOrig(k, lang = S.lang) { const L = LANGS[lang] || {}; return L[k] != null ? L[k] : (LANGS.en_US[k] != null ? LANGS.en_US[k] : k); }
function themeStr(k, lang = S.lang) { const ts = S.theme && THEME.strings[lang]; return ts && ts[k] != null ? ts[k] : null; }
function tBase(k, lang = S.lang) { const v = themeStr(k, lang); return v != null ? v : tOrig(k, lang); } // testo di partenza (tema o originale)
function t(k) { const o = S.strOv[S.lang]; return o && o[k] != null ? o[k] : tBase(k); }
function themeImg(p) { return S.theme ? THEME.images[p] : null; }
function src(p) { return S.imgOv[p] || themeImg(p) || ('res/ui/' + p); }
const T = (k, cls = 'lbl', style = '') => `<span class="${cls}" data-k="${k}" style="${style}">${esc(t(k))}</span>`;
const I = (p, style = '', extra = '') => `<img src="${src(p)}" data-img="${p}" style="${style}" ${extra} draggable="false" alt="">`;
const P = (n, f, style = '') => I(n, style, `data-n="${n}" data-p="${f}"`); // immagine con stato premuto

function now() { return new Date(Date.now() + S.clockOffset); }
function clockStr() {
  const d = now(); let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
  if (!S.hour24) { const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m} ${ap}`; }
  return `${String(h).padStart(2, '0')}:${m}`;
}
function dateStr() { const d = now(); return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`; }
const fmtT = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function toast(msg) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; document.body.append(d); setTimeout(() => d.remove(), 2200); }

/* ------------------------------------------------------------------ router */
function go(name, arg = {}) { S.history.push(S.screen); S.screen = { name, ...arg }; render(); }
function back() { if (S.popup) { S.popup = null; render(); return; } if (S.call) return; S.screen = S.history.pop() || { name: 'home' }; render(); }
function home() { S.popup = null; S.history = []; S.screen = { name: 'home' }; render(); }

/* ------------------------------------------------------------------ parti comuni */
function header(titleKey, opts = {}) {
  return `<div class="topbar">${I('HomePage/home_top_bg.png', '', 'class="tb"')}
    <div class="navbtn press" data-act="back" style="left:16px">${P('status/home_back_n.png', 'status/home_back_f.png')}</div>
    ${titleKey ? T(titleKey, 'title') : ''}
    <div class="clock" data-clock style="right:${opts.noHome ? 40 : 210}px"></div>
    ${opts.noHome ? '' : `<div class="navbtn press" data-act="home" style="right:24px">${P('status/home_home_n.png', 'status/home_home_f.png')}</div>`}
  </div>`;
}
function bgLayer() {
  if (S.bg === 'custom' && S.customBg) return `<img class="bgimg" src="${S.customBg}" alt="" draggable="false">`;
  return I(`bg/bg${S.bg}.png`, '', 'class="bgimg"');
}
function slider(id, val, max, width = 900) {
  const f = Math.max(0, Math.min(1, val / max));
  return `<div class="slider" data-slider="${id}" data-max="${max}" style="width:${width}px">
    ${I('setting/set_adjust_bg.png', `width:${width}px`, 'class="tr"')}
    <div class="fill" style="width:${f * width}px">${I('setting/set_adjust.png', `width:${width}px`)}</div>
    ${I('setting/set_adjust_click.png', `left:${f * width}px`, 'class="knob"')}
  </div>`;
}
function sw(id, on) { return `<span class="sw" data-sw="${id}">${I(on ? 'setting/on.png' : 'setting/off.png', 'width:110px;height:58px')}</span>`; }
function devbtn(key, act, w = 354, h = 68, on = false, data = '') {
  return `<span class="devbtn" data-act="${act}" ${data}>${I(on ? 'setting/set_btn_f.png' : 'setting/set_btn_n.png', `width:${w}px;height:${h}px`)}${T(key, 'lbl')}</span>`;
}
function popupHtml() {
  if (!S.popup) return '';
  const p = S.popup;
  return `<div class="popup"><div class="box">${I('setting/popwbag.png', '', 'class="pb"')}
    <div class="msg">${p.key ? T(p.key, 'lbl', 'position:static;white-space:normal') : esc(p.text)}</div>
    <div class="acts">${(p.buttons || [['confir_text', 'popok']]).map(([k, a]) => devbtn(k, a, 220, 68)).join('')}</div>
  </div></div>`;
}

/* ------------------------------------------------------------------ schermate */
const HOME_CARDS = [
  ['wireless_carplay', 'home_icon_wiredcarplay', ['link', { kind: 'carplay' }]],
  ['Auto', 'home_icon_androidauto', ['link', { kind: 'aa' }]],
  ['bt_menu', 'home_icon_bluetooth', ['bt', { tab: 'dial' }]],
  ['music', 'za_home_icon_music', ['music']],
  ['video', 'home_icon_hidvideo', ['video']],
  ['dash_menu', 'home_icon_dashboard', ['dash']],
  ['car_menu', 'home_icon_carinfo', ['car']],
  ['bg_menu', 'home_bg', ['settings', { tab: 'bg' }]],
  ['eq_menu', 'home_sound', ['settings', { tab: 'eq' }]],
  ['set_menu', 'home_icon_zlink', ['settings', { tab: 'sys', sub: 'light' }]],
  ['dvr_menu', 'home_icon_dvr', ['dvr']],
  ['Airplay', 'home_icon_miracast', ['link', { kind: 'airplay' }]],
  ['Hicar', 'home_icon_hicar', ['link', { kind: 'hicar' }]],
];

const screens = {};

screens.home = () => `
  ${bgLayer()}
  <div class="topbar">${I('HomePage/home_top_bg.png', '', 'class="tb"')}
    <div class="clock" data-clock style="left:40px"></div>
    <div class="sicons">${I('status/home_bt.png')}${I('status/u.png')}</div>
  </div>
  <div class="leftbar">${I('HomePage/home_left_bg.png', 'position:absolute;inset:0;width:166px;height:620px')}
    ${[['home_icon_s_music', 'music', 40], ['home_icon_s_dail', 'bt', 185], ['home_icon_s_video', 'video', 330], ['home_icon_s_set', 'settings', 475]]
      .map(([n, g, y]) => `<div class="q press" data-go="${g}" style="top:${y}px">${P(`HomePage/${n}_n.png`, `HomePage/${n}_f.png`, 'width:80px;height:80px')}</div>`).join('')}
  </div>
  <div class="carousel" id="carousel">
    ${HOME_CARDS.map(([k, ic, g], i) => `<div class="card" data-card="${i}">${P(`HomePage/${ic}_n.png`, `HomePage/${ic}_s.png`)}${T(k)}</div>`).join('')}
  </div>
  <div class="dots" id="dots">${Array.from({ length: Math.ceil(HOME_CARDS.length / 4) }, (_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>`;

const LINK = {
  carplay: { title: 'wireless_carplay', icon: 'home_icon_wiredcarplay', help: 'carplay_help_remind', n: 8 },
  aa: { title: 'Auto', icon: 'home_icon_androidauto', help: 'aa_help_remind', n: 7 },
  airplay: { title: 'Airplay', icon: 'home_icon_miracast', help: 'airplay_help_remind', n: 6 },
  hicar: { title: 'Hicar', icon: 'home_icon_hicar', help: 'hicar_help_remind', n: 5 },
};
screens.link = ({ kind }) => {
  const L = LINK[kind];
  return `${bgLayer()}${header(L.title)}
  <div class="content">
    <div class="abs" style="left:90px;top:30px;width:410px;height:580px;transform:scale(.92);transform-origin:0 0;border-radius:8px;overflow:hidden">${I(`HomePage/${L.icon}_n.png`, 'width:410px;height:580px')}</div>
    <div class="abs" style="left:560px;top:24px;width:1300px;display:flex;flex-direction:column;gap:8px;font-size:28px">
      ${Array.from({ length: L.n }, (_, i) => T(`${L.help}${i + 1}`, 'lbl', `position:static;white-space:normal;${i === 0 ? 'font-size:38px;color:var(--dev-accent)' : ''}`)).join('')}
      <div class="devtxt dim" style="margin-top:10px">${T('dev_name_text', 'lbl', 'position:static')}: ${esc(CFG.bt_name)}</div>
      <div class="devtxt" style="color:var(--dev-accent)">${T('bt_connect_now', 'lbl', 'position:static')}</div>
    </div>
  </div>`;
};

const BT_TABS = [['dial', 'bt_dail', 'bt_dial_menu'], ['book', 'bt_contacts', 'bt_book_menu'], ['rec', 'bt_record', 'bt_record_menu'], ['music', 'bt_music', 'bt_music_menu'], ['set', 'bt_set', 'bt_set_menu']];
screens.bt = ({ tab = 'dial', rec = 'out' }) => {
  let body = '';
  if (tab === 'dial') {
    body = `<div class="abs" style="left:380px;top:40px;width:640px;height:90px;border-bottom:2px solid rgba(255,255,255,.3);font-size:58px;text-align:center;letter-spacing:.06em">${esc(S.dial) || '&nbsp;'}</div>
      <div class="abs keypad" style="left:470px;top:150px">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => `<div class="key" data-act="dial" data-v="${k}">${k}</div>`).join('')}</div>
      <div class="abs press" data-act="call" style="left:1180px;top:150px">${P('bt/bt_call_btn1_n.png', 'bt/bt_call_btn1_f.png')}</div>
      <div class="abs key" data-act="dialdel" style="left:1180px;top:340px;width:180px;font-size:34px">⌫</div>
      <div class="abs devtxt dim" style="left:1420px;top:170px;width:440px;white-space:normal">${T('bt_no_connect', 'lbl', 'position:static')}<br><span style="font-size:24px">${esc(CFG.bt_name)}</span></div>`;
  } else if (tab === 'book') {
    body = `<div class="abs list-dev" style="left:300px;top:20px;width:1100px">${SAMPLE_CONTACTS.map((c, i) => `<div class="it" data-act="callnum" data-v="33${i}12345${i}">${I('bt/bt_s_contacts.png')}<span>${esc(c)}</span><span class="dim" style="margin-left:auto">+39 33${i} 12345${i}</span></div>`).join('')}</div>
      <div class="abs press" data-act="toast" data-v="Rubrica: download simulato" style="left:1520px;top:60px">${I('bt/bt_contacts_download_n.png')}</div>`;
  } else if (tab === 'rec') {
    const subs = [['out', 'call_out_text', 'bt_s_call_callout'], ['in', 'call_in_text', 'bt_s_call_callin'], ['miss', 'call_miss_text', 'bt_s_call_callmiss']];
    body = `<div class="abs" style="left:300px;top:20px;display:flex;gap:20px">${subs.map(([id, k]) => devbtn(k, 'rec', 300, 68, rec === id, `data-v="${id}"`)).join('')}</div>
      <div class="abs list-dev" style="left:300px;top:110px;width:1300px">${SAMPLE_CONTACTS.slice(0, 4).map((c, i) => `<div class="it" data-act="callnum" data-v="33${i}12345${i}">${I(`bt/${subs.find((s) => s[0] === rec)[2]}.png`)}<span>${esc(c)}</span><span class="dim" style="margin-left:auto">${dateStr()} ${String(9 + i).padStart(2, '0')}:1${i}</span></div>`).join('')}</div>`;
  } else if (tab === 'music') {
    body = `<div class="abs" style="left:330px;top:70px;width:270px;height:270px">${I('bt/za_btmusic_defaultcover.png')}</div>
      <div class="abs devtxt" style="left:680px;top:110px;font-size:44px">Brano Bluetooth (esempio)</div>
      <div class="abs devtxt dim" style="left:680px;top:180px">${T('bt_music_menu', 'lbl', 'position:static')}</div>
      <div class="abs" style="left:640px;top:330px;display:flex;gap:40px">
        <span class="press">${I('bt/bt_tmusic_previous_n.png')}</span><span class="press" data-act="btplay">${I(S.music.playing ? 'bt/bt_tmusic_pause_n.png' : 'bt/bt_tmusic_play_n.png')}</span><span class="press">${I('bt/bt_tmusic_next_n.png')}</span></div>`;
  } else {
    const rows = [['dev_name_text', `<span class="v">${esc(CFG.bt_name)}</span>`], ['pin_text', '<span class="v">0000</span>'], ['bt_switch_text', sw('btOn', S.sw.btOn)], ['auto_connect_text', sw('btAuto', S.sw.btAuto)]];
    body = `<div class="abs" style="left:240px;top:0;width:1680px;height:620px">${rows.map(([k, v], i) => `<div class="setrow" style="top:${30 + i * 100}px">${T(k)}${v}</div>`).join('')}
      <div class="setrow" style="top:430px;border:0">${T('bt_no_connect', 'lbl', 'color:var(--dev-accent)')}</div></div>`;
  }
  return `${bgLayer()}${header('bt_menu')}
    <div class="sidetabs">${BT_TABS.map(([id, ic, k]) => `<div class="sidetab ${tab === id ? 'on' : ''}" data-act="bttab" data-v="${id}">${I(`bt/${ic}_${tab === id ? 'f' : 'n'}.png`)}${T(k)}</div>`).join('')}</div>
    <div class="content">${body}</div>`;
};

screens.call = () => {
  const c = S.call; const secs = c.start ? (Date.now() - c.start) / 1000 : 0;
  return `${bgLayer()}${header(null, { noHome: true })}
    <div class="content">
      <div class="abs" style="left:880px;top:40px">${I('bt/head.png', 'width:160px;height:160px')}</div>
      <div class="abs devtxt" style="left:0;right:0;top:230px;text-align:center;font-size:56px">${esc(c.name || c.num)}</div>
      <div class="abs" style="left:0;right:0;top:310px;text-align:center">${T(c.start ? 'call_remind' : 'outgoing_remind', 'lbl devtxt', 'position:static;color:var(--dev-accent)')} <span class="devtxt" data-calltime>${c.start ? fmtT(secs) : ''}</span></div>
      <div class="abs press" data-act="hang" style="left:870px;top:400px">${P('bt/bt_call_btn2_n.png', 'bt/bt_call_btn2_f.png')}</div>
    </div>`;
};

screens.music = () => {
  const m = S.music, tr = SAMPLE_TRACKS[m.idx], f = m.pos / tr.d;
  if (m.list) {
    return `${I('MusicPlayer/music_bg.png', '', 'class="bgimg"')}${header('music')}
    <div class="sidetabs">
      <div class="sidetab on">${I('MusicPlayer/file_usbr_s.png')}${T('file_usb1')}</div>
      <div class="sidetab" data-act="toast" data-v="USB2 vuota">${I('MusicPlayer/file_usbr_n.png')}${T('file_usb2')}</div>
      <div class="sidetab" data-act="toast" data-v="Nessuna scheda SD">${I('MusicPlayer/file_local_n.png')}${T('file_sd')}</div>
    </div>
    <div class="content"><div class="abs list-dev" style="left:260px;top:20px;width:1400px">
      ${SAMPLE_TRACKS.map((s, i) => `<div class="it ${i === m.idx ? 'on' : ''}" data-act="pick" data-v="${i}">${I('MusicPlayer/file_music.png')}<span>${esc(s.t)}.mp3</span><span class="dim" style="margin-left:auto">${fmtT(s.d)}</span></div>`).join('')}
    </div><span class="tag">brani di esempio</span></div>`;
  }
  return `${I('MusicPlayer/music_bg.png', '', 'class="bgimg"')}${header('music')}
  <div class="content">
    <div class="abs" style="left:150px;top:40px;width:400px;height:407px">${I('MusicPlayer/music_defaultcover.png', 'width:400px;height:407px')}</div>
    <div class="abs" style="left:680px;top:50px;display:flex;flex-direction:column;gap:22px">
      ${[['music_title', tr.t], ['music_artist', tr.a], ['music_albunm', tr.al]].map(([ic, v]) => `<div style="display:flex;align-items:center;gap:26px;font-size:40px">${I(`MusicPlayer/${ic}.png`)}<span>${esc(v)}</span></div>`).join('')}
    </div>
    <div class="abs" style="left:680px;top:340px;width:1060px;height:32px" data-act="seek">
      ${I('MusicPlayer/music_slide_bg.png', 'position:absolute;left:0;top:0;width:1060px;height:32px')}
      <div data-mfill style="position:absolute;left:0;top:0;height:32px;overflow:hidden;width:${f * 1060}px">${I('MusicPlayer/music_slide.png', 'width:1060px;height:32px')}</div>
      <div data-mknob style="position:absolute;top:0;left:${f * 1060 - 16}px">${I('MusicPlayer/music_slide_btn.png')}</div>
    </div>
    <div class="abs devtxt dim" style="left:680px;top:385px" data-mpos>${fmtT(m.pos)}</div>
    <div class="abs devtxt dim" style="left:1640px;top:385px">${fmtT(tr.d)}</div>
    <div class="abs" style="left:780px;top:470px;display:flex;gap:70px">
      <span class="press" data-act="shuffle" style="${m.shuffle ? '' : 'opacity:.55'}">${I(m.shuffle ? 'MusicPlayer/music_btn_random_n.png' : 'MusicPlayer/music_btn_single_n.png')}</span>
      <span class="press" data-act="prev">${P('MusicPlayer/music_btn_previous_n.png', 'MusicPlayer/music_btn_previous_f.png')}</span>
      <span class="press" data-act="play">${m.playing ? P('MusicPlayer/music_btn_pause_n.png', 'MusicPlayer/music_btn_pause_f.png') : P('MusicPlayer/music_btn_play_n.png', 'MusicPlayer/music_btn_play_f.png')}</span>
      <span class="press" data-act="next">${P('MusicPlayer/music_btn_next_n.png', 'MusicPlayer/music_btn_next_f.png')}</span>
      <span class="press" data-act="mlist">${P('MusicPlayer/music_btn_list_n.png', 'MusicPlayer/music_btn_list_f.png')}</span>
    </div>
    <span class="tag">brano di esempio</span>
  </div>`;
};

screens.video = () => `${bgLayer()}${header('video')}
  <div class="content">
    <div class="abs" style="left:620px;top:40px">${I('media/video_load.png')}</div>
    <div class="abs devtxt" style="left:0;right:0;top:500px;text-align:center">${T('no_devices', 'lbl', 'position:static')}</div>
  </div>`;

screens.dvr = () => `<div class="bgimg" style="background:#05070b"></div>${header('dvr_menu')}
  <div class="content">
    <div class="abs" style="left:755px;top:30px;width:410px;height:580px;transform:scale(.7);transform-origin:50% 0;border-radius:8px;overflow:hidden">${I('HomePage/home_icon_dvr_n.png', 'width:410px;height:580px')}</div>
    <div class="abs devtxt dim" style="left:0;right:0;top:470px;text-align:center">Nessuna telecamera DVR collegata (simulazione)</div>
  </div>`;

screens.dash = () => `${I('dash/dash_bg_english.png', '', 'class="bgimg"')}
  <canvas class="dashcv" id="dashcv" width="1920" height="720"></canvas>
  <div class="abs" style="left:0;right:0;top:200px;text-align:center;font-size:190px;line-height:1;font-variant-numeric:tabular-nums" data-speed>0</div>
  <div class="abs" style="left:0;right:0;top:400px;text-align:center;font-size:40px;color:rgba(255,255,255,.65)">km/h</div>
  <div class="abs" style="left:0;right:0;top:470px;text-align:center;font-size:36px;color:rgba(255,255,255,.55)" data-rpm>0 r/min</div>
  <div class="abs" style="left:780px;top:560px;display:flex;gap:60px">${I('HomePage/dash_safety.png')}${I('HomePage/dash_consumption.png')}${I('HomePage/dash_p.png')}</div>
  <div class="navbtn press" data-act="back" style="left:820px;top:20px">${P('status/home_back_n.png', 'status/home_back_f.png')}</div>
  <div class="navbtn press" data-act="home" style="left:950px;top:20px">${P('status/home_home_n.png', 'status/home_home_f.png')}</div>`;

screens.car = () => {
  const d = S.doors;
  const layers = [['lf', 'left_front_door'], ['rf', 'right_front_door'], ['lr', 'left_rear_door'], ['rr', 'right_rear_door'], ['hood', 'engine'], ['trunk', 'rear']]
    .filter(([k]) => d[k]).map(([, n]) => I(`door/alert_car_${n}_open.png`, 'position:absolute;inset:0;width:664px;height:480px')).join('');
  return `${bgLayer()}${header('car_menu')}
  <div class="content">
    <div class="abs" style="left:60px;top:0;width:600px;height:620px;overflow:hidden">${I('car/car_bg.png', 'width:600px;height:720px;margin-top:-50px')}
      ${S.sw.radarDisp ? I('car/fradar_0.png', 'position:absolute;left:187px;top:20px') + I('car/rradar_0.png', 'position:absolute;left:187px;top:420px') : ''}
      ${I('car/car.png', 'position:absolute;left:185px;top:140px')}
    </div>
    <div class="abs" style="left:720px;top:40px;width:664px;height:480px">${I('door/alert_carinfo_bg.png', 'position:absolute;inset:0;width:664px;height:480px')}${I('door/alert_car.png', 'position:absolute;inset:0;width:664px;height:480px')}${layers}</div>
    <div class="abs" style="left:1440px;top:60px;width:440px;display:flex;flex-direction:column;gap:18px;font-size:28px">
      <div>${T('107_version_test', 'lbl', 'position:static')}<br><span class="dim">—</span></div>
      <div>${T('can_version_test', 'lbl', 'position:static')}<br><span class="dim">can-bm-02-bm113-hd43</span></div>
      <div class="dim" style="font-size:22px">Porte e radar arrivano dal CANBUS: usa i comandi sotto lo schermo per simularli.</div>
    </div>
  </div>`;
};

screens.reverse = () => `<div class="bgimg" style="background:radial-gradient(ellipse at 50% 20%, #3c4148, #15181c 70%)"></div>
  <div class="abs" style="left:0;top:0;width:1320px;height:720px;overflow:hidden">
    ${S.sw.track ? I('car/trl_10.png', 'position:absolute;left:34px;top:300px') : ''}
    <div class="abs devtxt" style="left:40px;top:30px;color:#ffcc33">${T('reverse_text', 'lbl', 'position:static')}</div>
  </div>
  ${S.sw.radarDisp ? `<div class="abs" style="left:1320px;top:0;width:600px;height:720px">${I('car/car_bg.png')}${I('car/rradar_0.png', 'position:absolute;left:187px;top:470px')}${I('car/rlm_6.png', 'position:absolute;left:187px;top:470px')}${I('car/car.png', 'position:absolute;left:185px;top:190px')}</div>` : ''}
  <div class="abs devtxt dim" style="left:40px;bottom:30px;font-size:24px">Tocca lo schermo per uscire dalla retromarcia</div>`;

const SET_TABS = [['sys', 'set_ic_common', 'set_system_menu'], ['eq', 'set_ic_eq', 'set_sound_menu'], ['bg', 'set_ic_wallpaper', 'set_bg_menu'], ['factory', 'set_ic_factory', 'set_factory_menu']];
const SYS_SUB = [['light', 'set_light', 'set_light'], ['audio', 'set_audio', 'set_audio'], ['lang', 'set_language', 'set_language'], ['date', 'set_date', 'set_date'], ['back', 'set_back', 'set_back'], ['system', 'set_system', 'set_system']];

function setPane(sub) {
  if (sub === 'light') {
    return `<div class="setrow" style="top:20px">${T('auto_brightness')}${sw('autoBright', S.autoBright)}</div>
      <div class="setrow" style="top:130px;height:120px">${T('brightness', 'lbl', 'flex:0 0 200px')}${slider('brightness', S.brightness, 100, 860)}<span class="v" data-sval="brightness">${S.brightness}</span></div>
      <div class="abs" style="left:60px;top:300px;display:flex;gap:30px">${devbtn('daytime_mode', 'toast', 354, 68, S.autoBright, 'data-v="Modalità giorno"')}${devbtn('night_mode', 'toast', 354, 68, false, 'data-v="Modalità notte"')}</div>`;
  }
  if (sub === 'audio') {
    return [['volume_text', 'media'], ['telephone_text', 'tel'], ['reverse_text', 'rev'], ['navigation_text', 'nav']]
      .map(([k, id], i) => `<div class="setrow" style="top:${10 + i * 110}px;height:110px">${T(k, 'lbl', 'flex:0 0 260px')}${slider('vol.' + id, S.vol[id], 40, 820)}<span class="v" data-sval="vol.${id}">${S.vol[id]}</span></div>`).join('');
  }
  if (sub === 'lang') {
    return `<div class="abs" style="left:40px;top:20px;display:grid;grid-template-columns:repeat(4,300px);gap:20px 26px">
      ${LANG_ORDER.map(([code, k]) => `<span class="devbtn" data-act="lang" data-v="${code}">${I(code === S.lang ? 'setting/set_btn_f.png' : 'setting/set_btn_n.png', 'width:300px;height:68px')}${T(k)}</span>`).join('')}</div>`;
  }
  if (sub === 'date') {
    const d = now();
    const cols = [['year_text', d.getFullYear(), 'y'], ['mouth_text', d.getMonth() + 1, 'mo'], ['day_text', d.getDate(), 'd'], ['hour_text', d.getHours(), 'h'], ['min_text', d.getMinutes(), 'mi']];
    return `<div class="abs" style="left:60px;top:20px;display:flex;gap:40px">
      ${cols.map(([k, v, id]) => `<div style="width:190px;display:flex;flex-direction:column;align-items:center;gap:10px">${T(k, 'lbl', 'position:static;font-size:28px;color:rgba(255,255,255,.65)')}
        <div class="key" style="width:150px;height:64px" data-act="dt" data-v="${id}:1">▲</div>
        <div style="font-size:60px;font-variant-numeric:tabular-nums">${String(v).padStart(2, '0')}</div>
        <div class="key" style="width:150px;height:64px" data-act="dt" data-v="${id}:-1">▼</div></div>`).join('')}
    </div>
    <div class="abs" style="left:60px;top:400px;display:flex;gap:30px">${devbtn('time_mode1', 'h24', 300, 68, S.hour24, 'data-v="1"')}${devbtn('time_mode2', 'h24', 300, 68, !S.hour24, 'data-v="0"')}</div>`;
  }
  if (sub === 'back') {
    const rows = [['turn_left_right_switch', 'turn'], ['radar_switch', 'radar'], ['radar_display_switch', 'radarDisp'], ['track_display_switch', 'track'], ['back_display_switch', 'backDisp']];
    return rows.map(([k, id], i) => `<div class="setrow" style="top:${i * 92}px">${T(k)}${sw(id, S.sw[id])}</div>`).join('')
      + `<div class="abs" style="left:60px;top:480px">${devbtn('reverse_text', 'reverse', 354, 68)}</div>`;
  }
  // system
  const info = [['system_version_test', 'FlyThings V2.1 / ZKOS'], ['app_version_test', 'NT113'], ['mcu_version_test', '—'], ['can_version_test', 'can-bm-02-bm113-hd43']];
  return info.map(([k, v], i) => `<div class="setrow" style="top:${i * 82}px;height:82px">${T(k)}<span class="v">${esc(v)}</span></div>`).join('')
    + `<div class="setrow" style="top:330px;height:82px">${T('miracast_display_switch')}${sw('miracast', S.sw.miracast)}</div>
    <div class="abs" style="left:60px;top:440px;display:flex;gap:24px;flex-wrap:wrap;width:1300px">
      ${devbtn('set_link_adjust', 'toast', 300, 68, false, 'data-v="Regolazione area CarPlay (simulata)"')}
      ${devbtn('mcu_update_text', 'mcu', 300, 68)}
      ${devbtn('set_reboot_menu', 'reboot', 300, 68)}
      ${devbtn('set_reset_factory', 'factoryreset', 300, 68)}
    </div>`;
}

screens.settings = ({ tab = 'sys', sub = 'light', pin = '' }) => {
  let body = '';
  if (tab === 'sys') {
    body = `<div class="abs" style="left:30px;top:20px;width:368px;display:flex;flex-direction:column;gap:12px">
      ${SYS_SUB.map(([id, ic, k]) => `<div class="press" data-act="sub" data-v="${id}" style="position:relative;height:84px;display:flex;align-items:center;gap:22px;padding-left:30px">
        ${id === sub ? I('setting/set_second_menu_select_f.png', 'position:absolute;inset:0;width:368px;height:84px') : ''}
        ${I(`setting/${ic}_${id === sub ? 's' : 'n'}.png`, 'position:relative;width:50px;height:50px')}${T(k, 'lbl', `position:relative;font-size:32px;${id === sub ? 'color:var(--dev-accent)' : ''}`)}</div>`).join('')}
    </div>
    <div class="abs" style="left:430px;top:10px;width:1460px;height:590px">${setPane(sub)}</div>`;
  } else if (tab === 'eq') {
    const st = ['audio_stytle1', 'audio_stytle2', 'audio_stytle3', 'audio_stytle4', 'audio_stytle5'];
    body = `<div class="abs" style="left:80px;top:30px;display:flex;gap:26px">${st.map((k, i) => devbtn(k, 'eqstyle', 300, 68, S.eq.style === i, `data-v="${i}"`)).join('')}</div>
      ${[['bass_text', 'bass'], ['alto_text', 'alto'], ['high_text', 'high']].map(([k, id], i) => `<div class="setrow" style="top:${150 + i * 130}px;height:120px;left:80px">${T(k, 'lbl', 'flex:0 0 220px')}${slider('eq.' + id, S.eq[id], 20, 1100)}<span class="v" data-sval="eq.${id}">${S.eq[id] - 10 > 0 ? '+' : ''}${S.eq[id] - 10}</span></div>`).join('')}`;
  } else if (tab === 'bg') {
    body = `<div class="abs" style="left:100px;top:40px;display:grid;grid-template-columns:repeat(3,310px);gap:40px 50px">
      ${[1, 2, 3, 4, 5, 6].map((n) => `<div class="press" data-act="bgsel" data-v="${n}" style="position:relative;width:310px;height:116px">${I(`bg/home_bg${n}_${S.bg === n ? 'f' : 'n'}.png`, 'width:310px;height:116px')}</div>`).join('')}
    </div>
    <div class="abs" style="left:1240px;top:30px;width:620px;display:flex;flex-direction:column;gap:6px;font-size:24px">
      ${T('set_bg_custom', 'lbl', 'position:static;font-size:32px;color:var(--dev-accent)')}
      ${[1, 2, 3, 4, 5].map((i) => T('set_bg_custom_remind' + i, 'lbl', 'position:static;white-space:normal;color:rgba(255,255,255,.75)')).join('')}
      <div style="display:flex;gap:20px;margin-top:16px">${devbtn('set_bg_custom_import', 'bgimport', 260, 68, S.bg === 'custom')}${S.customBg ? devbtn('set_bg_custom_exit', 'bgsel', 260, 68, false, 'data-v="custom"') : ''}</div>
    </div>`;
  } else {
    body = `<div class="abs devtxt" style="left:0;right:0;top:30px;text-align:center">${T('enter_password', 'lbl', 'position:static')}</div>
      <div class="abs" style="left:640px;top:90px;width:640px;height:80px;border-bottom:2px solid rgba(255,255,255,.3);font-size:56px;text-align:center;letter-spacing:.3em">${'•'.repeat(pin.length) || '&nbsp;'}</div>
      <div class="abs keypad" style="left:735px;top:190px;grid-template-columns:repeat(5,150px);left:570px">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((k) => `<div class="key" data-act="pin" data-v="${k}">${k}</div>`).join('')}
        <div class="key" data-act="pin" data-v="del" style="grid-column:span 2">⌫</div><div class="key" data-act="pin" data-v="ok" style="grid-column:span 3;background:#2c6bb8">${esc(t('confir_text'))}</div></div>`;
  }
  return `${bgLayer()}
  <div class="topbar">${I('setting/set_base_bg.png', 'position:absolute;inset:0;width:1920px;height:112px')}
    <div class="navbtn press" data-act="back" style="left:16px;top:10px">${P('status/home_back_n.png', 'status/home_back_f.png')}</div>
    <div class="abs" style="left:300px;right:300px;top:6px;display:flex;justify-content:center;gap:60px">
      ${SET_TABS.map(([id, ic, k]) => `<div class="press" data-act="settab" data-v="${id}" style="display:flex;align-items:center;gap:6px;height:92px">${I(`setting/${ic}_${tab === id ? 'f' : 'n'}.png`)}${T(k, 'lbl', `position:static;font-size:32px;${tab === id ? 'color:var(--dev-accent)' : ''}`)}</div>`).join('')}
    </div>
    <div class="navbtn press" data-act="home" style="right:24px;top:10px">${P('status/home_home_n.png', 'status/home_home_f.png')}</div>
  </div>
  <div class="content" style="top:112px;height:608px">${body}</div>`;
};

/* ------------------------------------------------------------------ render */
let dashRaf = 0;
function render() {
  cancelAnimationFrame(dashRaf);
  const sc = S.call ? { name: 'call' } : S.screen;
  const fn = screens[sc.name] || screens.home;
  screenEl.innerHTML = fn(sc) + popupHtml() + `<div id="dim" style="opacity:${S.autoBright ? 0 : (1 - S.brightness / 100) * 0.75}"></div>` + (S.booting ? '<div class="boot">ZKOS</div>' : '');
  markChanged();
  tickClock();
  if (sc.name === 'home') mountCarousel();
  if (sc.name === 'dash') drawDashLoop();
  renderSimbar();
}
function markChanged() {
  const o = S.strOv[S.lang] || {};
  $$('[data-k]', screenEl).forEach((el) => el.classList.toggle('changed', o[el.dataset.k] != null));
}
function tickClock() { $$('[data-clock]', screenEl).forEach((el) => { el.innerHTML = `${clockStr()}<small>${dateStr()}</small>`; }); }

/* carosello home: trascinamento + rotellina */
let dragInfo = null;
function mountCarousel() {
  const c = $('#carousel'); if (!c) return;
  if (S._homeScroll) { c.style.scrollBehavior = 'auto'; c.scrollLeft = S._homeScroll; c.style.scrollBehavior = ''; }
  const dots = () => { const n = $$('#dots i'); const max = c.scrollWidth - c.clientWidth; const i = max > 0 ? Math.round((c.scrollLeft / max) * (n.length - 1)) : 0; n.forEach((d, j) => d.classList.toggle('on', j === i)); S._homeScroll = c.scrollLeft; };
  c.addEventListener('scroll', dots, { passive: true });
  c.addEventListener('wheel', (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { c.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
  c.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; dragInfo = { x: e.clientX, sl: c.scrollLeft, moved: false, scale: currentScale }; c.style.scrollBehavior = 'auto'; });
}
window.addEventListener('pointermove', (e) => onDragMove(e));
window.addEventListener('pointerup', () => { if (dragInfo) { const c = $('#carousel'); if (c) c.style.scrollBehavior = ''; setTimeout(() => { dragInfo = null; }, 0); } });
function onDragMove(e) {
  const c = $('#carousel'); if (!dragInfo || !c) return;
  const dx = (e.clientX - dragInfo.x) / dragInfo.scale;
  if (Math.abs(dx) > 10) dragInfo.moved = true;
  if (dragInfo.moved) c.scrollLeft = dragInfo.sl - dx;
}

/* cruscotto */
function bandPoly(g, frac) {
  const lerp = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  const O = g.outer, N = g.inner;
  if (frac <= g.split) { const f = frac / g.split; return [O[0], lerp(O[0], O[1], f), lerp(N[0], N[1], f), N[0]]; }
  const f = (frac - g.split) / (1 - g.split);
  return [O[0], O[1], lerp(O[1], O[2], f), lerp(N[1], N[2], f), N[1], N[0]];
}
function drawDashLoop() {
  const cv = $('#dashcv'); if (!cv) return;
  const ctx = cv.getContext('2d');
  let last = performance.now();
  const frame = (ts) => {
    const dt = Math.min(0.1, (ts - last) / 1000); last = ts;
    const d = S.dash;
    if (d.auto) {
      d.t += dt;
      const target = 70 + 55 * Math.sin(d.t / 4) + 18 * Math.sin(d.t / 1.3);
      d.speed += (Math.max(0, target) - d.speed) * Math.min(1, dt * 1.5);
      const gear = Math.min(6, 1 + Math.floor(d.speed / 28));
      d.rpm = Math.min(7.6, 0.8 + ((d.speed % 28) / 28) * 3.2 + gear * 0.25);
      const r = $('#simSpeed'); if (r) { r.value = Math.round(d.speed); $('#simSpeedV').textContent = Math.round(d.speed) + ' km/h'; }
    }
    ctx.clearRect(0, 0, 1920, 720);
    const fill = (g, v, c1, c2) => {
      const pts = bandPoly(g, Math.max(0, Math.min(1, v / g.max)));
      const gr = ctx.createLinearGradient(0, 670, 0, 50); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
      ctx.fillStyle = gr; ctx.globalAlpha = 0.78; ctx.fill(); ctx.globalAlpha = 1;
    };
    const [c1, c2] = S.theme ? ['#1c69d4', '#5cb3ff'] : ['#3aa0ff', '#ff3d5a'];
    fill(DASH.speed, d.speed, c1, c2);
    fill(DASH.rpm, d.rpm, c1, d.rpm > 6.5 ? '#e3242b' : c2);
    if (S.dashGuide) drawGuide(ctx);
    const sp = $('[data-speed]'); if (sp) sp.textContent = Math.round(d.speed);
    const rp = $('[data-rpm]'); if (rp) rp.textContent = Math.round(d.rpm * 1000) + ' r/min';
    dashRaf = requestAnimationFrame(frame);
  };
  dashRaf = requestAnimationFrame(frame);
}
function drawGuide(ctx) {
  ctx.save(); ctx.setLineDash([12, 8]); ctx.lineWidth = 3; ctx.strokeStyle = '#ffb547';
  for (const g of [DASH.speed, DASH.rpm]) {
    ctx.beginPath(); [...g.outer, ...[...g.inner].reverse()].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,181,71,.9)'; ctx.font = '26px sans-serif';
  ctx.fillText('area lancetta velocità (0–160)', 40, 30); ctx.textAlign = 'right'; ctx.fillText('area lancetta giri (0–8)', 1880, 30);
  ctx.textAlign = 'center'; ctx.fillText('zona centrale: testi disegnati dal sistema', 960, 690);
  ctx.restore();
}

/* barra comandi simulazione (fuori dallo schermo) */
function renderSimbar() {
  const bar = $('#simbar'); const n = S.call ? 'call' : S.screen.name;
  let h = `<span class="slbl">Simulazione</span>`;
  if (n === 'dash') {
    h += `<label><input type="checkbox" id="simAuto" ${S.dash.auto ? 'checked' : ''}> guida automatica</label>
      <label>velocità <input type="range" id="simSpeed" min="0" max="160" value="${Math.round(S.dash.speed)}"></label><span class="val" id="simSpeedV">${Math.round(S.dash.speed)} km/h</span>
      <label><input type="checkbox" id="simGuide" ${S.dashGuide ? 'checked' : ''}> mostra guida quadranti</label>`;
  } else if (n === 'car') {
    h += [['lf', 'ant. sx'], ['rf', 'ant. dx'], ['lr', 'post. sx'], ['rr', 'post. dx'], ['hood', 'cofano'], ['trunk', 'bagagliaio']]
      .map(([k, l]) => `<label><input type="checkbox" data-door="${k}" ${S.doors[k] ? 'checked' : ''}> ${l}</label>`).join('');
  } else if (n === 'call') {
    h += `<span class="hint">Chiamata simulata: nessun telefono è collegato davvero.</span>`;
  } else {
    h += `<button class="btn small" type="button" data-sim="reverse">Inserisci retromarcia</button>
      <button class="btn small" type="button" data-sim="incoming">Chiamata in arrivo</button>
      <button class="btn small" type="button" data-sim="reboot">Riavvia display</button>
      <span class="hint">Sfondo home: bg${S.bg === 'custom' ? '_custom' : S.bg} · lingua: ${esc(S.lang)}</span>`;
  }
  bar.innerHTML = h;
}
$('#simbar').addEventListener('input', (e) => {
  const el = e.target;
  if (el.id === 'simSpeed') { S.dash.auto = false; S.dash.speed = +el.value; S.dash.rpm = Math.min(7.8, 0.8 + el.value / 26); $('#simAuto').checked = false; $('#simSpeedV').textContent = el.value + ' km/h'; }
  if (el.id === 'simAuto') S.dash.auto = el.checked;
  if (el.id === 'simGuide') S.dashGuide = el.checked;
  if (el.dataset.door) { S.doors[el.dataset.door] = el.checked; render(); }
});
$('#simbar').addEventListener('click', (e) => {
  const b = e.target.closest('[data-sim]'); if (!b) return;
  if (b.dataset.sim === 'reverse') go('reverse');
  if (b.dataset.sim === 'incoming') { S.call = { num: '+39 333 1234567', name: 'Anna (esempio)', start: 0, incoming: true }; render(); setTimeout(() => { if (S.call && !S.call.start) { S.call.start = Date.now(); render(); } }, 2500); }
  if (b.dataset.sim === 'reboot') reboot();
});

function reboot() { S.booting = true; S.history = []; S.screen = { name: 'home' }; render(); setTimeout(() => { S.booting = false; render(); }, 2700); }

/* ------------------------------------------------------------------ interazione */
let pressed = null;
screenEl.addEventListener('pointerdown', (e) => {
  if (S.edit) return;
  const host = e.target.closest('.press, .card, .q, .devbtn, .sidetab');
  if (!host) return;
  const img = host.querySelector('img[data-p]');
  if (img) { img.src = src(img.dataset.p); pressed = img; }
});
const release = () => { if (pressed) { pressed.src = src(pressed.dataset.n); pressed = null; } };
window.addEventListener('pointerup', release); window.addEventListener('pointercancel', release);

// modalità modifica: cattura il clic prima della navigazione
screenEl.addEventListener('click', (e) => {
  if (!S.edit) return;
  e.preventDefault(); e.stopPropagation();
  const k = e.target.closest('[data-k]');
  if (k) { openStringDialog(k.dataset.k, k); return; }
  // se il clic cade su un contenitore vuoto, prendi l'immagine sottostante (es. lo sfondo)
  const im = e.target.closest('[data-img]') || document.elementsFromPoint(e.clientX, e.clientY).find((el) => el.dataset && el.dataset.img && screenEl.contains(el));
  if (im) openImageDialog(im.dataset.img);
}, true);

screenEl.addEventListener('click', (e) => {
  if (S.edit) return;
  if (dragInfo && dragInfo.moved) return;
  const sc = S.screen;
  if (sc.name === 'reverse') { back(); return; }
  const card = e.target.closest('[data-card]');
  if (card) { const [name, arg] = HOME_CARDS[+card.dataset.card][2]; go(name, arg); return; }
  const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
  const sw = e.target.closest('[data-sw]');
  if (sw) { const id = sw.dataset.sw; if (id === 'autoBright') S.autoBright = !S.autoBright; else S.sw[id] = !S.sw[id]; savePrefs(); render(); return; }
  const a = e.target.closest('[data-act]'); if (!a) return;
  const v = a.dataset.v;
  switch (a.dataset.act) {
    case 'back': back(); break;
    case 'home': home(); break;
    case 'toast': toast(v); break;
    case 'popok': S.popup = null; render(); break;
    case 'bttab': S.screen.tab = v; render(); break;
    case 'rec': S.screen.rec = v; render(); break;
    case 'dial': if (S.dial.length < 16) S.dial += v; render(); break;
    case 'dialdel': S.dial = S.dial.slice(0, -1); render(); break;
    case 'call': if (S.dial) { S.call = { num: S.dial, start: 0 }; render(); setTimeout(() => { if (S.call && !S.call.start) { S.call.start = Date.now(); render(); } }, 3000); } break;
    case 'callnum': S.call = { num: '+39 ' + v, name: a.querySelector('span') && a.querySelector('span').textContent, start: 0 }; render(); setTimeout(() => { if (S.call && !S.call.start) { S.call.start = Date.now(); render(); } }, 3000); break;
    case 'hang': S.call = null; render(); break;
    case 'btplay': S.music.playing = !S.music.playing; render(); break;
    case 'play': S.music.playing = !S.music.playing; render(); break;
    case 'prev': S.music.idx = (S.music.idx + SAMPLE_TRACKS.length - 1) % SAMPLE_TRACKS.length; S.music.pos = 0; render(); break;
    case 'next': nextTrack(); break;
    case 'shuffle': S.music.shuffle = !S.music.shuffle; render(); break;
    case 'mlist': S.music.list = true; render(); break;
    case 'pick': S.music.idx = +v; S.music.pos = 0; S.music.playing = true; S.music.list = false; render(); break;
    case 'seek': { const r = a.getBoundingClientRect(); S.music.pos = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * SAMPLE_TRACKS[S.music.idx].d; render(); break; }
    case 'settab': S.screen.tab = v; S.screen.pin = ''; render(); break;
    case 'sub': S.screen.sub = v; render(); break;
    case 'lang': S.lang = v; savePrefs(); render(); renderPane(); break;
    case 'h24': S.hour24 = v === '1'; savePrefs(); render(); break;
    case 'dt': { const [id, dd] = v.split(':'); const d = now(); const n = +dd;
      if (id === 'y') d.setFullYear(d.getFullYear() + n); if (id === 'mo') d.setMonth(d.getMonth() + n); if (id === 'd') d.setDate(d.getDate() + n);
      if (id === 'h') d.setHours(d.getHours() + n); if (id === 'mi') d.setMinutes(d.getMinutes() + n);
      S.clockOffset = d.getTime() - Date.now(); render(); break; }
    case 'eqstyle': { S.eq.style = +v; const pre = [[10, 10, 10], [13, 9, 13], [12, 11, 14], [13, 12, 11], [S.eq.bass, S.eq.alto, S.eq.high]][+v]; [S.eq.bass, S.eq.alto, S.eq.high] = pre; savePrefs(); render(); break; }
    case 'bgsel': S.bg = v === 'custom' ? 'custom' : +v; savePrefs(); render(); toast('Sfondo applicato: torna alla home per vederlo'); break;
    case 'bgimport': pickFile((img) => { const c = fitCanvas(img, 1920, 720); S.customBg = c.toDataURL('image/png'); S.bg = 'custom'; saveEdits(); savePrefs(); render(); toast('Sfondo personalizzato importato (bg_custom.png)'); }); break;
    case 'reverse': go('reverse'); break;
    case 'reboot': reboot(); break;
    case 'mcu': S.popup = { key: 'mcu_update_error' }; render(); break;
    case 'factoryreset': S.popup = { key: 'reset_remind', buttons: [['confir_text', 'doreset'], ['sys_exit', 'popok']] }; render(); break;
    case 'doreset': S.popup = null; try { localStorage.removeItem('displayauto-prefs'); } catch (er) { /* */ } Object.assign(S, { bg: (CFG.screen_bg | 0) + 1, brightness: CFG.brightness, hour24: !CFG.hour_mode, clockOffset: 0 }); reboot(); toast('Impostazioni del simulatore ripristinate (le tue modifiche restano)'); break;
    case 'pin': { const sc2 = S.screen; if (v === 'del') sc2.pin = (sc2.pin || '').slice(0, -1); else if (v === 'ok') { sc2.pin = ''; S.popup = { text: 'Menu di fabbrica non riprodotto nel simulatore: contiene parametri che possono impedire l’avvio del display.' }; } else if ((sc2.pin || '').length < 8) sc2.pin = (sc2.pin || '') + v; render(); break; }
    default: break;
  }
});
function nextTrack() { const m = S.music; m.idx = m.shuffle ? Math.floor(Math.random() * SAMPLE_TRACKS.length) : (m.idx + 1) % SAMPLE_TRACKS.length; m.pos = 0; render(); }

// slider trascinabili
screenEl.addEventListener('pointerdown', (e) => {
  if (S.edit) return;
  const s = e.target.closest('[data-slider]'); if (!s) return;
  e.preventDefault();
  const id = s.dataset.slider, max = +s.dataset.max;
  const set = (ev) => {
    const r = s.getBoundingClientRect(); const f = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)); const v = Math.round(f * max);
    const [a, b] = id.split('.'); if (b) S[a][b] = v; else S[a] = v;
    const w = parseFloat(s.style.width);
    s.querySelector('.fill').style.width = (v / max) * w + 'px'; s.querySelector('.knob').style.left = (v / max) * w + 'px';
    const out = $(`[data-sval="${id}"]`, screenEl); if (out) out.textContent = a === 'eq' ? `${v - 10 > 0 ? '+' : ''}${v - 10}` : v;
    if (id === 'brightness') { const d = $('#dim'); if (d) d.style.opacity = S.autoBright ? 0 : (1 - v / 100) * 0.75; }
  };
  set(e);
  const mv = (ev) => set(ev);
  const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); if (id.startsWith('eq.')) S.eq.style = 4; savePrefs(); };
  window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
});

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select') || $('.dlg-back')) { if (e.key === 'Escape' && $('.dlg-back')) closeDialog(); return; }
  if (e.key === 'Escape' || e.key === 'Backspace') back();
  if (e.key === 'h' || e.key === 'H') home();
  if (e.key === 'e' || e.key === 'E') toggleEdit();
});

setInterval(() => {
  tickClock();
  const m = S.music;
  if (m.playing) {
    m.pos += 0.5;
    if (m.pos >= SAMPLE_TRACKS[m.idx].d) { m.pos = 0; nextTrack(); }
    else if (S.screen.name === 'music' && !m.list && !S.call) {
      const f = m.pos / SAMPLE_TRACKS[m.idx].d;
      const fl = $('[data-mfill]'); if (fl) fl.style.width = f * 1060 + 'px';
      const kn = $('[data-mknob]'); if (kn) kn.style.left = f * 1060 - 16 + 'px';
      const p = $('[data-mpos]'); if (p) p.textContent = fmtT(m.pos);
    }
  }
  if (S.call && S.call.start) { const el = $('[data-calltime]'); if (el) el.textContent = fmtT((Date.now() - S.call.start) / 1000); }
}, 500);

/* scala dello schermo */
let currentScale = 1;
const vp = $('#viewport');
new ResizeObserver(() => { currentScale = vp.clientWidth / 1920; screenEl.style.transform = `scale(${currentScale})`; }).observe(vp);

/* ------------------------------------------------------------------ modifica */
function toggleEdit() {
  S.edit = !S.edit; screenEl.classList.toggle('editing', S.edit);
  const b = $('#btnEdit'); b.classList.toggle('on', S.edit); b.setAttribute('aria-pressed', S.edit);
  b.textContent = S.edit ? '✎ Modifica attiva: clic su testo o immagine' : '✎ Modifica sullo schermo';
}
$('#btnEdit').addEventListener('click', toggleEdit);
function syncThemeUi() {
  screenEl.classList.toggle('bmw', S.theme);
  $$('#themeSw button').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.theme === 'bmw') === S.theme)));
}
function setTheme(on) { S.theme = on && !!window.THEME; savePrefs(); syncThemeUi(); render(); renderPane(); updateCounts(); }
$('#themeSw').addEventListener('click', (e) => { const b = e.target.closest('[data-theme]'); if (b) setTheme(b.dataset.theme === 'bmw'); });
$('#btnExport').addEventListener('click', () => selectTab('esporta'));

function setString(k, v) {
  const o = S.strOv[S.lang] || (S.strOv[S.lang] = {});
  if (v === tBase(k)) delete o[k]; else o[k] = v;
  if (!Object.keys(o).length) delete S.strOv[S.lang];
  $$(`[data-k="${CSS.escape(k)}"]`, screenEl).forEach((el) => { el.textContent = t(k); el.classList.toggle('changed', o[k] != null); });
  saveEdits();
}
function setImage(p, dataUrl) {
  if (dataUrl) S.imgOv[p] = dataUrl; else delete S.imgOv[p];
  $$(`img[data-img="${CSS.escape(p)}"]`, screenEl).forEach((el) => { el.src = src(p); });
  saveEdits();
  if (curTab === 'immagini') renderPane();
}

let dlgEl = null;
function closeDialog() { if (dlgEl) { dlgEl.remove(); dlgEl = null; } }
function dialog(html) {
  closeDialog();
  dlgEl = document.createElement('div'); dlgEl.className = 'dlg-back';
  dlgEl.innerHTML = `<div class="dlg" role="dialog" aria-modal="true">${html}</div>`;
  dlgEl.addEventListener('click', (e) => { if (e.target === dlgEl) closeDialog(); });
  document.body.append(dlgEl);
  return dlgEl;
}

function openStringDialog(k, anchorEl) {
  const file = LANG_FILES[S.lang];
  const d = dialog(`<h2>Modifica testo</h2>
    <div class="path">res/tr/${esc(file)} → "${esc(k)}"</div>
    <p class="hint">${S.theme && themeStr(k) != null ? `Tema BMW: <b>${esc(themeStr(k))}</b> · ` : ''}Originale del display: <b>${esc(tOrig(k))}</b></p>
    <textarea class="field" id="dlgTxt">${esc(t(k))}</textarea>
    <div class="note" id="dlgWarn" hidden>Il testo è più largo dello spazio disponibile: sul display verrebbe tagliato. Accorcialo.</div>
    <div class="row"><button class="btn primary" type="button" id="dlgOk">Fatto</button><button class="btn" type="button" id="dlgReset">Ripristina originale</button></div>`);
  const ta = $('#dlgTxt', d); ta.focus(); ta.select();
  const check = () => { const el = anchorEl || $(`[data-k="${CSS.escape(k)}"]`, screenEl); $('#dlgWarn', d).hidden = !(el && el.scrollWidth > el.clientWidth + 2); };
  ta.addEventListener('input', () => { setString(k, ta.value.replace(/\n/g, ' ')); check(); syncStrRow(k); });
  $('#dlgOk', d).onclick = closeDialog;
  $('#dlgReset', d).onclick = () => { ta.value = tBase(k); setString(k, ta.value); check(); syncStrRow(k); };
  ta.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); closeDialog(); } });
  check();
}

/* immagini: caricamento, adattamento, ritocco colore */
const loadImg = (url) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
function fitCanvas(img, w, h, mode = 'cover') {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  const s = mode === 'cover' ? Math.max(w / img.width, h / img.height) : mode === 'contain' ? Math.min(w / img.width, h / img.height) : 1;
  const dw = mode === 'stretch' ? w : img.width * s, dh = mode === 'stretch' ? h : img.height * s;
  x.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh); return c;
}
function pickFile(cb) {
  const fp = $('#filepick'); fp.value = '';
  fp.onchange = () => { const f = fp.files[0]; if (!f) return; const r = new FileReader(); r.onload = async () => cb(await loadImg(r.result), f); r.readAsDataURL(f); };
  fp.click();
}
function colorAdjust(srcCanvas, hue, sat, bri) {
  const c = document.createElement('canvas'); c.width = srcCanvas.width; c.height = srcCanvas.height;
  const x = c.getContext('2d'); x.drawImage(srcCanvas, 0, 0);
  if (!hue && sat === 100 && bri === 100) return c;
  const id = x.getImageData(0, 0, c.width, c.height), p = id.data;
  // matrici come i filtri CSS hue-rotate / saturate / brightness
  const a = (hue * Math.PI) / 180, cs = Math.cos(a), sn = Math.sin(a);
  const H = [0.213 + cs * 0.787 - sn * 0.213, 0.715 - cs * 0.715 - sn * 0.715, 0.072 - cs * 0.072 + sn * 0.928,
    0.213 - cs * 0.213 + sn * 0.143, 0.715 + cs * 0.285 + sn * 0.140, 0.072 - cs * 0.072 - sn * 0.283,
    0.213 - cs * 0.213 - sn * 0.787, 0.715 - cs * 0.715 + sn * 0.715, 0.072 + cs * 0.928 + sn * 0.072];
  const s = sat / 100;
  const Sm = [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s];
  const M = Array.from({ length: 9 }, (_, i) => { const r = Math.floor(i / 3), col = i % 3; return Sm[r * 3] * H[col] + Sm[r * 3 + 1] * H[3 + col] + Sm[r * 3 + 2] * H[6 + col]; });
  const b = bri / 100;
  for (let i = 0; i < p.length; i += 4) {
    const r = p[i], g = p[i + 1], bl = p[i + 2];
    p[i] = (M[0] * r + M[1] * g + M[2] * bl) * b; p[i + 1] = (M[3] * r + M[4] * g + M[5] * bl) * b; p[i + 2] = (M[6] * r + M[7] * g + M[8] * bl) * b;
  }
  x.putImageData(id, 0, 0); return c;
}

async function openImageDialog(p) {
  const [w, h] = IMAGES[p] || [0, 0];
  const isDash = p.startsWith('dash/dash_bg');
  const d = dialog(`<h2>Sostituisci immagine</h2>
    <div class="path">res/ui/${esc(p)} · ${w}×${h} px${S.imgOv[p] ? ' · <b style="color:var(--warn)">modificata</b>' : ''}</div>
    <canvas id="dlgCv" width="${w}" height="${h}" style="width:100%;max-width:${Math.min(w, 720)}px"></canvas>
    <div class="note" id="dlgTaint" hidden>Il browser blocca il ritocco colore sull'immagine originale quando il simulatore è aperto come file. Avvialo con <code>avvia.command</code> (server locale) oppure carica prima un'immagine tua.</div>
    <div class="drop" id="dlgDrop" tabindex="0">Trascina qui un'immagine o <u>scegli un file</u> (PNG/JPG). Verrà portata a ${w}×${h} px.</div>
    <div class="row"><span class="hint">Se le proporzioni sono diverse:</span>
      <label><input type="radio" name="fit" value="cover" checked> riempi e ritaglia</label>
      <label><input type="radio" name="fit" value="contain"> adatta senza ritagliare</label>
      <label><input type="radio" name="fit" value="stretch"> deforma</label></div>
    <h3 style="margin:0;font:600 12px var(--f-cond);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim)">Ritocco colore</h3>
    <div class="sliders">
      <label for="dHue">Tonalità</label><input type="range" id="dHue" min="-180" max="180" value="0"><output id="oHue">0°</output>
      <label for="dSat">Saturazione</label><input type="range" id="dSat" min="0" max="200" value="100"><output id="oSat">100%</output>
      <label for="dBri">Luminosità</label><input type="range" id="dBri" min="20" max="180" value="100"><output id="oBri">100%</output>
    </div>
    ${isDash ? '<label><input type="checkbox" id="dGuide" checked> mostra la guida dei quadranti (le lancette vengono disegnate dal sistema in queste due aree)</label>' : ''}
    <div class="row"><button class="btn primary" type="button" id="dOk">Applica</button><button class="btn" type="button" id="dCancel">Annulla</button>
      <button class="btn danger" type="button" id="dReset" ${S.imgOv[p] ? '' : 'disabled'}>Ripristina originale</button></div>`);
  const cv = $('#dlgCv', d), ctx = cv.getContext('2d');
  let base = fitCanvas(await loadImg(src(p)), w, h, 'stretch');
  let upload = null;
  const fitMode = () => d.querySelector('input[name=fit]:checked').value;
  const build = () => {
    if (upload) base = fitCanvas(upload, w, h, fitMode());
    let out;
    try { out = colorAdjust(base, +$('#dHue', d).value, +$('#dSat', d).value, +$('#dBri', d).value); }
    catch (er) { out = base; $('#dlgTaint', d).hidden = false; }
    ctx.clearRect(0, 0, w, h); ctx.drawImage(out, 0, 0);
    $('#oHue', d).textContent = $('#dHue', d).value + '°'; $('#oSat', d).textContent = $('#dSat', d).value + '%'; $('#oBri', d).textContent = $('#dBri', d).value + '%';
    if (isDash && $('#dGuide', d).checked) drawGuide(ctx);
    return out;
  };
  let pending = 0; const rebuild = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(build); };
  build();
  ['dHue', 'dSat', 'dBri', 'dGuide'].forEach((id) => { const el = $('#' + id, d); if (el) el.addEventListener('input', rebuild); });
  d.querySelectorAll('input[name=fit]').forEach((r) => r.addEventListener('change', rebuild));
  const takeFile = (f) => { const r = new FileReader(); r.onload = async () => { upload = await loadImg(r.result); const note = upload.width !== w || upload.height !== h ? ` (era ${upload.width}×${upload.height}, adattata)` : ''; $('#dlgDrop', d).textContent = `Caricata: ${f.name}${note}`; build(); }; r.readAsDataURL(f); };
  const drop = $('#dlgDrop', d);
  drop.onclick = () => { const fp = $('#filepick'); fp.value = ''; fp.onchange = () => fp.files[0] && takeFile(fp.files[0]); fp.click(); };
  drop.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); drop.click(); } };
  drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('over'); };
  drop.ondragleave = () => drop.classList.remove('over');
  drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove('over'); const f = e.dataTransfer.files[0]; if (f) takeFile(f); };
  $('#dCancel', d).onclick = closeDialog;
  $('#dReset', d).onclick = () => { setImage(p, null); closeDialog(); toast('Immagine originale ripristinata'); };
  $('#dOk', d).onclick = () => {
    const hue = +$('#dHue', d).value, sat = +$('#dSat', d).value, bri = +$('#dBri', d).value;
    if (!upload && !hue && sat === 100 && bri === 100) { closeDialog(); return; }
    try {
      const out = colorAdjust(upload ? fitCanvas(upload, w, h, fitMode()) : base, hue, sat, bri);
      setImage(p, out.toDataURL('image/png')); closeDialog(); toast('Immagine aggiornata');
    } catch (er) { $('#dlgTaint', d).hidden = false; }
  };
}

/* ------------------------------------------------------------------ pannello */
let curTab = 'testi', strFilter = '';
function selectTab(tab) { curTab = tab; $$('#tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === tab)); renderPane(); }
$('#tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) selectTab(b.dataset.tab); });

function updateCounts() {
  const nT = Object.values(S.strOv).reduce((a, o) => a + Object.keys(o).length, 0);
  const nI = Object.keys(S.imgOv).length;
  const a = $('#cntTxt'), b = $('#cntImg'); a.hidden = !nT; a.textContent = nT; b.hidden = !nI; b.textContent = nI;
}
function syncStrRow(k) {
  const row = $(`.strrow[data-key="${CSS.escape(k)}"]`); if (!row) return;
  const inp = row.querySelector('input'); if (document.activeElement !== inp) inp.value = t(k);
  const mod = (S.strOv[S.lang] || {})[k] != null; row.classList.toggle('mod', mod);
  row.querySelector('.chip').className = 'chip' + (mod ? ' mod' : ''); row.querySelector('.chip').textContent = mod ? 'modificato' : 'originale';
}

function renderPane() {
  const pane = $('#pane');
  if (curTab === 'testi') {
    const keys = Object.keys(LANGS[S.lang] || LANGS.yi_IT);
    pane.innerHTML = `<p>File attivo: <code>res/tr/${esc(LANG_FILES[S.lang])}</code>. Le modifiche appaiono subito sullo schermo. Cambi lingua da Impostazioni → Lingua.</p>
      <input class="field" id="strSearch" type="search" placeholder="Cerca testo o chiave (es. Veicolo, car_menu)" value="${esc(strFilter)}">
      <div class="row"><label><input type="checkbox" id="onlyMod"> solo modificati</label></div>
      <div class="strlist" id="strList"></div>`;
    const list = $('#strList');
    const draw = () => {
      const q = strFilter.toLowerCase(), only = $('#onlyMod').checked, o = S.strOv[S.lang] || {};
      list.innerHTML = keys.filter((k) => (!q || k.toLowerCase().includes(q) || t(k).toLowerCase().includes(q) || tOrig(k).toLowerCase().includes(q)) && (!only || o[k] != null))
        .map((k) => { const mod = o[k] != null; return `<div class="strrow ${mod ? 'mod' : ''}" data-key="${esc(k)}"><span class="skey">${esc(k)}</span><span class="chip ${mod ? 'mod' : ''}">${mod ? 'modificato' : 'originale'}</span>
          <input class="field" id="s_${esc(k)}" value="${esc(t(k))}" aria-label="${esc(k)}">${mod ? `<span class="orig">prima: ${esc(tBase(k))}</span>` : (themeStr(k) != null ? `<span class="orig">originale del display: ${esc(tOrig(k))}</span>` : '')}</div>`; }).join('') || '<p>Nessun testo trovato.</p>';
    };
    draw();
    $('#strSearch').addEventListener('input', (e) => { strFilter = e.target.value; draw(); });
    $('#onlyMod').addEventListener('change', draw);
    list.addEventListener('input', (e) => { const row = e.target.closest('.strrow'); if (row) { setString(row.dataset.key, e.target.value); syncStrRow(row.dataset.key); } });
    list.addEventListener('focusin', (e) => { const row = e.target.closest('.strrow'); if (!row) return; $$('[data-k]', screenEl).forEach((el) => { el.style.outline = el.dataset.k === row.dataset.key ? '3px solid #ffb547' : ''; }); });
    list.addEventListener('focusout', () => $$('[data-k]', screenEl).forEach((el) => { el.style.outline = ''; }));
  } else if (curTab === 'immagini') {
    const groups = {};
    Object.keys(IMAGES).forEach((p) => { const g = p.split('/')[0]; (groups[g] = groups[g] || []).push(p); });
    const label = { HomePage: 'Icone home (card 410×580)', bg: 'Sfondi home', dash: 'Cruscotto', status: 'Barra di stato', setting: 'Impostazioni', bt: 'Bluetooth', MusicPlayer: 'Musica', media: 'Video', car: 'Veicolo / retrocamera', door: 'Porte' };
    const order = ['HomePage', 'bg', 'dash', 'status', 'setting', 'bt', 'MusicPlayer', 'media', 'car', 'door'];
    pane.innerHTML = `<p>Clicca un'immagine per sostituirla o ritoccarne i colori. Il simulatore la porta sempre alle dimensioni originali, come richiede il display.</p>
      ${order.filter((g) => groups[g]).map((g, i) => `<details class="grp" ${i < 3 ? 'open' : ''}><summary>${label[g] || g} · ${groups[g].length}</summary><div class="imggrid">
        ${groups[g].map((p) => `<button type="button" class="imgcell ${S.imgOv[p] ? 'mod' : ''}" data-p="${esc(p)}"><span class="thumb"><img loading="lazy" src="${src(p)}" alt=""></span><span class="nm">${esc(p.split('/')[1])}</span><span class="dim">${IMAGES[p][0]}×${IMAGES[p][1]}${S.imgOv[p] ? ' · modificata' : ''}</span></button>`).join('')}
      </div></details>`).join('')}`;
    pane.onclick = (e) => { const c = e.target.closest('.imgcell'); if (c) openImageDialog(c.dataset.p); };
  } else {
    pane.onclick = null;
    renderExport(pane);
  }
}

/* ------------------------------------------------------------------ esportazione */
function langJson(lang) {
  // stesso formato del file originale: tab, "chiave":"valore", nessuno spazio, nessun a-capo finale
  const base = LANGS[lang], o = S.strOv[lang] || {};
  return '{\n' + Object.keys(base).map((k) => `\t${JSON.stringify(k)}:${JSON.stringify(o[k] != null ? o[k] : tBase(k, lang))}`).join(',\n') + '\n}';
}
function changedFiles() {
  const files = [];
  const langs = new Set([...Object.keys(S.strOv), ...(S.theme ? Object.keys(THEME.strings) : [])]);
  langs.forEach((lang) => {
    const mine = S.strOv[lang] || {}, th = (S.theme && THEME.strings[lang]) || {};
    const n = Object.keys(mine).length + Object.keys(th).filter((k) => mine[k] == null).length;
    if (n) files.push({ dev: `/res/tr/${LANG_FILES[lang]}`, local: `res/tr/${LANG_FILES[lang]}`, kind: 'txt', lang, n });
  });
  const imgs = new Set([...Object.keys(S.imgOv), ...(S.theme ? Object.keys(THEME.images) : [])]);
  [...imgs].sort().forEach((p) => files.push({ dev: `/res/ui/${p}`, local: `res/ui/${p}`, kind: 'img', p, mine: !!S.imgOv[p] }));
  return files;
}
function installScript(files) {
  const q = (s) => `"${s.replace(/(["\\$`])/g, '\\$1')}"`;
  const lines = [
    '#!/bin/bash',
    '# Installa le personalizzazioni sul display (generato dal Simulatore DisplayAuto).',
    '# 1) Collega il Mac alla WiFi lylink_DBF07ACC   2) bash installa.sh',
    '# Prima di sovrascrivere, ogni file viene salvato dal display in backup_prima_<data>/.',
    'cd "$(dirname "$0")"',
    'ADB="./platform-tools/adb"; [ -x "$ADB" ] || ADB="$(command -v adb)"',
    '[ -n "$ADB" ] || { echo "adb non trovato: copia la cartella platform-tools qui accanto"; exit 1; }',
    'IP=192.168.43.1:5555',
    'STAMP=$(date +%Y%m%d_%H%M%S)',
    'BK="backup_prima_$STAMP"',
    'exec > >(tee "installa_log_$STAMP.txt") 2>&1',
    '"$ADB" kill-server >/dev/null 2>&1',
    '"$ADB" disconnect $IP >/dev/null 2>&1',
    '"$ADB" connect $IP',
    '"$ADB" -s $IP wait-for-device || { echo "Display non raggiungibile"; exit 1; }',
    '',
    'echo "=== 1. backup dei file originali in $BK ==="',
  ];
  [...new Set(files.map((f) => f.local.replace(/\/[^/]+$/, '')))].forEach((dir) => lines.push(`mkdir -p ${q('$BK/' + dir)}`));
  files.forEach((f) => lines.push(`"$ADB" -s $IP pull ${q(f.dev)} ${q('$BK/' + f.local)} || { echo "Backup fallito: ${f.dev}. Interrompo."; exit 1; }`));
  lines.push('', 'echo "=== 2. invio dei file modificati ==="');
  files.forEach((f) => lines.push(`"$ADB" -s $IP push ${q(f.local)} ${q(f.dev)} || { echo "Invio fallito: ${f.dev}. Ripristina con: bash ripristina.sh $BK"; exit 1; }`));
  lines.push('', 'echo "=== 3. verifica ==="');
  files.forEach((f) => lines.push(`"$ADB" -s $IP shell ls -l ${q(f.dev)}`));
  lines.push('"$ADB" -s $IP shell sync >/dev/null 2>&1 || true', '',
    'echo "Fatto. Backup in: $BK"',
    'read -r -p "Riavviare ora il display? [s/N] " R',
    '[ "$R" = "s" ] || [ "$R" = "S" ] && "$ADB" -s $IP reboot',
    'exit 0', '');
  // le variabili $BK nei percorsi devono espandersi: sostituisci la quotatura escapata
  return lines.join('\n').replace(/\\\$BK/g, '$BK');
}
function restoreScript(files) {
  const q = (s) => `"${s.replace(/(["\\$`])/g, '\\$1')}"`;
  return ['#!/bin/bash', '# Rimette sul display i file originali salvati da installa.sh.', '# Uso: bash ripristina.sh backup_prima_AAAAMMGG_HHMMSS', 'cd "$(dirname "$0")"',
    'BK="$1"; [ -d "$BK" ] || { echo "Indica la cartella di backup, es: bash ripristina.sh backup_prima_20261103_220000"; exit 1; }',
    'ADB="./platform-tools/adb"; [ -x "$ADB" ] || ADB="$(command -v adb)"', 'IP=192.168.43.1:5555',
    '"$ADB" connect $IP; "$ADB" -s $IP wait-for-device',
    ...files.map((f) => `"$ADB" -s $IP push "$BK/${f.local.replace(/(["\\$`])/g, '\\$1')}" ${q(f.dev)}`),
    '"$ADB" -s $IP shell sync >/dev/null 2>&1 || true', '"$ADB" -s $IP reboot', ''].join('\n');
}
const readme = (files) => `PERSONALIZZAZIONE DISPLAY — pacchetto generato dal Simulatore DisplayAuto

Contenuto
${files.map((f) => ` - ${f.local}  →  ${f.dev}`).join('\n')}
${S.customBg ? ' - per_chiavetta_USB/bg_custom.png  (sfondo personalizzato: copialo nella radice di una chiavetta USB o SD e importalo da Impostazioni → Sfondo → importazioni)\n' : ''}
Installazione (Mac)
 1. Metti accanto a questi file la cartella platform-tools (con adb), oppure abbi adb nel PATH.
 2. Collega il Mac alla WiFi lylink_DBF07ACC.
 3. Apri il Terminale in questa cartella e lancia:  bash installa.sh
 4. Lo script salva prima gli originali in backup_prima_<data>/ e poi invia i file nuovi.

Tornare indietro
  bash ripristina.sh backup_prima_<data>
  oppure dal display: Sistema → di Fabbrica (ripristino di emergenza).

Non vengono toccati .so, .ftu, data/property o FactoryConfig.
`;
const dataUrlToBytes = (u) => { const b = atob(u.split(',')[1]); const a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; };
function download(name, blob) { const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); }
async function copyText(txt, btn) {
  try { await navigator.clipboard.writeText(txt); toast('Copiato'); } catch (e) { const pre = btn && btn.closest('section') && btn.closest('section').querySelector('.pre'); if (pre) { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } toast('Selezionato: premi ⌘C'); }
}

function renderExport(pane) {
  const files = changedFiles();
  const nT = files.filter((f) => f.kind === 'txt').reduce((a, f) => a + f.n, 0), nI = files.filter((f) => f.kind === 'img').length;
  const script = installScript(files);
  pane.innerHTML = `
    <section style="display:flex;flex-direction:column;gap:10px">
      <h3>Riepilogo</h3>
      ${files.length ? `<p>${S.theme ? '<b>Tema BMW incluso.</b> ' : ''}${nT} testi, ${nI} immagini${S.customBg ? ', 1 sfondo personalizzato' : ''}.</p>
        <details><summary class="hint" style="cursor:pointer">Elenco file (${files.length})</summary><ul class="list">${files.map((f) => `<li><code>${esc(f.dev)}</code>${f.kind === 'txt' ? ` · ${f.n} testi` : ''}${f.mine ? ' · <b>tua modifica</b>' : ''}</li>`).join('')}</ul></details>`
      : `<div class="note">Non hai ancora modificato nulla. Attiva <b>Modifica sullo schermo</b> (tasto E) e clicca su una scritta o su un'immagine, oppure usa le schede Testi e Immagini.</div>`}
      <div class="row">
        <button class="btn primary" type="button" id="exZip" ${files.length || S.customBg ? '' : 'disabled'}>Scarica pacchetto .zip</button>
        <button class="btn" type="button" id="exFiles" ${files.length ? '' : 'disabled'}>Scarica file singoli</button>
      </div>
      <div class="note ok">Il pacchetto contiene i file con i percorsi giusti, <code>installa.sh</code> (fa il backup di ogni file dal display prima di sovrascriverlo), <code>ripristina.sh</code> e un LEGGIMI. Se il download non parte (versione online), apri il simulatore in locale: <code>simulatore/index.html</code>.</div>
    </section>
    ${files.length ? `<section style="display:flex;flex-direction:column;gap:8px">
      <div class="row" style="justify-content:space-between"><h3>installa.sh</h3><button class="btn small" type="button" id="cpScript">Copia</button></div>
      <div class="pre" id="scriptPre">${esc(script)}</div></section>` : ''}
    ${files.some((f) => f.kind === 'txt') ? `<section style="display:flex;flex-direction:column;gap:8px">
      <div class="row" style="justify-content:space-between"><h3>${esc(LANG_FILES[files.find((f) => f.kind === 'txt').lang])}</h3><button class="btn small" type="button" id="cpJson">Copia JSON</button></div>
      <div class="pre">${esc(langJson(files.find((f) => f.kind === 'txt').lang))}</div></section>` : ''}
    <section style="display:flex;flex-direction:column;gap:8px">
      <h3>Gestione modifiche</h3>
      <div class="row"><button class="btn small" type="button" id="exBackup">Salva progetto (.json)</button><button class="btn small" type="button" id="imBackup">Carica progetto</button><button class="btn small danger" type="button" id="clearAll">Annulla tutte le modifiche</button></div>
      <div id="clearConfirm" hidden class="note">Cancello ${nT} testi e ${nI} immagini modificati? <button class="btn small danger" type="button" id="clearYes">Sì, cancella</button> <button class="btn small" type="button" id="clearNo">No</button></div>
      <p class="hint">Le modifiche sono salvate automaticamente in questo browser.</p>
    </section>`;
  const on = (id, fn) => { const el = $('#' + id, pane); if (el) el.onclick = fn; };
  on('cpScript', (e) => copyText(script, e.target));
  on('cpJson', (e) => copyText(langJson(files.find((f) => f.kind === 'txt').lang), e.target));
  on('exZip', async () => {
    if (!window.JSZip) { toast('Libreria zip non caricata (serve internet): uso i file singoli'); exportSingles(files, script); return; }
    const z = new window.JSZip(); const root = z.folder('personalizzazione_display');
    files.forEach((f) => root.file(f.local, f.kind === 'txt' ? langJson(f.lang) : dataUrlToBytes(src(f.p))));
    if (S.customBg) root.file('per_chiavetta_USB/bg_custom.png', dataUrlToBytes(S.customBg));
    root.file('installa.sh', script, { unixPermissions: '755' }); root.file('ripristina.sh', restoreScript(files), { unixPermissions: '755' }); root.file('LEGGIMI.txt', readme(files));
    download('personalizzazione_display.zip', await z.generateAsync({ type: 'blob', platform: 'UNIX' }));
  });
  on('exFiles', () => exportSingles(files, script));
  on('exBackup', () => download('progetto_displayauto.json', new Blob([JSON.stringify({ v: 1, strOv: S.strOv, imgOv: S.imgOv, customBg: S.customBg })], { type: 'application/json' })));
  on('imBackup', () => { const fp = document.createElement('input'); fp.type = 'file'; fp.accept = 'application/json'; fp.onchange = () => { const r = new FileReader(); r.onload = () => { try { const j = JSON.parse(r.result); S.strOv = j.strOv || {}; S.imgOv = j.imgOv || {}; S.customBg = j.customBg || null; saveEdits(); render(); renderPane(); toast('Progetto caricato'); } catch (er) { toast('File non valido: serve un progetto_displayauto.json'); } }; r.readAsText(fp.files[0]); }; fp.click(); });
  on('clearAll', () => { $('#clearConfirm', pane).hidden = false; });
  on('clearNo', () => { $('#clearConfirm', pane).hidden = true; });
  on('clearYes', () => { S.strOv = {}; S.imgOv = {}; S.customBg = null; if (S.bg === 'custom') S.bg = (CFG.screen_bg | 0) + 1; saveEdits(); render(); renderPane(); toast('Modifiche annullate'); });
}
function exportSingles(files, script) {
  files.forEach((f, i) => setTimeout(() => {
    const name = f.local.split('/').pop();
    download(name, f.kind === 'txt' ? new Blob([langJson(f.lang)], { type: 'application/json' }) : new Blob([dataUrlToBytes(src(f.p))], { type: 'image/png' }));
  }, i * 300));
  setTimeout(() => download('installa.sh', new Blob([script], { type: 'text/x-shellscript' })), files.length * 300);
}

/* ------------------------------------------------------------------ avvio */
(async () => {
  loadPrefs();
  await store.open();
  S.strOv = (await store.get('strOv')) || {};
  S.imgOv = (await store.get('imgOv')) || {};
  S.customBg = (await store.get('customBg')) || null;
  if (S.bg === 'custom' && !S.customBg) S.bg = (CFG.screen_bg | 0) + 1;
  if (!window.THEME) S.theme = false;
  syncThemeUi();
  updateCounts(); render(); renderPane();
})();
})();

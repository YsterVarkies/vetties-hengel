/*
 * VETTIES HENGEL HOEKIE: SITE CONTENT
 * Everything the shop might want changed lives in CONFIG below.
 * Check every detail with the owners before the site goes live.
 */
const CONFIG = {
  name: 'Vetties Hengel Hoekie',

  intro: 'Your tackle shop in Cachet Park, Potchefstroom. Lures, reels, rods and bait, plus honest advice from people who fish. Can’t make it in? We ship worldwide.',

  address: ['Premises 14, Cachet Park', 'Cnr Meyer & Steve Biko Street', 'Potchefstroom'],
  // Google Maps link for the shop (used on computers, and for the Google reviews link)
  mapUrl: 'https://maps.app.goo.gl/c7ECoqXXbVafwsJg7',
  // The shop's map pin, so phones can open their own maps app
  // (Apple Maps on iPhone/iPad, the default maps app on Android)
  mapPin: { lat: -26.6925452, lng: 27.0937725 },

  email: 'vettieshengelhoekie@gmail.com',

  // The two flyers list different people (Benjamin is on both).
  // Confirm with the owners who should be listed.
  people: [
    { name: 'Benjamin Bester', phone: '083 797 9240' },
    { name: 'Leon Rusch', phone: '079 505 1913' },
    { name: 'Ruan', phone: '066 235 8177' }
  ],

  // Messages from the "Ask about stock" form and the WhatsApp buttons go here.
  mainWhatsapp: '083 797 9240',

  // Opening hours in 24-hour time. 0 = Sunday, 1 = Monday ... 6 = Saturday.
  // Use null for a day the shop is closed.
  hours: {
    1: ['08:00', '17:00'],
    2: ['08:00', '17:00'],
    3: ['08:00', '17:00'],
    4: ['08:00', '17:00'],
    5: ['08:00', '17:00'],
    6: ['08:00', '15:00'],
    0: ['09:00', '13:00']
  },
  holidayHours: ['08:00', '15:00'],

  // South African public holidays (YYYY-MM-DD), used for the "Open now" badge.
  // Update this once a year from the official list on gov.za.
  publicHolidays: [
    '2026-12-16', '2026-12-25', '2026-12-26',
    '2027-01-01', '2027-03-22', '2027-03-26', '2027-03-29', '2027-04-27',
    '2027-05-01', '2027-06-16', '2027-08-09', '2027-09-24', '2027-12-16',
    '2027-12-25', '2027-12-27'
  ],

  // The green band under the hero (wording from the shop's flyer).
  // "icon" picks the small animated drawing (see ICONS below).
  promises: [
    { icon: 'star', title: 'Excellent service', text: 'Friendly, knowledgeable help every time you walk in.' },
    { icon: 'tag', title: 'Great prices', text: 'Fair prices on the gear you actually use.' },
    { icon: 'chat', title: 'Expert advice', text: 'Ask us what’s working before you head out.' },
    { icon: 'globe', title: 'Worldwide shipping', text: 'Can’t make it in? We’ll send it to you, wherever you are.' }
  ],

  // "What's on the shelves". Confirm these categories with the owners.
  stock: [
    { icon: 'lure', title: 'Lures & soft plastics', text: 'Soft plastics, hard baits and spinners, with a whole wall of colours to choose from.' },
    { icon: 'reel', title: 'Reels', text: 'Spinning and baitcaster reels on display, so you can feel them before you buy.' },
    { icon: 'rod', title: 'Rods', text: 'Rods to match your reel and the way you fish.' },
    { icon: 'dip', title: 'Bait, dips & flavours', text: 'Bait, dips and flavours for your next session at the water.' },
    { icon: 'hook', title: 'Line & terminal tackle', text: 'Line, hooks, sinkers, swivels and everything else for your rig.' },
    { icon: 'box', title: 'Bags, tools & accessories', text: 'Tackle boxes, pliers, nets and the extras that make a fishing day easier.' }
  ],

  // "Inside the shop" photos, in the order they appear. Put the files in the Gallery
  // folder and add a line for each. "alt" describes the photo for people who can't
  // see it; "caption" shows under it. Photos about 1600px wide load quickest.
  // The section hides itself if this list is empty.
  photos: [
    { src: 'Gallery/492673090_122196112658259867_6372040329984194540_n.jpg', caption: 'Carp reels and spare spools on the counter', alt: 'Two black Kaida carp reels with yellow line and spare spools on the wooden counter, with rods, reels and tackle in the shop behind' },
    { src: 'Gallery/476186567_122178850592259867_4507522564021933693_n.jpg', caption: 'The terminal tackle wall', alt: 'A pegboard wall packed with green Monster Carp packs of hooks, rigs, leads, swivels and pop-ups' },
    { src: 'Gallery/484919116_122188657154259867_6208793865318289799_n.jpg', caption: 'Crankbaits, spinnerbaits and line', alt: 'Lure wall with Salmo Hornet crankbaits, Strike King spinnerbaits, Contra fluorocarbon line and LIVETARGET spinner rigs' },
    { src: 'Gallery/506589893_122204838884259867_6448996942374147574_n.jpg', caption: 'Rods and reels, ready to go', alt: 'A rack of rods with blue-spooled reels, with the shop counter and sunglasses stand behind' },
    { src: 'Gallery/508694655_122206088558259867_2831108889442379044_n.jpg', caption: 'SRA dips, flavours and pop-ups', alt: 'Wooden shelves of SRA dips, flavours, sprays and pop-ups under an SRA "Sold here" sign' },
    { src: 'Gallery/480255815_122180180930259867_7609633530443458080_n.jpg', caption: 'Zortex soft plastics', alt: 'Packets of Zortex StealthStick and PowerCraw soft plastics in watermelon and junebug colours' },
    { src: 'Gallery/509622502_122206088954259867_7140408891389425078_n.jpg', caption: 'Baitcasters on the counter', alt: 'Baitcaster reels, including a Sensation Oryx and Okuma reels, on display stands along the counter' },
    { src: 'Gallery/473236432_122174873906259867_6720186470031749591_n.jpg', caption: 'Streamline groundfeed by the stack', alt: 'Stacks of 1.5 kg Streamline Baits groundfeed bags on the shop floor, with green bags behind' },
    { src: 'Gallery/473039497_122174874146259867_2030116333604871152_n.jpg', caption: 'Ready-made rigs', alt: 'Monster Carp ready-made rigs and hook packs hanging on a pegboard' },
    { src: 'Gallery/509268827_122206088378259867_8951571687858508022_n.jpg', caption: 'Dips in every flavour', alt: 'A row of SRA dip jars in anise, banana, garlic and other flavours on a wooden shelf' },
    { src: 'Gallery/473316677_122174874152259867_3347409678200515441_n.jpg', caption: 'Hooks, swivels and rig bits', alt: 'Close-up of Monster Carp hooks, swivels and rig accessories on pegs' },
    { src: 'Gallery/476345189_122178850766259867_2539025455054619140_n.jpg', caption: '1.5 kg groundfeed bags', alt: 'Close-up of Streamline Baits 1.5 kg groundfeed bags' }
  ],

  // "What anglers say": reviews copied by hand from the shop's Google listing
  // (Google Maps > Reviews). googleRating is the total Google shows there; update
  // it when new reviews come in. A review without "text" is a star rating only;
  // those are listed by name underneath. The section hides itself if this is empty.
  googleRating: { stars: 5.0, count: 7 },
  reviews: [
    { name: 'Antoinette H.', stars: 5, text: 'Fantastic service! The gentleman was so kind and helpful towards my son. My son was there to purchase a new fishing rod. The store manager was helpful, knowledgeable, kind and treated my son very well!' },
    { name: 'Hannes P.', stars: 5, text: 'Very helpful and friendly people! Great service' },
    { name: 'Kyle E.', stars: 5, text: 'Very friendly, helpful and awesome people. Service is 5 stars', note: 'Translated from Afrikaans by Google' },
    { name: 'Wihan A.', stars: 5 },
    { name: 'Henco S.', stars: 5 },
    { name: 'Shaun B.', stars: 5 }
  ]
};

/* ---------------------------------------------------------
   Helpers
   --------------------------------------------------------- */
const $ = (id) => document.getElementById(id);

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// '083 797 9240' -> '27837979240' (international format for WhatsApp and tel: links)
function toIntl(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? '27' + digits.slice(1) : digits;
}

function whatsappLink(phone, message) {
  const base = 'https://wa.me/' + toIntl(phone);
  return message ? base + '?text=' + encodeURIComponent(message) : base;
}

// Opens the visitor's own maps app: Apple Maps on iPhone/iPad, the default
// maps app on Android (geo: lets them pick Google Maps, Waze, etc.), and
// Google Maps in a new tab on computers.
function mapLink() {
  const { lat, lng } = CONFIG.mapPin;
  const ua = navigator.userAgent;
  const isApple = /iPhone|iPad|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1); // iPadOS
  if (isApple) {
    return 'https://maps.apple.com/?ll=' + lat + ',' + lng + '&q=' + encodeURIComponent(CONFIG.name);
  }
  if (/Android/.test(ua)) {
    return 'geo:' + lat + ',' + lng + '?q=' + lat + ',' + lng + '(' + encodeURIComponent(CONFIG.name) + ')';
  }
  return CONFIG.mapUrl;
}

/* ---------------------------------------------------------
   Icons
   Small drawings for the shelf items and the green band.
   Parts with class "anim" are the bits that move (see style.css).
   --------------------------------------------------------- */
const ICONS = {
  // Shelf items
  lure: `<svg viewBox="0 0 64 64"><path d="M6 32C14 21 34 21 46 32C34 43 14 43 6 32Z"/><g class="a-tail anim"><path d="M46 32 58 22v20Z"/></g><path d="M19 26c2 4 2 8 0 12"/><circle cx="14" cy="30" r="1.6" fill="currentColor" stroke="none"/><path d="M28 40v7a3 3 0 0 0 6 0"/></svg>`,
  reel: `<svg viewBox="0 0 64 64"><circle cx="32" cy="36" r="17"/><circle cx="32" cy="36" r="4"/><g class="a-spin anim"><path d="M32 29v-6M32 43v6M25 36h-6M39 36h6"/></g><path d="M32 19V9M25 9h14"/><path d="M49 36h9"/><circle cx="60" cy="36" r="2.4" fill="currentColor" stroke="none"/></svg>`,
  rod: `<svg viewBox="0 0 64 64"><g class="a-rod anim"><path d="M10 56 22 44" stroke-width="5"/><path d="M22 44C34 32 46 22 56 8"/><circle cx="32" cy="35" r="1.4" fill="currentColor" stroke="none"/><circle cx="44" cy="23" r="1.4" fill="currentColor" stroke="none"/><path d="M56 8C60 24 56 38 52 50V54a3 3 0 0 1-6 0"/></g></svg>`,
  dip: `<svg viewBox="0 0 64 64"><g class="a-bottle anim"><path d="M22 26h20v28a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4Z"/><path d="M27 26v-7h10v7"/><path d="M25 19v-6h14v6Z"/><path d="M22 40h20M22 47h20"/></g><circle class="a-drop anim" cx="13" cy="24" r="2" fill="currentColor" stroke="none"/><circle class="a-drop a-drop-b anim" cx="9" cy="28" r="2" fill="currentColor" stroke="none"/></svg>`,
  hook: `<svg viewBox="0 0 64 64"><g class="a-swing anim"><path d="M32 2v8"/><circle cx="32" cy="14" r="4"/><path d="M32 18v26a12 12 0 0 1-24 0v-8l7 8"/></g></svg>`,
  box:  `<svg viewBox="0 0 64 64"><path d="M6 30h52v24a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z"/><path d="M6 42h52M22 42v14M42 42v14"/><g class="a-lid anim"><path d="M6 30v-8a2 2 0 0 1 2-2h48a2 2 0 0 1 2 2v8"/><path d="M24 20v-6h16v6"/><path d="M32 30v-4"/></g></svg>`,

  // Green band
  star:  `<svg viewBox="0 0 64 64"><path class="a-star anim" d="M32 5 39 24 59 25 43 38 49 58 32 47 15 58 21 38 5 25 25 24Z"/></svg>`,
  tag:   `<svg viewBox="0 0 64 64"><g class="a-tag anim"><path d="M8 8h22l26 26-22 22L8 30Z"/><circle cx="19" cy="19" r="3"/></g></svg>`,
  chat:  `<svg viewBox="0 0 64 64"><path d="M10 10h44a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H30L18 52V40h-8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z"/><circle class="a-dot anim" cx="22" cy="25" r="2.2" fill="currentColor" stroke="none"/><circle class="a-dot a-dot-b anim" cx="32" cy="25" r="2.2" fill="currentColor" stroke="none"/><circle class="a-dot a-dot-c anim" cx="42" cy="25" r="2.2" fill="currentColor" stroke="none"/></svg>`,
  globe: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24"/><path d="M8 32h48"/><path d="M13 20c12 5 26 5 38 0M13 44c12-5 26-5 38 0"/><ellipse class="a-meridian anim" cx="32" cy="32" rx="11" ry="24"/></svg>`
};

// True when the visitor has asked their device for less motion.
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// True once scene3d.js has taken over the hero (it then draws its own fish and ripples).
const hero3d = () => document.documentElement.classList.contains('hero-3d');

/* ---------------------------------------------------------
   Opening hours and the "Open now" badge
   Times are worked out in South African time, wherever the
   visitor happens to be.
   --------------------------------------------------------- */
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first

function shopNow() {
  const parts = {};
  new Intl.DateTimeFormat('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date()).forEach((p) => { parts[p.type] = p.value; });

  return {
    date: parts.year + '-' + parts.month + '-' + parts.day,
    minutes: Number(parts.hour) * 60 + Number(parts.minute)
  };
}

function addDays(isoDate, n) {
  const d = new Date(isoDate + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const weekdayOf = (isoDate) => new Date(isoDate + 'T00:00:00Z').getUTCDay();
const isHoliday = (isoDate) => CONFIG.publicHolidays.includes(isoDate);
const toMinutes = (time) => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };
const formatRange = (h) => (h ? h[0] + '–' + h[1] : 'Closed');

function hoursFor(isoDate) {
  return isHoliday(isoDate) ? CONFIG.holidayHours : CONFIG.hours[weekdayOf(isoDate)];
}

function openStatus() {
  const now = shopNow();
  const today = hoursFor(now.date);

  if (today) {
    if (now.minutes >= toMinutes(today[0]) && now.minutes < toMinutes(today[1])) {
      return { open: true, text: 'Open now, closes at ' + today[1] };
    }
    if (now.minutes < toMinutes(today[0])) {
      return { open: false, text: 'Closed, opens today at ' + today[0] };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const date = addDays(now.date, i);
    const h = hoursFor(date);
    if (h) {
      const when = i === 1 ? 'tomorrow' : DAY_NAMES[weekdayOf(date)];
      return { open: false, text: 'Closed, opens ' + when + ' at ' + h[0] };
    }
  }
  return { open: false, text: 'Closed' };
}

function renderStatus() {
  const status = openStatus();
  $('status-text').textContent = status.text;
  $('status').classList.toggle('is-open', status.open);
  $('status').hidden = false;
}

function renderHours() {
  const now = shopNow();
  const todayNumber = weekdayOf(now.date);
  const body = $('hours-body');
  body.innerHTML = '';

  WEEK_ORDER.forEach((day) => {
    const row = make('tr');
    const label = make('th', '', DAY_NAMES[day]);
    label.scope = 'row';
    let times = CONFIG.hours[day];

    if (day === todayNumber) {
      row.className = 'is-today';
      const holidayToday = isHoliday(now.date);
      if (holidayToday) times = CONFIG.holidayHours;
      label.append(make('span', 'today-tag', holidayToday ? 'Today, public holiday' : 'Today'));
    }

    row.append(label, make('td', '', formatRange(times)));
    body.append(row);
  });

  $('hours-note').textContent = 'Public holidays: ' + formatRange(CONFIG.holidayHours);
}

/* ---------------------------------------------------------
   Page content
   --------------------------------------------------------- */
function renderList(items, listId, iconClass) {
  const list = $(listId);
  items.forEach((item, index) => {
    const li = make('li');
    li.style.setProperty('--seen-delay', (index % 3) * 0.15 + 's');

    if (item.icon && ICONS[item.icon]) {
      const holder = make('span', iconClass);
      holder.setAttribute('aria-hidden', 'true');
      holder.dataset.icon = item.icon; // scene3d.js uses this to pick the 3D model
      holder.innerHTML = ICONS[item.icon]; // our own drawings from ICONS above
      li.append(holder);
    }

    li.append(make('h3', '', item.title), make('p', '', item.text));
    list.append(li);
  });
}

/* ---------------------------------------------------------
   "Inside the shop" gallery: one big photo, with the next one
   peeking out on the right (and the previous one on the left,
   once you've moved on). It goes round in a loop: after the
   last photo comes the first again. Arrows, a tap on a peeking
   photo, a swipe or the arrow keys move between them.
   --------------------------------------------------------- */
function setupGallery() {
  const photos = CONFIG.photos;
  const count = photos.length;
  if (!count) {
    $('nav-gallery').hidden = true;
    return;
  }

  const box = $('gallery-box');
  const stage = $('gallery-stage');
  const prev = $('gallery-prev');
  const next = $('gallery-next');
  let current = 0;
  let moved = false; // until the visitor moves on, nothing peeks out on the left
  let nearScreen = false;

  // Where photo i sits, counting round the loop from the one showing:
  // 0 is the big one, 1 peeks out on the right, -1 on the left.
  function placeOf(i) {
    const ahead = (i - current + count) % count;
    const offset = ahead > count / 2 ? ahead - count : ahead;
    const hidden = Math.abs(offset) > 1 || (offset < 0 && (!moved || count < 3));
    return { offset, hidden };
  }

  const slides = photos.map((photo, i) => {
    const slide = make('figure', 'gallery-slide');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', (i + 1) + ' of ' + photos.length);
    const img = make('img');
    img.alt = photo.alt || 'Inside ' + CONFIG.name + ', photo ' + (i + 1) + ' of ' + photos.length;
    img.decoding = 'async';
    img.draggable = false;
    img.addEventListener('load', layout); // now we know its real shape
    slide.append(img);
    stage.insertBefore(slide, prev);
    return { slide, img, src: photo.src };
  });

  // Each photo keeps its own shape. The big one is as large as fits; the
  // peeking ones are smaller, tilted, and placed so the same amount shows.
  function layout() {
    const width = stage.clientWidth;
    if (!width) return;
    const phone = width < 560;
    const maxW = width * (phone ? 0.8 : 0.62);
    const maxH = Math.min(width * (phone ? 0.85 : 0.47), window.innerHeight * 0.7);
    const peek = width * (phone ? 0.11 : 0.17);
    stage.style.height = Math.round(maxH) + 'px';

    const sizes = slides.map(({ img }) => {
      const ratio = img.naturalWidth ? img.naturalWidth / img.naturalHeight : 4 / 3;
      const w = Math.min(maxW, maxH * ratio);
      return { w, h: w / ratio };
    });
    // The peeking photos and arrows line up with the big photo's box, not the
    // photo itself, so they stay put whatever shape the photo is
    const edge = maxW / 2;

    slides.forEach(({ slide }, i) => {
      const { offset, hidden } = placeOf(i);
      const side = Math.sign(offset);
      const scale = offset === 0 ? 1 : hidden ? 0.7 : 0.8;
      const x = offset === 0 ? 0 : side * (edge + peek * (hidden ? 1.6 : 1) - sizes[i].w * scale / 2);
      slide.style.width = sizes[i].w.toFixed(1) + 'px';
      slide.style.height = sizes[i].h.toFixed(1) + 'px';
      slide.style.setProperty('--x', x.toFixed(1) + 'px');
      slide.style.setProperty('--turn', side * (hidden ? 9 : 5) + 'deg');
      slide.style.setProperty('--scale', scale);
    });

    // The arrows sit over the peeking photos, kept clear of the fishing line
    // that hangs down the right edge of the screen
    const arrow = Math.min(edge + Math.min(peek / 2, 64), window.innerWidth / 2 - 70);
    prev.style.setProperty('--x', (-arrow).toFixed(1) + 'px');
    next.style.setProperty('--x', arrow.toFixed(1) + 'px');
  }

  function show(index, announce) {
    current = ((index % count) + count) % count; // past the last photo comes the first, and back
    slides.forEach(({ slide, img, src }, i) => {
      const { offset, hidden } = placeOf(i);
      slide.className = 'gallery-slide ' + (offset === 0 ? 'is-current'
        : hidden ? 'is-far'
        : offset > 0 ? 'is-near is-next' : 'is-near is-prev');
      if (offset === 0) slide.removeAttribute('aria-hidden');
      else slide.setAttribute('aria-hidden', 'true');
      // Only load photos close to the one showing
      const soon = Math.abs(offset) <= 2 && (offset >= 0 || moved);
      if (nearScreen && soon && !img.getAttribute('src')) img.src = src;
    });

    prev.hidden = !moved || count < 3;
    next.hidden = count < 2;

    $('gallery-count').textContent = (current + 1) + ' / ' + count;
    $('gallery-caption').textContent = photos[current].caption || '';
    if (announce) {
      $('gallery-live').textContent = 'Photo ' + (current + 1) + ' of ' + count
        + (photos[current].caption ? ': ' + photos[current].caption : '');
    }
    layout();
  }

  // One step forward (1) or back (-1)
  function go(step) {
    if (step < 0 && prev.hidden) return; // nothing to go back to yet
    moved = true;
    show(current + step, true);
  }

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  box.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
  });

  // Swipe sideways to move; tap a peeking photo to bring it forward
  let downX = null;
  let downY = 0;
  stage.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.gallery-arrow')) return; // the arrows handle their own clicks
    downX = event.clientX;
    downY = event.clientY;
  });
  stage.addEventListener('pointercancel', () => { downX = null; });
  stage.addEventListener('pointerup', (event) => {
    if (downX === null) return;
    const dx = event.clientX - downX;
    const dy = event.clientY - downY;
    downX = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
      return;
    }
    const tapped = slides.findIndex(({ slide }) => slide.contains(event.target));
    if (tapped < 0) return;
    const { offset, hidden } = placeOf(tapped);
    if (!hidden && offset !== 0) go(offset);
  });

  window.addEventListener('resize', layout);
  $('gallery').hidden = false;

  // Start loading the first photos when the gallery gets close to the screen
  const startLoading = () => { nearScreen = true; show(current); };
  if ('IntersectionObserver' in window) {
    const watcher = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { watcher.disconnect(); startLoading(); }
    }, { rootMargin: '800px 0px' });
    watcher.observe(box);
  } else {
    nearScreen = true;
  }

  stage.classList.add('is-still'); // place the photos without animating them
  show(0);
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('is-still')));
}

/* ---------------------------------------------------------
   Reviews ("What anglers say")
   --------------------------------------------------------- */
const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.8 5.9 6.5.8-4.8 4.5 1.2 6.4L12 17.1l-5.7 3.1 1.2-6.4-4.8-4.5 6.5-.8z"/></svg>';

// Colours for the initial circles (we don't copy reviewers' Google photos)
const AVATAR_COLOURS = ['#2f8a07', '#1f6f5c', '#56731f', '#2c5e7a', '#7a5a1f', '#5e3f7a'];

function starsFor(count, className) {
  const box = make('span', 'stars' + (className ? ' ' + className : ''));
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', count + ' out of 5 stars');
  for (let i = 0; i < 5; i++) {
    const star = make('span', i < count ? 'star' : 'star is-empty');
    star.style.setProperty('--i', i);
    star.innerHTML = STAR; // our own drawing
    box.append(star);
  }
  return box;
}

function avatarFor(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const avatar = make('span', 'avatar', name.trim().charAt(0).toUpperCase());
  avatar.style.background = AVATAR_COLOURS[hash % AVATAR_COLOURS.length];
  avatar.setAttribute('aria-hidden', 'true');
  return avatar;
}

function renderReviews() {
  if (!CONFIG.reviews.length) {
    $('nav-reviews').hidden = true;
    return;
  }

  // Overall rating, linking to the reviews on Google Maps
  const rating = CONFIG.googleRating;
  const summary = $('rating-summary');
  summary.href = CONFIG.mapUrl;
  summary.target = '_blank';
  summary.rel = 'noopener';
  summary.setAttribute('aria-label', 'Rated ' + rating.stars.toFixed(1) + ' out of 5 from ' + rating.count + ' Google reviews. See them on Google Maps');
  summary.append(
    make('span', 'rating-number', rating.stars.toFixed(1)),
    starsFor(Math.round(rating.stars)),
    make('span', 'rating-link', rating.count + ' reviews on Google')
  );

  // Reviews with words
  CONFIG.reviews.filter((review) => review.text).forEach((review, index) => {
    const li = make('li', 'review');
    li.style.setProperty('--seen-delay', (index % 3) * 0.15 + 's');
    const figure = make('figure');
    const quote = make('blockquote');
    quote.append(make('p', '', review.text));
    figure.append(starsFor(review.stars), quote);
    if (review.note) figure.append(make('p', 'review-note', review.note));

    const by = make('figcaption');
    const who = make('span');
    who.append(make('span', 'review-name', review.name), make('span', 'review-source', 'Google review'));
    by.append(avatarFor(review.name), who);
    figure.append(by);
    li.append(figure);
    $('review-list').append(li);
  });

  // Star ratings without words
  const ratingsOnly = CONFIG.reviews.filter((review) => !review.text);
  ratingsOnly.forEach((review) => {
    const li = make('li');
    li.append(avatarFor(review.name), make('span', 'review-name', review.name), starsFor(review.stars, 'stars-small'));
    $('rated-list').append(li);
  });
  $('also-rated').hidden = !ratingsOnly.length;
  $('reviews').hidden = false;
}

function renderContact() {
  // Address, with a line break between each part
  const address = $('address');
  CONFIG.address.forEach((line, i) => {
    if (i > 0) address.append(make('br'));
    address.append(line);
  });
  $('footer-address').textContent = CONFIG.address.join(', ');

  // People: call and WhatsApp links for each
  CONFIG.people.forEach((person) => {
    const li = make('li');
    const links = make('span', 'person-links');

    const call = make('a', '', person.phone);
    call.href = 'tel:+' + toIntl(person.phone);
    call.setAttribute('aria-label', 'Call ' + person.name + ' on ' + person.phone);

    const chat = make('a', '', 'WhatsApp');
    chat.href = whatsappLink(person.phone);
    chat.target = '_blank';
    chat.rel = 'noopener';
    chat.setAttribute('aria-label', 'WhatsApp ' + person.name);

    links.append(call, chat);
    li.append(make('span', 'person-name', person.name), links);
    $('people').append(li);
  });

  const email = $('email-link');
  email.href = 'mailto:' + CONFIG.email;
  email.textContent = CONFIG.email;

  // WhatsApp buttons in the header and hero
  ['header-whatsapp', 'hero-whatsapp'].forEach((id) => {
    const link = $(id);
    link.href = whatsappLink(CONFIG.mainWhatsapp, 'Hi Vetties! ');
    link.target = '_blank';
    link.rel = 'noopener';
  });

  // Map buttons
  ['hero-map', 'visit-map'].forEach((id) => {
    const link = $(id);
    link.href = mapLink();
    // geo: links hand off to an app, so don't open an empty tab for them
    if (!link.href.startsWith('http')) link.removeAttribute('target');
  });
}

/* ---------------------------------------------------------
   "Ask about stock" form: builds a WhatsApp message
   --------------------------------------------------------- */
function setupStockForm() {
  const form = $('stock-form');
  const delivery = $('f-delivery');
  const whereField = $('where-field');
  const status = $('form-status');

  delivery.addEventListener('change', () => {
    whereField.hidden = delivery.value !== 'ship';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const required = ['f-name', 'f-item'];
    if (delivery.value === 'ship') required.push('f-where');

    const missing = required.filter((id) => !$(id).value.trim());
    required.forEach((id) => $(id).classList.toggle('invalid', missing.includes(id)));

    if (missing.length) {
      status.textContent = 'Please fill in the highlighted fields.';
      status.className = 'form-status error';
      status.hidden = false;
      $(missing[0]).focus();
      return;
    }

    const name = $('f-name').value.trim();
    const item = $('f-item').value.trim();
    const shipping = delivery.value === 'ship'
      ? 'Please ship it to: ' + $('f-where').value.trim()
      : 'I’d like to collect in store.';

    const message = 'Hi Vetties! My name is ' + name + '.\n\n'
      + 'I’m looking for:\n' + item + '\n\n'
      + shipping;

    status.textContent = 'Opening WhatsApp…';
    status.className = 'form-status';
    status.hidden = false;
    window.location.href = whatsappLink(CONFIG.mainWhatsapp, message);
  });

  ['f-name', 'f-item', 'f-where'].forEach((id) => {
    $(id).addEventListener('input', () => $(id).classList.remove('invalid'));
  });
}

/* ---------------------------------------------------------
   Phone menu (hamburger)
   --------------------------------------------------------- */
function setupMenu() {
  const button = $('menu-toggle');
  const nav = $('main-nav');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  // Close it when a link is tapped, Escape is pressed, or the visitor taps elsewhere
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); button.focus(); }
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !button.contains(event.target)) setOpen(false);
  });
  // Close it if the screen gets wide enough to show the normal menu
  window.addEventListener('resize', () => { if (window.innerWidth > 620) setOpen(false); });
}

/* ---------------------------------------------------------
   Motion: the fishing line, the bass, bubbles and ripples
   --------------------------------------------------------- */

// Fishing line that grows as you scroll, with a hook that swings when you scroll fast.
// The hero bass drifts toward the pointer and rises as you scroll.
function setupMotion() {
  const cast = $('cast');
  const line = $('cast-line');
  const hook = $('cast-hook');
  const fishWrap = $('fish-wrap');
  const hero = document.querySelector('.hero');
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  let lineHeight = window.innerHeight;
  let len = 70;          // how far down the hook hangs (px)
  let angle = 0;         // how far the line is swung (degrees)
  let speed = 0;         // how fast it is swinging
  let lastY = window.scrollY;
  let aimX = 0, aimY = 0, fishX = 0, fishY = 0; // pointer offset for the bass
  let frameId = 0;

  function sizeLine() {
    lineHeight = window.innerHeight;
    line.style.height = lineHeight + 'px';
  }

  function frame() {
    frameId = 0;
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;
    const reach = window.innerWidth < 700 ? 0.42 : 0.66;
    const targetLen = 70 + progress * (window.innerHeight * reach - 70);
    const delta = Math.max(-60, Math.min(60, y - lastY));
    lastY = y;

    if (REDUCED_MOTION) {
      len = targetLen;
    } else {
      len += (targetLen - len) * 0.15;
      // A simple pendulum: scrolling pushes it, a spring pulls it back
      speed += -0.055 * (angle - 2) - 0.085 * speed - delta * 0.012;
      angle += speed;
      if (angle > 14) { angle = 14; speed = 0; }
      if (angle < -1.5) { angle = -1.5; speed = 0; }
    }

    line.style.transform = 'scaleY(' + (len / lineHeight).toFixed(4) + ')';
    hook.style.transform = 'translate(' + (-hook.offsetWidth * 0.7).toFixed(1) + 'px, ' + len.toFixed(1) + 'px)';  // 0.7 = where the stem sits in the drawing
    cast.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)';

    if (hero3d()) {
      fishX = aimX; fishY = aimY; // the 3D fish moves itself
    } else if (!REDUCED_MOTION) {
      fishX += (aimX - fishX) * 0.08;
      fishY += (aimY - fishY) * 0.08;
      const rise = Math.min(Math.max(y, 0), hero.offsetHeight);
      const lift = -rise * 0.22;
      const tilt = -rise * 0.025 + fishX * 0.35;
      fishWrap.style.transform = 'translate3d(' + fishX.toFixed(1) + 'px,' + (fishY + lift).toFixed(1) + 'px,0) rotate(' + tilt.toFixed(2) + 'deg)';
    }

    const moving = Math.abs(targetLen - len) > 0.4
      || Math.abs(angle - 2) > 0.05 || Math.abs(speed) > 0.02
      || Math.abs(aimX - fishX) > 0.2 || Math.abs(aimY - fishY) > 0.2;
    if (moving) frameId = requestAnimationFrame(frame);
  }

  // Only run the animation loop while something is actually moving
  function kick() { if (!frameId) frameId = requestAnimationFrame(frame); }

  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', () => { sizeLine(); kick(); });

  if (finePointer && !REDUCED_MOTION) {
    hero.addEventListener('pointermove', (event) => {
      const box = hero.getBoundingClientRect();
      aimX = ((event.clientX - box.left) / box.width - 0.5) * 36;
      aimY = ((event.clientY - box.top) / box.height - 0.5) * 24;
      kick();
    });
    hero.addEventListener('pointerleave', () => { aimX = 0; aimY = 0; kick(); });
  }

  // Clicking the hook reels the line back to the top of the page
  hook.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  });

  sizeLine();
  kick();
}

// Bubbles that float up behind the hero text
function setupBubbles() {
  const box = $('bubbles');
  if (!box || REDUCED_MOTION) return;
  const count = window.innerWidth < 620 ? 9 : 16;
  for (let i = 0; i < count; i++) {
    const size = 6 + Math.random() * 18;
    const bubble = make('i');
    bubble.style.left = (Math.random() * 100).toFixed(1) + '%';
    bubble.style.width = bubble.style.height = size.toFixed(1) + 'px';
    bubble.style.setProperty('--sway', (Math.random() * 60 - 30).toFixed(0) + 'px');
    bubble.style.animationDuration = (8 + Math.random() * 10).toFixed(1) + 's';
    bubble.style.animationDelay = '-' + (Math.random() * 18).toFixed(1) + 's';
    box.append(bubble);
  }
}

// Click or tap the hero for a water ripple. Click the fish and it leaps.
function setupHeroPlay() {
  const hero = document.querySelector('.hero');
  const fish = $('fish');
  if (!hero || !fish || REDUCED_MOTION) return;

  hero.addEventListener('pointerdown', (event) => {
    if (hero3d() || event.target.closest('a, button')) return;

    const box = hero.getBoundingClientRect();
    const ring = make('span', 'ripple');
    ring.style.left = (event.clientX - box.left) + 'px';
    ring.style.top = (event.clientY - box.top) + 'px';
    hero.append(ring);
    ring.addEventListener('animationend', () => ring.remove());

    if (event.target === fish) {
      fish.classList.remove('leap');
      void fish.offsetWidth; // lets the animation restart if it is clicked twice
      fish.classList.add('leap');
    }
  });
  fish.addEventListener('animationend', (event) => {
    if (event.animationName === 'leap') fish.classList.remove('leap');
  });
}

// Icons play their animation once as they scroll into view (helps on phones, which have no hover).
// The review stars pop in one by one the same way.
function setupSeen() {
  if (REDUCED_MOTION || !('IntersectionObserver' in window)) return;
  $('reviews').classList.add('reviews-anim');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-seen');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stock-list li, .promise-list li, .review, .rating-summary').forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------
   Search engines: tells Google the shop's address and hours
   --------------------------------------------------------- */
function addStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SportingGoodsStore',
    name: CONFIG.name,
    email: CONFIG.email,
    telephone: '+' + toIntl(CONFIG.mainWhatsapp),
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONFIG.address[0] + ', ' + CONFIG.address[1],
      addressLocality: 'Potchefstroom',
      addressRegion: 'North West',
      addressCountry: 'ZA'
    },
    openingHoursSpecification: WEEK_ORDER
      .filter((day) => CONFIG.hours[day])
      .map((day) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAY_NAMES[day],
        opens: CONFIG.hours[day][0],
        closes: CONFIG.hours[day][1]
      }))
  };
  const script = make('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.append(script);
}

/* ---------------------------------------------------------
   Start
   --------------------------------------------------------- */
function init() {
  document.querySelectorAll('[data-bind]').forEach((node) => {
    const value = CONFIG[node.dataset.bind];
    if (typeof value === 'string') node.textContent = value;
  });

  renderList(CONFIG.promises, 'promise-list', 'pico');
  renderList(CONFIG.stock, 'stock-list', 'ico');
  setupGallery();
  renderReviews();
  renderContact();
  renderHours();
  renderStatus();
  setupStockForm();
  setupMenu();
  setupBubbles();
  setupHeroPlay();
  setupSeen();
  setupMotion();
  addStructuredData();

  $('footer-copy').textContent = '© ' + new Date().getFullYear() + ' ' + CONFIG.name;

  // Keep the badge and today's row current if the page stays open
  setInterval(() => { renderStatus(); renderHours(); }, 60 * 1000);
}

init();

/*
 * VETTIES HENGEL HOEKIE: SITE CONTENT
 * Everything the shop might want changed lives in CONFIG below.
 * Check every detail with the owners before the site goes live.
 */
const CONFIG = {
  name: 'Vetties Hengel Hoekie',

  intro: 'Your tackle shop in Cachet Park, Potchefstroom. Lures, reels, rods and bait, plus honest advice from people who fish. Can’t make it in? We ship worldwide.',

  address: ['Premises 14, Cachet Park', 'Cnr Meyer & Steve Biko Street', 'Potchefstroom'],
  // Google Maps link for the shop (Get directions and Open in Google Maps buttons)
  mapUrl: 'https://maps.app.goo.gl/c7ECoqXXbVafwsJg7',

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

  // Shop photos. The gallery stays hidden until you add some, for example:
  // { src: 'assets/shop-1.jpg', alt: 'Wall of soft plastic lures in the shop' }
  photos: []
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

function mapLink() {
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

function renderPhotos() {
  if (!CONFIG.photos.length) return;
  CONFIG.photos.forEach((photo) => {
    const img = make('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = 'lazy';
    $('photos').append(img);
  });
  $('photos-block').hidden = false;
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
  ['hero-map', 'visit-map'].forEach((id) => { $(id).href = mapLink(); });
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

// Icons play their animation once as they scroll into view (helps on phones, which have no hover)
function setupSeen() {
  if (REDUCED_MOTION || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-seen');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stock-list li, .promise-list li').forEach((item) => observer.observe(item));
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
  renderPhotos();
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

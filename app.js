document.documentElement.classList.add('js');

const storeDirectory = typeof STORES !== 'undefined' ? STORES : [];
const storeTones = ['blue', 'teal', 'green', 'gold', 'coral', 'navy'];

const specials = {
  daily: {
    title: 'Fresh Food Run',
    time: 'Units 1-2-6-16-18-19',
    pace: 'Food and grocery',
    copy:
      'Pacific Dried Fruit, Visfabriek, The Farm Fruit and Veg, MilkUp Ice Creamery, Crumble Corner, and Pacific Roadhouse keep the daily food stop moving.',
    price: 'Open',
    heat: 86,
    call: '23',
  },
  services: {
    title: 'Service Lane',
    time: 'Units 4-10-20-24',
    pace: 'Print, labels, phones, travel',
    copy:
      'Pagemasters Graphix, Elysian Labels, Miller\'s Travel & Tours, and The Gadget Shop cover business needs, devices, bookings, and quick repairs.',
    price: 'Active',
    heat: 74,
    call: '23',
  },
  home: {
    title: 'Home Supply Row',
    time: 'Units 3-8-9-12-14-15',
    pace: 'Home, fabric, packaging, baby',
    copy:
      'Curtains On Us, Snyders Packaging, Colorado, Plain Fabrics & Trim, The Nappy Warehouse, and Cozy Collection carry the practical stops.',
    price: 'Trading',
    heat: 79,
    call: '23',
  },
};

const reducedMotion = false;
let lastDirectoryTrigger = null;
let lastStoreTrigger = null;
const prefetchedArtwork = new Set();
const artworkPrefetchQueue = new Map();

const weekOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function normalizeSearch(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function refreshIcons() {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }
}

function artworkPrefetchAllowed() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return true;
  return !connection.saveData && !/(^|-)2g$/.test(connection.effectiveType || '');
}

function prefetchArtwork(url) {
  if (!url || prefetchedArtwork.has(url) || artworkPrefetchQueue.has(url) || !artworkPrefetchAllowed()) return;

  const image = new Image();
  artworkPrefetchQueue.set(url, image);
  image.decoding = 'async';
  image.onload = () => {
    prefetchedArtwork.add(url);
    artworkPrefetchQueue.delete(url);
  };
  image.onerror = () => artworkPrefetchQueue.delete(url);
  image.src = url;
}

function prefetchStoreArtwork(store, { banner = true, hero = true } = {}) {
  if (!store) return;
  if (banner) prefetchArtwork(store.bannerImage || store.logo);
  if (hero) prefetchArtwork(store.heroImage);
}

function scheduleArtworkPrefetch(callback) {
  if (!artworkPrefetchAllowed()) return;
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 1400 });
    return;
  }
  window.setTimeout(callback, 300);
}

function bindStoreArtworkPrefetch(target, store) {
  if (!target || !store) return;
  let warmed = false;
  const warm = () => {
    if (warmed) return;
    warmed = true;
    prefetchStoreArtwork(store);
  };
  target.addEventListener('pointerenter', warm, { once: true, passive: true });
  target.addEventListener('focusin', warm, { once: true });
  target.addEventListener('touchstart', warm, { once: true, passive: true });
}

function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    document.body.classList.toggle('nav-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    toggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    refreshIcons();
  });

  mobileNav.querySelectorAll('a, button').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      toggle.innerHTML = '<i data-lucide="menu"></i>';
      refreshIcons();
    });
  });
}

function initScrollState() {
  const progress = document.getElementById('scroll-progress-bar');
  const header = document.getElementById('site-header');
  const hero = document.getElementById('home');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const links = Array.from(document.querySelectorAll('.desktop-nav a, .quick-dock a[href^="#"]'));

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    if (header && hero) {
      header.classList.toggle('header-condensed', window.scrollY > hero.offsetHeight * 0.72);
    }

    const active = sections
      .slice()
      .reverse()
      .find((section) => section.getBoundingClientRect().top <= 120);
    if (!active) return;

    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${active.id}`);
    });
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initMarketplace() {
  const notice = document.getElementById('marketplace-notice');
  if (!notice) return;

  let timeout;
  document.querySelectorAll('[data-marketplace]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      window.clearTimeout(timeout);
      notice.hidden = false;
      window.requestAnimationFrame(() => notice.classList.add('visible'));
      timeout = window.setTimeout(() => {
        notice.classList.remove('visible');
        window.setTimeout(() => {
          notice.hidden = true;
        }, 180);
      }, 2400);
    });
  });
}

function eventCampaignIsLive(config, now = Date.now()) {
  if (!config?.enabled) return false;

  const startsAt = config.startsAt ? Date.parse(config.startsAt) : null;
  const endsAt = config.endsAt ? Date.parse(config.endsAt) : null;
  const hasStarted = startsAt === null || (!Number.isNaN(startsAt) && now >= startsAt);
  const hasNotEnded = endsAt === null || (!Number.isNaN(endsAt) && now < endsAt);
  return hasStarted && hasNotEnded;
}

function initEventCampaign() {
  const section = document.getElementById('events');
  const config = window.EVENT_CAMPAIGN;
  const eventLinks = document.querySelectorAll('[data-event-link]');
  if (!section) return;

  const previewState = config?.previewEnabled
    ? new URLSearchParams(window.location.search).get('event-preview') || 'active'
    : null;
  const previewTimestamp = previewState === 'active'
    ? Date.parse(config.previewActiveAt)
    : previewState === 'expired'
      ? Date.parse(config.previewExpiredAt)
      : null;
  const now = Number.isFinite(previewTimestamp) ? previewTimestamp : Date.now();
  const isLive = eventCampaignIsLive(config, now);
  document.body.classList.toggle('event-mode', isLive);
  section.hidden = !isLive;
  eventLinks.forEach((link) => {
    link.hidden = !isLive;
  });

  if (!isLive) return;

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element && value) element.textContent = value;
  };

  const setSelectorText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value) element.textContent = value;
  };

  setText('event-campaign-eyebrow', config.eyebrow);
  setText('event-campaign-venue', config.venue);
  setText('event-campaign-date', config.date);
  setText('event-campaign-time', config.time);
  setText('event-campaign-admission', config.admission);
  setText('event-campaign-description', config.description);
  setText('event-campaign-note', config.note);
  setText('event-takeover-venue', config.venue);
  setText('event-takeover-description', config.description);
  setText('event-takeover-date', config.date);
  setText('event-takeover-time', config.time);
  setText('event-takeover-admission', config.admission);

  const takeover = config.takeover || {};
  setSelectorText('.event-takeover-kicker', takeover.heroKicker);
  setSelectorText('.header-context span', takeover.headerLabel);
  setSelectorText('.quick-dock [data-event-link] span', takeover.eventDockLabel);
  setSelectorText('.featured-stores-heading .eyebrow', takeover.featuredEyebrow);
  setSelectorText('#featured-stores-title', takeover.featuredTitle);
  setSelectorText('.today-section .section-heading .eyebrow', takeover.directoryEyebrow);
  setSelectorText('.today-section .section-heading h2', takeover.directoryTitle);
  setSelectorText('.today-section .section-heading > p:last-child', takeover.directoryDescription);
  setSelectorText('.social-section .section-heading .eyebrow', takeover.socialEyebrow);
  setSelectorText('.social-section .section-heading h2', takeover.socialTitle);
  setSelectorText('.visit-copy .eyebrow', takeover.visitEyebrow);
  setSelectorText('.visit-copy h2', takeover.visitTitle);
  setSelectorText('.footer-brand-copy > span', takeover.footerLine);

  const ticker = document.querySelector('.ticker-track');
  if (ticker && Array.isArray(takeover.ticker) && takeover.ticker.length) {
    const messages = [...takeover.ticker, ...takeover.ticker];
    ticker.replaceChildren(...messages.flatMap((message, index) => {
      const span = document.createElement('span');
      span.textContent = message;
      if (index >= takeover.ticker.length) span.setAttribute('aria-hidden', 'true');
      const separator = document.createElement('b');
      if (index >= takeover.ticker.length) separator.setAttribute('aria-hidden', 'true');
      return [span, separator];
    }));
  }

  const title = document.getElementById('event-campaign-title');
  const titleWords = String(config.title || '').trim().split(/\s+/).filter(Boolean);
  if (title && titleWords.length > 0) {
    const midpoint = Math.ceil(titleWords.length / 2);
    const titleLines = titleWords.length === 1
      ? titleWords
      : [titleWords.slice(0, midpoint).join(' '), titleWords.slice(midpoint).join(' ')];
    title.replaceChildren(...titleLines.map((line) => {
      const span = document.createElement('span');
      span.textContent = line;
      return span;
    }));
  }

  const takeoverTitle = document.getElementById('event-takeover-title');
  if (takeoverTitle && titleWords.length > 0) {
    takeoverTitle.replaceChildren(...titleWords.map((word) => {
      const span = document.createElement('span');
      span.textContent = word;
      return span;
    }));
  }

  const artwork = document.getElementById('event-campaign-artwork');
  if (artwork) {
    artwork.src = config.artwork;
    artwork.alt = config.artworkAlt ?? '';
  }

  const mobileArtwork = document.getElementById('event-campaign-artwork-mobile');
  if (mobileArtwork && config.mobileArtwork) mobileArtwork.srcset = config.mobileArtwork;

  const takeoverArtwork = document.getElementById('event-takeover-artwork');
  const takeoverMobileArtwork = document.getElementById('event-takeover-artwork-mobile');
  if (takeoverArtwork && config.artwork) takeoverArtwork.src = config.artwork;
  if (takeoverMobileArtwork && config.mobileArtwork) takeoverMobileArtwork.srcset = config.mobileArtwork;

  const instagramLink = document.getElementById('event-campaign-instagram');
  const directionsLink = document.getElementById('event-campaign-directions');
  if (instagramLink && config.instagramUrl) instagramLink.href = config.instagramUrl;
  if (directionsLink && config.directionsUrl) directionsLink.href = config.directionsUrl;
  const takeoverDirections = document.getElementById('event-takeover-directions');
  if (takeoverDirections && config.directionsUrl) takeoverDirections.href = config.directionsUrl;

  const theme = config.theme || {};
  Object.entries({
    '--event-background': theme.background,
    '--event-ink': theme.ink,
    '--event-accent': theme.accent,
    '--event-secondary': theme.secondary,
    '--event-highlight': theme.highlight,
  }).forEach(([property, value]) => {
    if (value) document.documentElement.style.setProperty(property, value);
  });

  const countdown = document.getElementById('event-countdown');
  const simulatedOffset = Number.isFinite(previewTimestamp) ? previewTimestamp - Date.now() : 0;
  const updateCountdown = () => {
    if (!countdown) return;
    const eventTime = Date.parse(config.eventAt || config.startsAt);
    const effectiveNow = Date.now() + simulatedOffset;
    const remaining = Math.max(0, eventTime - effectiveNow);
    if (remaining === 0) {
      countdown.textContent = 'Event day';
      return;
    }
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    countdown.textContent = days > 0
      ? `${days}d ${hours}h ${minutes}m`
      : `${hours}h ${String(minutes).padStart(2, '0')}m`;
  };
  updateCountdown();
  window.setInterval(updateCountdown, 30000);

  if (previewState && window.location.hash === '#events') {
    document.body.classList.add('event-section-preview');
    window.setTimeout(() => section.scrollIntoView({ block: 'start' }), 80);
  }

  const previewSection = new URLSearchParams(window.location.search).get('preview-section');
  if (previewState && previewSection) {
    document.body.classList.add('preview-section-snapshot');
    document.body.classList.add(`preview-section-${previewSection}`);
    const target = document.getElementById(previewSection);
    if (target) window.setTimeout(() => target.scrollIntoView({ block: 'start' }), 120);
  }

  const boundaries = [config.startsAt, config.endsAt]
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value) && value > now)
    .sort((a, b) => a - b);
  if (boundaries[0]) {
    window.setTimeout(initEventCampaign, Math.min(boundaries[0] - now + 250, 2147483647));
  }
}

function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  items.forEach((item) => observer.observe(item));
}

function initClock() {
  const clock = document.getElementById('live-clock');
  const status = document.getElementById('status-label');
  const routeStamp = document.querySelector('.route-stamp');

  function tick() {
    const trading = getTradingStatus();
    if (clock) clock.textContent = trading.time;
    if (status) status.textContent = trading.label;
    if (routeStamp) routeStamp.textContent = trading.shortLabel;
  }

  tick();
  window.setInterval(tick, 15000);
}

function getCapeTownTime() {
  const formatter = new Intl.DateTimeFormat('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map((part) => [part.type, part.value]));
  return {
    weekday: parts.weekday,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    time: `${parts.hour}:${parts.minute}`,
  };
}

function getTradingStatus() {
  const time = getCapeTownTime();
  const minutes = time.hour * 60 + time.minute;
  const isSunday = time.weekday === 'Sunday';
  const opensAt = 9 * 60;
  const closesAt = isSunday ? 13 * 60 : 18 * 60;
  const closeLabel = isSunday ? '13:00' : '18:00';
  const isOpen = minutes >= opensAt && minutes < closesAt;

  if (isOpen) {
    return {
      time: time.time,
      label: `Open until ${closeLabel}`,
      shortLabel: 'Open today',
    };
  }

  if (minutes < opensAt) {
    return {
      time: time.time,
      label: 'Opens today at 09:00',
      shortLabel: 'Opens 09:00',
    };
  }

  const dayIndex = weekOrder.indexOf(time.weekday);
  const nextDay = weekOrder[(dayIndex + 1) % weekOrder.length];
  return {
    time: time.time,
    label: `Opens ${nextDay} at 09:00`,
    shortLabel: 'Next 09:00',
  };
}

function storeInitials(name) {
  return name
    .replace(/&/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function storeUnitLabel(store) {
  if (!store.unit) return 'Unit TBC';
  return store.unitConfirmed === false ? `Unit ${store.unit} TBC` : `Unit ${store.unit}`;
}

function normalizePhone(phone) {
  return phone ? phone.replace(/[^\d+]/g, '') : '';
}

function websiteUrl(website) {
  if (!website) return '';
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

function applyStoreIdentity(element, store) {
  if (!element || !store) return;
  element.style.setProperty('--store-primary', store.primary);
  element.style.setProperty('--store-accent', store.accent);
  element.style.setProperty('--store-surface', store.surface);
  element.dataset.storeId = store.id;
  element.dataset.logoFit = store.logoFit || 'cover';
  if (store.presentation) {
    element.dataset.presentation = store.presentation;
  } else {
    delete element.dataset.presentation;
  }
}

function createLogo(store, className) {
  const logo = document.createElement('div');
  logo.className = className;
  logo.classList.add(`logo-fit-${store.logoFit || 'cover'}`);
  logo.classList.toggle('on-dark', Boolean(store.logoOnDark));

  const useCampaignBanner = store.presentation === 'campaign'
    && store.bannerImage
    && (className === 'store-logo' || className === 'featured-store-logo');
  const imageSource = useCampaignBanner ? store.bannerImage : store.logo;

  if (imageSource) {
    const image = document.createElement('img');
    image.src = imageSource;
    image.alt = useCampaignBanner ? `${store.name} storefront banner` : `${store.name} logo`;
    image.loading = 'lazy';
    image.decoding = 'async';
    logo.append(image);
  } else {
    const fallback = document.createElement('span');
    fallback.textContent = storeInitials(store.name);
    logo.append(fallback);
  }

  return logo;
}

const featuredStoreStorageKey = 'pbp-featured-stores-v1';
const featuredStoreCount = 3;
const featuredStoreInterval = 9000;

function localDateKey(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function hashFeaturedSeed(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededFeaturedRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function dailyFeaturedOrder(day, stores) {
  const ordered = stores.slice();
  const random = seededFeaturedRandom(hashFeaturedSeed(`pacific-business-park:${day}`));

  for (let index = ordered.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  }

  return ordered;
}

function circularFeaturedGroup(stores, cursor, count) {
  return Array.from({ length: count }, (_, index) => stores[(cursor + index) % stores.length]);
}

function readFeaturedState() {
  try {
    return JSON.parse(window.localStorage.getItem(featuredStoreStorageKey) || 'null');
  } catch (error) {
    return null;
  }
}

function writeFeaturedState(state) {
  try {
    window.localStorage.setItem(featuredStoreStorageKey, JSON.stringify(state));
  } catch (error) {
    // Rotation still works for this visit when browser storage is unavailable.
  }
}

function initFeaturedStores() {
  const grid = document.getElementById('featured-stores-grid');
  const eligibleStores = storeDirectory.filter((store) => store.logo);
  if (!grid || eligibleStores.length === 0) return;

  const count = Math.min(featuredStoreCount, eligibleStores.length);
  let activeDay = '';
  let orderedStores = [];
  let cursor = 0;
  let paused = false;

  function prepareDay(day) {
    const stored = readFeaturedState();
    activeDay = day;
    orderedStores = dailyFeaturedOrder(day, eligibleStores);
    cursor = stored?.day === day && Number.isFinite(stored.nextCursor)
      ? ((stored.nextCursor % orderedStores.length) + orderedStores.length) % orderedStores.length
      : 0;

    if (stored?.day !== day && Array.isArray(stored?.lastIds)) {
      const previous = new Set(stored.lastIds);
      for (let offset = 0; offset < orderedStores.length; offset += 1) {
        const candidate = circularFeaturedGroup(orderedStores, offset, count);
        if (candidate.every((store) => !previous.has(store.id))) {
          cursor = offset;
          break;
        }
      }
    }
  }

  function createFeaturedCard(store, index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'featured-store-card';
    button.style.setProperty('--featured-delay', `${index * 70}ms`);
    button.setAttribute('aria-label', `Open ${store.name} store details`);
    applyStoreIdentity(button, store);

    const copy = document.createElement('span');
    copy.className = 'featured-store-copy';

    const name = document.createElement('strong');
    name.textContent = store.name;

    const meta = document.createElement('small');
    meta.textContent = `${store.category} | ${storeUnitLabel(store)}`;

    copy.append(name, meta);
    button.append(createLogo(store, 'featured-store-logo'), copy);
    bindStoreArtworkPrefetch(button, store);
    button.addEventListener('click', () => openStoreDialog(store.id, button));
    return button;
  }

  function showNextGroup() {
    const day = localDateKey();
    if (day !== activeDay) prepareDay(day);

    const group = circularFeaturedGroup(orderedStores, cursor, count);
    grid.replaceChildren(...group.map(createFeaturedCard));
    cursor = (cursor + count) % orderedStores.length;
    const nextGroup = circularFeaturedGroup(orderedStores, cursor, count);
    scheduleArtworkPrefetch(() => {
      nextGroup.forEach((store) => prefetchStoreArtwork(store, { hero: false }));
    });

    writeFeaturedState({
      day: activeDay,
      nextCursor: cursor,
      lastIds: group.map((store) => store.id),
    });
  }

  grid.addEventListener('pointerenter', () => {
    paused = true;
  });
  grid.addEventListener('pointerleave', () => {
    paused = false;
  });
  grid.addEventListener('focusin', () => {
    paused = true;
  });
  grid.addEventListener('focusout', (event) => {
    if (!grid.contains(event.relatedTarget)) paused = false;
  });

  showNextGroup();
  window.setInterval(() => {
    if (!paused && !document.hidden) showNextGroup();
  }, featuredStoreInterval);
}

function createActionLink(label, href, iconName) {
  const link = document.createElement('a');
  link.href = href;
  link.innerHTML = `<span>${label}</span><i data-lucide="${iconName}"></i>`;

  if (/^https?:\/\//i.test(href)) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  return link;
}

function createStoreBrandStage(store) {
  if (!store.heroImage) return createLogo(store, 'dialog-brand-inner');

  const stage = document.createElement('div');
  stage.className = `dialog-brand-editorial dialog-brand-editorial--${store.id}`;

  const identity = document.createElement('div');
  identity.className = 'dialog-brand-identity';
  identity.append(createLogo(store, 'dialog-brand-logo'));

  const visual = document.createElement('div');
  visual.className = 'dialog-brand-product';

  const image = document.createElement('img');
  image.src = store.heroImage;
  image.alt = `${store.name} ${store.heroCaption || 'product range'}`;
  image.loading = 'eager';
  image.decoding = 'async';
  image.fetchPriority = 'high';

  const scanline = document.createElement('span');
  scanline.className = 'dialog-brand-scanline';
  scanline.setAttribute('aria-hidden', 'true');

  const caption = document.createElement('span');
  caption.className = 'dialog-brand-caption';
  caption.textContent = store.heroCaption || store.category;

  visual.append(image, scanline, caption);
  stage.append(identity, visual);
  return stage;
}

function renderStoreDialogAside(aside, store) {
  aside.replaceChildren();

  const heading = document.createElement('p');
  const highlights = Array.isArray(store.brandHighlights) ? store.brandHighlights : store.solutions;
  if (Array.isArray(highlights) && highlights.length > 0) {
    heading.textContent = store.asideTitle || 'Store highlights';
    aside.append(heading);

    highlights.forEach((solution, index) => {
      const row = document.createElement('span');
      row.className = 'dialog-solution';

      const number = document.createElement('i');
      number.textContent = String(index + 1).padStart(2, '0');

      row.append(number, document.createTextNode(solution));
      aside.append(row);
    });

    const barcode = document.createElement('span');
    barcode.className = 'dialog-brand-barcode';
    barcode.setAttribute('aria-hidden', 'true');
    aside.append(barcode);
    return;
  }

  heading.textContent = 'Colours from the real storefront sign';
  aside.append(heading);

  [store.primary, store.accent].forEach((colour) => {
    const swatch = document.createElement('span');
    const chip = document.createElement('i');
    chip.style.setProperty('--swatch', colour);
    swatch.append(chip, document.createTextNode(colour));
    aside.append(swatch);
  });
}

function openStoreDialog(storeId, trigger = null) {
  const store = storeDirectory.find((item) => item.id === storeId);
  const dialog = document.getElementById('store-dialog');
  if (!store || !dialog) return;

  prefetchStoreArtwork(store);

  lastStoreTrigger = trigger || document.activeElement;

  const brand = document.getElementById('dialog-brand');
  const shell = document.getElementById('store-dialog-shell');
  const category = document.getElementById('dialog-category');
  const name = document.getElementById('dialog-name');
  const campaign = document.getElementById('dialog-campaign');
  const meta = document.getElementById('dialog-meta');
  const hours = document.getElementById('dialog-hours');
  const description = document.getElementById('dialog-description');
  const actions = document.getElementById('dialog-actions');
  const palette = document.getElementById('dialog-palette');

  brand.replaceChildren(createStoreBrandStage(store));
  applyStoreIdentity(dialog, store);
  applyStoreIdentity(shell, store);
  category.textContent = store.brandEyebrow || store.category;
  name.textContent = store.name;
  campaign.textContent = '';
  if (store.id === 'elysian-labels') {
    campaign.append(document.createTextNode('Labels that keep your world '));
    const emphasis = document.createElement('em');
    emphasis.textContent = 'moving.';
    campaign.append(emphasis);
  } else {
    campaign.textContent = store.campaign;
  }

  const metaParts = [storeUnitLabel(store)];
  if (store.unitConfirmed === false) metaParts.push('unit number pending confirmation');
  if (store.phone) metaParts.push(store.phone);
  if (store.website) metaParts.push(store.website);
  meta.textContent = metaParts.join(' | ');
  hours.textContent = store.hours || 'Centre trading hours: Mon-Sat 09:00-18:00 | Sun 09:00-13:00';
  description.textContent = store.description;
  renderStoreDialogAside(palette, store);

  actions.textContent = '';
  if (store.email) actions.append(createActionLink('Request a quote', `mailto:${store.email}`, 'mail'));
  if (store.phone) actions.append(createActionLink('Call store', `tel:${normalizePhone(store.phone)}`, 'phone'));
  if (store.website) actions.append(createActionLink(store.id === 'elysian-labels' ? 'Visit Elysian' : 'Open website', websiteUrl(store.website), 'external-link'));
  actions.append(createActionLink('Directions', 'https://www.google.com/maps/search/?api=1&query=1E+Jakes+Gerwel+Drive,+Cape+Town', 'map-pin'));

  if (dialog.showModal) {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }

  refreshIcons();
}

function closeStoreDialog() {
  const dialog = document.getElementById('store-dialog');
  if (!dialog) return;

  if (dialog.close) {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
  }

  if (lastStoreTrigger?.focus) lastStoreTrigger.focus();
}

function initStoreDialog() {
  const dialog = document.getElementById('store-dialog');
  const close = document.getElementById('dialog-close');
  if (!dialog || !close) return;

  close.addEventListener('click', closeStoreDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeStoreDialog();
  });
  dialog.addEventListener('close', () => {
    if (lastStoreTrigger?.focus) lastStoreTrigger.focus();
  });
}

function initStoreLaunchers() {
  document.querySelectorAll('[data-open-store]').forEach((trigger) => {
    const store = storeDirectory.find((item) => item.id === trigger.dataset.openStore);
    bindStoreArtworkPrefetch(trigger, store);
    trigger.addEventListener('click', () => {
      openStoreDialog(trigger.dataset.openStore, trigger);
    });
  });
}

function renderDirectoryCards() {
  const grid = document.getElementById('directory-grid');
  if (!grid) return [];

  grid.textContent = '';

  return storeDirectory
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((store, index) => {
      const card = document.createElement('article');
      card.className = 'store-card';
      applyStoreIdentity(card, store);
      card.dataset.tone = storeTones[index % storeTones.length];
      card.dataset.name = normalizeSearch(store.name);
      card.dataset.category = store.category;
      card.dataset.letter = normalizeSearch(store.name).slice(0, 1);
      card.dataset.search = normalizeSearch(`${store.name} ${store.category} ${store.description || ''}`);

      const title = document.createElement('h3');
      title.textContent = store.name;

      const meta = document.createElement('small');
      meta.textContent = `${store.category} | ${storeUnitLabel(store)}`;

      const copy = document.createElement('p');
      copy.textContent = store.description;

      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = '<span>View store</span><i data-lucide="arrow-up-right"></i>';
      button.addEventListener('click', () => openStoreDialog(store.id, button));

      card.append(createLogo(store, 'store-logo'), title, meta, copy, button);
      bindStoreArtworkPrefetch(card, store);
      grid.append(card);
      return card;
    });
}

function initDirectory() {
  const drawer = document.getElementById('directory-drawer');
  const panel = drawer?.querySelector('.drawer-panel');
  const search = document.getElementById('store-search');
  const tabs = document.getElementById('category-tabs');
  const alpha = document.getElementById('alpha-filter');
  const results = document.getElementById('directory-results');
  if (!drawer || !panel || !search || !tabs || !alpha || !results) return;

  let activeCategory = 'all';
  let activeLetter = 'all';
  const cards = renderDirectoryCards();
  const categories = [...new Set(storeDirectory.map((store) => store.category))].sort();
  const letters = ['all', ...'abcdefghijklmnopqrstuvwxyz'.split('')];

  tabs.append(...['all', ...categories].map((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'directory-tab';
    button.dataset.category = category;
    button.textContent = category === 'all' ? 'All' : category;
    if (category === 'all') button.classList.add('active');
    return button;
  }));

  alpha.append(...letters.map((letter) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'alpha-btn';
    button.dataset.letter = letter;
    button.textContent = letter === 'all' ? 'All' : letter.toUpperCase();
    if (letter === 'all') button.classList.add('active');
    return button;
  }));

  function applyFilters() {
    const queryTokens = normalizeSearch(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;

    cards.forEach((card) => {
      const matchesSearch = queryTokens.length === 0 || queryTokens.every((token) => card.dataset.search.includes(token));
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesLetter = activeLetter === 'all' || card.dataset.letter === activeLetter;
      const show = matchesSearch && matchesCategory && matchesLetter;
      card.classList.toggle('hidden', !show);
      card.hidden = !show;
      if (show) visible += 1;
    });

    results.textContent = `Showing ${visible} of ${cards.length} stores.`;
  }

  function openDirectory(trigger) {
    lastDirectoryTrigger = trigger || document.activeElement;
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('directory-open');
    window.requestAnimationFrame(() => search.focus());
    applyFilters();
  }

  function closeDirectory() {
    drawer.hidden = true;
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('directory-open');
    if (lastDirectoryTrigger?.focus) lastDirectoryTrigger.focus();
  }

  document.querySelectorAll('[data-open-directory]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openDirectory(trigger);
    });
  });

  drawer.querySelectorAll('[data-close-directory]').forEach((trigger) => {
    trigger.addEventListener('click', closeDirectory);
  });

  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('.directory-tab');
    if (!button) return;
    activeCategory = button.dataset.category;
    tabs.querySelectorAll('.directory-tab').forEach((item) => item.classList.toggle('active', item === button));
    applyFilters();
  });

  alpha.addEventListener('click', (event) => {
    const button = event.target.closest('.alpha-btn');
    if (!button) return;
    activeLetter = button.dataset.letter;
    alpha.querySelectorAll('.alpha-btn').forEach((item) => item.classList.toggle('active', item === button));
    applyFilters();
  });

  search.addEventListener('input', applyFilters);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !drawer.hidden) closeDirectory();
  });

  if (window.location.hash === '#directory-drawer') openDirectory();
  applyFilters();
  refreshIcons();
}

function initSpecials() {
  const buttons = Array.from(document.querySelectorAll('.special-ticket'));
  const title = document.getElementById('special-title');
  const time = document.getElementById('special-time');
  const pace = document.getElementById('special-pace');
  const copy = document.getElementById('special-copy');
  const price = document.getElementById('special-price');
  const heat = document.getElementById('heat-fill');
  const calling = document.getElementById('calling-number');

  function selectSpecial(id) {
    const special = specials[id];
    if (!special) return;

    buttons.forEach((button) => {
      button.classList.toggle('active', button.dataset.special === id);
    });

    title.textContent = special.title;
    time.textContent = special.time;
    pace.textContent = special.pace;
    copy.textContent = special.copy;
    price.textContent = special.price;
    heat.style.width = `${special.heat}%`;
    calling.textContent = special.call;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => selectSpecial(button.dataset.special));
  });
}

function setupCanvas(canvas, draw) {
  if (!canvas) return;
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;

  function resize() {
    const box = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(box.width));
    height = Math.max(1, Math.floor(box.height));
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function frame(time = 0) {
    draw(context, width, height, time);
    if (!reducedMotion) requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  frame();
}

function drawHeroScene(ctx, width, height, time) {
  ctx.clearRect(0, 0, width, height);
  const eventMode = document.body.classList.contains('event-mode');
  const palette = eventMode
    ? ['#003da5', '#0b2f67', '#2f7ec4', '#008f86', '#053b2f', '#c8a35f', '#bd6a43', '#f7f4eb']
    : ['#003da5', '#1976bf', '#009b91', '#2f9d6a', '#c8a35f', '#d86f4a', '#09205a', '#fffdf7'];
  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, eventMode ? '#030812' : '#fffaf0');
  background.addColorStop(0.38, eventMode ? '#061a38' : '#edf7f3');
  background.addColorStop(0.68, eventMode ? '#053f31' : '#dce9f2');
  background.addColorStop(1, eventMode ? '#020308' : '#f7f1e6');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const drift = reducedMotion ? 0 : time * 0.001;
  const px = 0;
  const py = 0;

  ctx.save();
  ctx.translate(px, py);

  ctx.fillStyle = eventMode ? 'rgba(3,8,18,0.7)' : 'rgba(255,253,247,0.46)';
  ctx.fillRect(width * 0.06, height * 0.16, width * 0.88, height * 0.28);

  for (let i = 0; i < 7; i += 1) {
    const x = width * 0.08 + i * width * 0.125;
    const w = width * 0.1;
    const h = height * (0.17 + (i % 3) * 0.018);
    ctx.fillStyle = eventMode
      ? (i % 2 === 0 ? 'rgba(7,91,215,0.28)' : 'rgba(0,167,157,0.24)')
      : (i % 2 === 0 ? 'rgba(0,61,165,0.13)' : 'rgba(0,155,145,0.12)');
    ctx.strokeStyle = eventMode ? 'rgba(183,255,233,0.18)' : 'rgba(0,81,141,0.18)';
    ctx.lineWidth = 1;
    ctx.fillRect(x, height * 0.21, w, h);
    ctx.strokeRect(x, height * 0.21, w, h);
    ctx.fillStyle = palette[i % palette.length];
    ctx.globalAlpha = 0.72;
    ctx.fillRect(x, height * 0.205, w, 5);
    ctx.globalAlpha = 1;
    ctx.fillStyle = eventMode ? 'rgba(255,255,255,0.58)' : 'rgba(9,32,90,0.22)';
    ctx.fillRect(x + 12, height * 0.245, w * 0.54, 5);
    ctx.fillStyle = eventMode ? 'rgba(183,255,233,0.34)' : 'rgba(0,118,111,0.3)';
    ctx.fillRect(x + 12, height * 0.292, w * 0.76, 3);
    ctx.fillRect(x + 12, height * 0.335, w * 0.45, 3);
  }

  for (let i = 0; i < 5; i += 1) {
    const x = width * 0.12 + i * width * 0.17;
    ctx.fillStyle = palette[(i + 2) % palette.length];
    ctx.globalAlpha = 0.36;
    ctx.fillRect(x, height * 0.19, width * 0.13, height * 0.2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = eventMode ? 'rgba(255,255,255,0.54)' : 'rgba(9,32,90,0.18)';
    ctx.fillRect(x + 14, height * 0.22, width * 0.07, 6);
    ctx.fillStyle = eventMode ? 'rgba(183,255,233,0.44)' : 'rgba(0,118,111,0.28)';
    ctx.fillRect(x + 14, height * 0.26, width * 0.09, 4);
    ctx.fillRect(x + 14, height * 0.3, width * 0.06, 4);
  }

  const road = ctx.createLinearGradient(0, height * 0.5, width, height * 0.82);
  road.addColorStop(0, eventMode ? 'rgba(7,91,215,0.34)' : 'rgba(0,61,165,0.16)');
  road.addColorStop(0.55, eventMode ? 'rgba(0,167,157,0.3)' : 'rgba(0,155,145,0.14)');
  road.addColorStop(1, eventMode ? 'rgba(3,8,18,0.78)' : 'rgba(255,253,247,0.62)');
  ctx.fillStyle = road;
  ctx.beginPath();
  ctx.moveTo(width * 0.08, height * 0.54);
  ctx.lineTo(width * 0.9, height * 0.49);
  ctx.lineTo(width, height * 0.72);
  ctx.lineTo(0, height * 0.76);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = eventMode ? 'rgba(216,193,138,0.09)' : 'rgba(0,81,141,0.1)';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.42;
  for (let i = 0; i < 14; i += 1) {
    const x = width * (i / 13);
    ctx.beginPath();
    ctx.moveTo(width * 0.52, height * 0.54);
    ctx.lineTo(x, height * 0.8);
    ctx.stroke();
  }

  for (let i = 0; i < 5; i += 1) {
    const y = height * 0.58 + i * 34;
    ctx.strokeStyle = eventMode
      ? (i % 2 === 0 ? 'rgba(47,126,196,0.1)' : 'rgba(200,163,95,0.08)')
      : (i % 2 === 0 ? 'rgba(0,81,141,0.08)' : 'rgba(200,163,95,0.12)');
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y - 20);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const ticketCount = 8;
  for (let i = 0; i < ticketCount; i += 1) {
    const lane = i % 3;
    const speed = 24 + lane * 7;
    const start = ((drift * speed + i * 130) % (width + 180)) - 120;
    const y = height * 0.13 + lane * 38;
    ctx.fillStyle = palette[(i + lane) % palette.length];
    ctx.globalAlpha = 0.22;
    ctx.fillRect(start, y, 72, 22);
    ctx.globalAlpha = 1;
    ctx.fillStyle = eventMode ? 'rgba(247,244,235,0.34)' : 'rgba(9,32,90,0.24)';
    ctx.fillRect(start + 9, y + 8, 38, 3);
    ctx.fillRect(start + 9, y + 14, 52, 2);
  }

  for (let i = 0; i < 18; i += 1) {
    const x = ((i * 97 + drift * 32) % width) - 30;
    const y = height * 0.78 + Math.sin(drift + i) * 12;
    ctx.fillStyle = i % 4 === 0 ? '#d8c18a' : palette[i % palette.length];
    ctx.globalAlpha = i % 4 === 0 ? 0.42 : 0.16;
    ctx.fillRect(x, y, 38, 2);
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawRoute(ctx, width, height, time) {
  ctx.clearRect(0, 0, width, height);
  const mapBackground = ctx.createLinearGradient(0, 0, width, height);
  mapBackground.addColorStop(0, '#030812');
  mapBackground.addColorStop(0.48, '#061a38');
  mapBackground.addColorStop(1, '#053f31');
  ctx.fillStyle = mapBackground;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(183,255,233,0.16)';
  ctx.lineWidth = 1;
  for (let x = -40; x < width + 60; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + width * 0.26, height);
    ctx.stroke();
  }

  ['#003da5', '#0b2f67', '#008f86', '#053b2f', '#c8a35f', '#bd6a43'].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.16;
    ctx.fillRect(width * (0.08 + index * 0.17), height * (0.1 + (index % 2) * 0.18), width * 0.12, height * 0.18);
  });
  ctx.globalAlpha = 1;

  ctx.strokeStyle = 'rgba(216,193,138,0.48)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(width * 0.08, height * 0.28);
  ctx.bezierCurveTo(width * 0.28, height * 0.44, width * 0.44, height * 0.2, width * 0.7, height * 0.42);
  ctx.stroke();

  ctx.strokeStyle = '#2f7ec4';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(width * 0.12, height * 0.68);
  ctx.bezierCurveTo(width * 0.33, height * 0.36, width * 0.58, height * 0.82, width * 0.82, height * 0.28);
  ctx.stroke();

  ctx.strokeStyle = '#d8c18a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(width * 0.12, height * 0.68);
  ctx.bezierCurveTo(width * 0.33, height * 0.36, width * 0.58, height * 0.82, width * 0.82, height * 0.28);
  ctx.stroke();

  const pulse = reducedMotion ? 0.72 : 0.55 + Math.sin(time * 0.004) * 0.17;
  ctx.fillStyle = '#bd6a43';
  ctx.globalAlpha = pulse;
  ctx.beginPath();
  ctx.arc(width * 0.82, height * 0.28, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.arc(width * 0.82, height * 0.28, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#061a38';
  ctx.beginPath();
  ctx.arc(width * 0.82, height * 0.28, 6, 0, Math.PI * 2);
  ctx.fill();
}

function initCanvases() {
  setupCanvas(document.getElementById('hero-canvas'), drawHeroScene);
}

function cycleCallingNumber() {
  const calling = document.getElementById('calling-number');
  if (calling) calling.textContent = String(storeDirectory.length || 23);
}

document.addEventListener('DOMContentLoaded', () => {
  initEventCampaign();
  refreshIcons();
  initNav();
  initScrollState();
  initReveal();
  initClock();
  initDirectory();
  initStoreDialog();
  initStoreLaunchers();
  initFeaturedStores();
  initSpecials();
  initMarketplace();
  initCanvases();
  cycleCallingNumber();
});

(() => {
  'use strict';

  const scenes = {
    featured: { title: 'The favourites.', intro: 'A little of everything. Find your Roadhouse mood.', label: 'Featured favourites', product: 'product-burger-v1.webp', headline: 'Come hungry.', sceneCopy: 'Make a little room for a lot of flavour.' },
    chicken: { title: 'Golden. Crisp. Ready.', intro: 'Fried chicken favourites, from quick bites to a family box.', label: 'Fried chicken', product: 'product-chicken-v1.webp', headline: 'Bring the crunch.', sceneCopy: 'Golden pieces settle into a scene made for sharing.' },
    wraps: { title: 'Wrapped up right.', intro: 'Fresh fillings, bold sauces, and satisfying crunch.', label: 'Wraps', product: 'product-wraps-v1.webp', headline: 'Roll with it.', sceneCopy: 'Fresh colour and a cut-section reveal.' },
    burgers: { title: 'Built for the bite.', intro: 'Roadhouse burgers stacked with classic flavour.', label: 'Burgers', product: 'product-burger-v1.webp', headline: 'Stacked right.', sceneCopy: 'Big layers. One satisfying centrepiece.' },
    sandwiches: { title: 'Toasted. Loaded.', intro: 'Simple favourites made for an easy stop.', label: 'Sandwiches', product: 'product-sandwiches-v1.webp', headline: 'Toast the moment.', sceneCopy: 'A familiar favourite slides into focus.' },
    pizza: { title: 'Made to share.', intro: 'Six familiar combinations in medium and large.', label: 'Pizza', product: 'product-pizza-v1.webp', headline: 'Turn up hungry.', sceneCopy: 'The whole table starts with one good slice.' },
    drinks: { title: 'Keep it cold.', intro: 'Cold drinks to complete the stop.', label: 'Drinks', product: 'product-drinks-v1.webp', headline: 'Cool it down.', sceneCopy: 'Cold colour and bright highlights move into view.' },
    milkshakes: { title: 'Make it a shake.', intro: 'Creamy classics and one loaded favourite.', label: 'Milkshakes', product: 'product-milkshakes-v1.webp', headline: 'Sip slowly.', sceneCopy: 'Creamy depth with a little glass-shine.' },
    extras: { title: 'One more thing.', intro: 'Sides, wings, sauces, and the finishing touches.', label: 'Extras', product: 'product-extras-v1.webp', headline: 'Add the good stuff.', sceneCopy: 'The sides that finish the Roadhouse stop.' }
  };

  const menu = window.ROADHOUSE_MENU || {};
  const tabs = [...document.querySelectorAll('[role="tab"][data-category]')];
  const panel = document.getElementById('menu-panel');
  const hero = document.getElementById('hero-image');
  const title = document.getElementById('menu-title');
  const intro = document.querySelector('.menu-intro');
  const list = document.getElementById('menu-items');
  const count = document.querySelector('.item-count');
  const sceneLabel = document.querySelector('.scene-category');
  const experience = document.querySelector('.experience');
  const sceneTitle = document.getElementById('scene-title');
  const sceneSubtitle = document.querySelector('.scene-subtitle');
  const sceneWord = document.querySelector('.scene-word');
  const imageStage = document.querySelector('.image-stage');
  const productStack = document.querySelector('.product-layer-stack');
  const productFloor = document.querySelector('.product-floor');
  const sceneIndex = document.querySelector('.scene-index b');
  const status = document.getElementById('category-status');
  const dialog = document.querySelector('.full-menu-dialog');
  const fullMenu = document.getElementById('full-menu-content');
  let active = 'featured';
  const gsap = window.gsap;
  let productTimeline;
  let transitionToken = 0;

  const verticalClips = count => Array.from({ length: count }, (_, index) => {
    const left = (index / count) * 100;
    const right = 100 - ((index + 1) / count) * 100;
    return `inset(0 ${right}% 0 ${left}%)`;
  });

  const horizontalClips = count => Array.from({ length: count }, (_, index) => {
    const top = (index / count) * 100;
    const bottom = 100 - ((index + 1) / count) * 100;
    return `inset(${top}% 0 ${bottom}% 0)`;
  });

  const productMotion = {
    featured: { clips: horizontalClips(5), entries: [{ x: -6, y: -38, r: -2 }, { x: 5, y: -21, r: 1.2 }, { x: -3, y: 0, r: -.6 }, { x: 5, y: 22, r: 1 }, { x: -5, y: 43, r: -1.4 }] },
    burgers: { clips: horizontalClips(5), entries: [{ x: -5, y: -42, r: -1.6 }, { x: 4, y: -24, r: 1 }, { x: -3, y: 0, r: -.5 }, { x: 5, y: 25, r: 1.2 }, { x: -4, y: 46, r: -1.2 }] },
    chicken: { clips: verticalClips(4), entries: [{ x: -28, y: 12, r: -5 }, { x: -12, y: -15, r: -2 }, { x: 14, y: 16, r: 2.5 }, { x: 30, y: -10, r: 5 }] },
    wraps: { clips: verticalClips(3), entries: [{ x: -32, y: 14, r: -7 }, { x: 0, y: -22, r: 0 }, { x: 34, y: 13, r: 7 }] },
    sandwiches: { clips: verticalClips(4), entries: [{ x: -30, y: 10, r: -4 }, { x: -12, y: -16, r: -2 }, { x: 13, y: 17, r: 2 }, { x: 32, y: -9, r: 4 }] },
    pizza: { clips: ['polygon(50% 50%,0 0,50% 0)', 'polygon(50% 50%,50% 0,100% 0,100% 35%)', 'polygon(50% 50%,100% 35%,100% 100%,68% 100%)', 'polygon(50% 50%,68% 100%,28% 100%)', 'polygon(50% 50%,28% 100%,0 100%,0 55%)', 'polygon(50% 50%,0 55%,0 0)'], entries: [{ x: -14, y: -18, r: -8 }, { x: 15, y: -18, r: 7 }, { x: 18, y: 8, r: 9 }, { x: 5, y: 19, r: 5 }, { x: -16, y: 14, r: -7 }, { x: -19, y: -5, r: -9 }] },
    drinks: { clips: verticalClips(5), entries: [{ x: -10, y: 34, r: -3 }, { x: -5, y: 24, r: -1.5 }, { x: 0, y: 40, r: 0 }, { x: 5, y: 26, r: 1.5 }, { x: 10, y: 36, r: 3 }] },
    milkshakes: { clips: verticalClips(3), entries: [{ x: -14, y: 34, r: -3 }, { x: 0, y: 44, r: 0 }, { x: 14, y: 31, r: 3 }] },
    extras: { clips: verticalClips(4), entries: [{ x: -32, y: 14, r: -5 }, { x: -11, y: -17, r: -2 }, { x: 12, y: -14, r: 2 }, { x: 33, y: 13, r: 5 }] }
  };

  function cleanName(value) {
    return String(value || '').replace(/\s+(?:—|â€”)+\s*$/, '');
  }

  function itemMarkup(item) {
    const description = item.description ? `<p>${item.description}</p>` : '';
    return `<li><div class="menu-item-copy"><h3>${cleanName(item.name)}</h3>${description}</div><span class="price">${item.price}</span></li>`;
  }

  function motionIsReduced() {
    return document.body.classList.contains('motion-reduced');
  }

  function resetProductStage() {
    productTimeline?.kill();
    productTimeline = null;
    if (gsap) gsap.killTweensOf([hero, productFloor, sceneWord, sceneTitle, sceneSubtitle]);
    imageStage?.querySelectorAll('.scene-outgoing').forEach(node => node.remove());
    productStack?.replaceChildren();
    imageStage?.classList.remove('is-transitioning');
    experience?.classList.remove('scene-changing');
    if (gsap) gsap.set(hero, { clearProps: 'transform,opacity,filter' });
  }

  function loadImage(source) {
    const image = new Image();
    image.src = source;
    if (image.complete) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  }

  async function animateProduct(nextSource, category) {
    const token = ++transitionToken;
    const outgoingSource = hero.currentSrc || hero.src;
    resetProductStage();
    if (!imageStage || !productStack || !gsap || motionIsReduced()) {
      hero.src = nextSource;
      return;
    }

    await loadImage(nextSource);
    if (token !== transitionToken) return;

    const outgoing = hero.cloneNode();
    outgoing.removeAttribute('id');
    outgoing.removeAttribute('fetchpriority');
    outgoing.src = outgoingSource;
    outgoing.className = 'scene-outgoing';
    outgoing.setAttribute('aria-hidden', 'true');
    imageStage.insertBefore(outgoing, hero);

    const motion = productMotion[category] || productMotion.featured;
    const layers = motion.clips.map((clip, index) => {
      const layer = document.createElement('img');
      layer.className = 'product-layer';
      layer.src = nextSource;
      layer.alt = '';
      layer.decoding = 'async';
      layer.setAttribute('aria-hidden', 'true');
      layer.style.clipPath = clip;
      layer.style.webkitClipPath = clip;
      layer.dataset.productPart = String(index + 1);
      productStack.append(layer);
      return layer;
    });

    hero.src = nextSource;
    imageStage.classList.add('is-transitioning');
    experience.classList.add('scene-changing');

    layers.forEach((layer, index) => {
      const entry = motion.entries[index];
      gsap.set(layer, {
        xPercent: entry.x,
        yPercent: entry.y,
        rotation: entry.r,
        scale: category === 'pizza' ? 1.09 : 1.055,
        opacity: 0,
        transformOrigin: '50% 58%'
      });
    });

    const duration = category === 'featured' || category === 'burgers' ? .82 : .7;
    productTimeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        if (token !== transitionToken) return;
        productStack.replaceChildren();
        outgoing.remove();
        imageStage.classList.remove('is-transitioning');
        experience.classList.remove('scene-changing');
        gsap.set(hero, { clearProps: 'transform,opacity,filter' });
        productTimeline = null;
      }
    });

    productTimeline
      .addLabel('depart', 0)
      .to(outgoing, { opacity: 0, xPercent: -6, scale: .96, duration: .38, ease: 'power2.in' }, 'depart')
      .fromTo(productFloor, { opacity: .12, scaleX: .66, y: 16 }, { opacity: .62, scaleX: 1, y: 0, duration: .72, ease: 'expo.out' }, 'depart+=.08')
      .to(layers, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration, ease: 'expo.out', stagger: .045 }, 'depart+=.08')
      .fromTo(hero, { opacity: 0, scale: 1.025 }, { opacity: 1, scale: 1, duration: .34, ease: 'power2.out' }, `depart+=${duration * .72}`)
      .fromTo(sceneWord, { xPercent: 10, opacity: 0 }, { xPercent: -2, opacity: .065, duration: .72, ease: 'expo.out' }, 'depart+=.08')
      .fromTo(sceneTitle, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: .55, ease: 'expo.out' }, 'depart+=.12')
      .fromTo(sceneSubtitle, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power2.out' }, 'depart+=.2');
  }

  function setCategory(category, announce = true) {
    if (!scenes[category] || !menu[category]) return;
    const previous = active;
    active = category;
    const scene = scenes[category];
    const items = menu[category];
    tabs.forEach(tab => {
      const selected = tab.dataset.category === category;
      tab.setAttribute('aria-selected', String(selected));
      if (selected) tab.dataset.current = 'true';
      else delete tab.dataset.current;
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${category}`);
    panel.classList.remove('is-changing');
    void panel.offsetWidth;
    panel.classList.add('is-changing');
    title.textContent = scene.title;
    intro.textContent = scene.intro;
    sceneLabel.textContent = scene.label;
    experience.dataset.scene = category;
    sceneTitle.textContent = scene.headline;
    sceneSubtitle.textContent = scene.sceneCopy;
    sceneWord.textContent = scene.label;
    sceneIndex.textContent = String(tabs.findIndex(tab => tab.dataset.category === category) + 1).padStart(2, '0');
    count.textContent = `${String(items.length).padStart(2, '0')} PICKS`;
    list.innerHTML = items.map(itemMarkup).join('');
    const nextSource = `./assets/${scene.product}`;
    hero.alt = `Illustrative ${scene.label.toLowerCase()} product plate — menu preview`;
    if (announce && previous !== category) animateProduct(nextSource, category);
    else hero.src = nextSource;
    const nextUrl = new URL(location.href);
    nextUrl.searchParams.set('category', category);
    history.replaceState(null, '', nextUrl);
    if (announce) status.textContent = `${scene.label} menu shown.`;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setCategory(tab.dataset.category));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next].focus();
      setCategory(tabs[next].dataset.category);
    });
  });

  function renderFullMenu() {
    fullMenu.innerHTML = Object.entries(menu).map(([category, items]) =>
      `<section><h3>${scenes[category].label}</h3><ul class="menu-items">${items.map(itemMarkup).join('')}</ul></section>`
    ).join('');
  }

  document.getElementById('open-full-menu')?.addEventListener('click', () => {
    renderFullMenu();
    dialog.showModal();
  });
  document.getElementById('close-full-menu')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  const initial = new URLSearchParams(location.search).get('category');
  const motionToggle = document.querySelector('.motion-toggle');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.toggle('motion-reduced', reduceMotion);
  document.body.classList.toggle('motion-enabled', !reduceMotion);
  motionToggle?.setAttribute('aria-pressed', String(reduceMotion));
  if (motionToggle && reduceMotion) motionToggle.querySelector('span').textContent = 'Motion off';
  motionToggle?.addEventListener('click', () => {
    const reduced = document.body.classList.toggle('motion-reduced');
    document.body.classList.toggle('motion-enabled', !reduced);
    motionToggle.setAttribute('aria-pressed', String(reduced));
    motionToggle.querySelector('span').textContent = reduced ? 'Motion off' : 'Motion on';
    motionToggle.title = reduced ? 'Enable animation' : 'Reduce animation';
    if (reduced) {
      transitionToken += 1;
      resetProductStage();
    }
  });
  setCategory(scenes[initial] ? initial : active, false);
  if (!motionIsReduced()) {
    requestAnimationFrame(() => animateProduct(`./assets/${scenes[active].product}`, active));
  }

  if (imageStage && gsap && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const moveX = gsap.quickTo(hero, 'x', { duration: .55, ease: 'power3.out' });
    const moveY = gsap.quickTo(hero, 'y', { duration: .55, ease: 'power3.out' });
    const tiltX = gsap.quickTo(hero, 'rotationX', { duration: .65, ease: 'power3.out' });
    const tiltY = gsap.quickTo(hero, 'rotationY', { duration: .65, ease: 'power3.out' });
    const shadowX = gsap.quickTo(productFloor, 'x', { duration: .6, ease: 'power3.out' });

    imageStage.addEventListener('pointermove', event => {
      if (motionIsReduced() || imageStage.classList.contains('is-transitioning')) return;
      const bounds = imageStage.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) - .5;
      const y = ((event.clientY - bounds.top) / bounds.height) - .5;
      moveX(x * 13);
      moveY(y * 8);
      tiltX(y * -2.2);
      tiltY(x * 3.2);
      shadowX(x * -7);
    });

    imageStage.addEventListener('pointerleave', () => {
      moveX(0);
      moveY(0);
      tiltX(0);
      tiltY(0);
      shadowX(0);
    });
  }

  const preloadProducts = () => Object.values(scenes).forEach(scene => {
    const image = new Image();
    image.src = `./assets/${scene.product}`;
  });
  if ('requestIdleCallback' in window) requestIdleCallback(preloadProducts, { timeout: 1800 });
  else window.setTimeout(preloadProducts, 900);
})();

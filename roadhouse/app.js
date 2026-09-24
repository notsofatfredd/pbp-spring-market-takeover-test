(() => {
  'use strict';

  const scenes = {
    featured: { title: 'The favourites.', intro: 'A little of everything. Find your Roadhouse mood.', label: 'Featured favourites', image: '03_burger.webp', headline: 'Come hungry.', sceneCopy: 'Make a little room for a lot of flavour.' },
    chicken: { title: 'Golden. Crisp. Ready.', intro: 'Fried chicken favourites, from quick bites to a family box.', label: 'Fried chicken', image: '01_fried_chicken.webp', headline: 'Bring the crunch.', sceneCopy: 'Golden pieces settle into a scene made for sharing.' },
    wraps: { title: 'Wrapped up right.', intro: 'Fresh fillings, bold sauces, and satisfying crunch.', label: 'Wraps', image: '02_wraps.webp', headline: 'Roll with it.', sceneCopy: 'Fresh colour and a cut-section reveal.' },
    burgers: { title: 'Built for the bite.', intro: 'Roadhouse burgers stacked with classic flavour.', label: 'Burgers', image: '03_burger.webp', headline: 'Stacked right.', sceneCopy: 'Big layers. One satisfying centrepiece.' },
    sandwiches: { title: 'Toasted. Loaded.', intro: 'Simple favourites made for an easy stop.', label: 'Sandwiches', image: '04_sandwiches.webp', headline: 'Toast the moment.', sceneCopy: 'A familiar favourite slides into focus.' },
    pizza: { title: 'Made to share.', intro: 'Six familiar combinations in medium and large.', label: 'Pizza', image: '05_pizza.webp', headline: 'Turn up hungry.', sceneCopy: 'The whole table starts with one good slice.' },
    drinks: { title: 'Keep it cold.', intro: 'Cold drinks to complete the stop.', label: 'Drinks', image: '06_drinks.webp', headline: 'Cool it down.', sceneCopy: 'Cold colour and bright highlights move into view.' },
    milkshakes: { title: 'Make it a shake.', intro: 'Creamy classics and one loaded favourite.', label: 'Milkshakes', image: '07_milkshakes.webp', headline: 'Sip slowly.', sceneCopy: 'Creamy depth with a little glass-shine.' },
    extras: { title: 'One more thing.', intro: 'Sides, wings, sauces, and the finishing touches.', label: 'Extras', image: '08_other.webp', headline: 'Add the good stuff.', sceneCopy: 'The sides that finish the Roadhouse stop.' }
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
  const productSlices = document.querySelector('.product-slices');
  const sceneIndex = document.querySelector('.scene-index b');
  const status = document.getElementById('category-status');
  const dialog = document.querySelector('.full-menu-dialog');
  const fullMenu = document.getElementById('full-menu-content');
  let active = 'featured';
  let transitionTimer;

  function cleanName(value) {
    return String(value || '').replace(/\s+(?:—|â€”)+\s*$/, '');
  }

  function itemMarkup(item) {
    const description = item.description ? `<p>${item.description}</p>` : '';
    return `<li><div class="menu-item-copy"><h3>${cleanName(item.name)}</h3>${description}</div><span class="price">${item.price}</span></li>`;
  }

  function animateProduct(nextSource, category) {
    if (!imageStage || !productSlices || document.body.classList.contains('motion-reduced')) {
      hero.src = nextSource;
      return;
    }

    clearTimeout(transitionTimer);
    imageStage.querySelector('.scene-outgoing')?.remove();
    const outgoing = hero.cloneNode();
    outgoing.removeAttribute('id');
    outgoing.className = 'scene-outgoing';
    outgoing.removeAttribute('fetchpriority');
    imageStage.prepend(outgoing);

    productSlices.replaceChildren();
    for (let index = 0; index < 5; index += 1) {
      const slice = document.createElement('span');
      slice.style.backgroundImage = `url("${nextSource}")`;
      slice.style.setProperty('--slice-index', index);
      slice.style.setProperty('--slice-top', `${index * 20}%`);
      slice.style.setProperty('--slice-bottom', `${(4 - index) * 20}%`);
      productSlices.append(slice);
    }

    imageStage.classList.remove('is-transitioning');
    experience.classList.remove('scene-changing');
    hero.src = nextSource;
    hero.className = '';
    void imageStage.offsetWidth;
    imageStage.classList.add('is-transitioning');
    experience.classList.add('scene-changing');

    transitionTimer = window.setTimeout(() => {
      outgoing.remove();
      productSlices.replaceChildren();
      imageStage.classList.remove('is-transitioning');
      experience.classList.remove('scene-changing');
      hero.className = 'scene-enter';
    }, category === 'burgers' || category === 'featured' ? 1080 : 900);
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
    const nextSource = `./assets/${scene.image}`;
    hero.alt = `Illustrative ${scene.label.toLowerCase()} photograph — menu preview`;
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
  if (reduceMotion) document.body.classList.add('motion-reduced');
  motionToggle?.setAttribute('aria-pressed', String(reduceMotion));
  if (motionToggle && reduceMotion) motionToggle.querySelector('span').textContent = 'Motion off';
  motionToggle?.addEventListener('click', () => {
    const reduced = document.body.classList.toggle('motion-reduced');
    motionToggle.setAttribute('aria-pressed', String(reduced));
    motionToggle.querySelector('span').textContent = reduced ? 'Motion off' : 'Motion on';
    motionToggle.title = reduced ? 'Enable animation' : 'Reduce animation';
  });
  setCategory(scenes[initial] ? initial : active, false);
})();

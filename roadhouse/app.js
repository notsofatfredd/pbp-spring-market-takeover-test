(() => {
  'use strict';

  const scenes = {
    featured: { title: 'The favourites.', intro: 'A little of everything. Find your Roadhouse mood.', label: 'Featured favourites', image: '03_burger.webp' },
    chicken: { title: 'Golden. Crisp. Ready.', intro: 'Fried chicken favourites, from quick bites to a family box.', label: 'Fried chicken', image: '01_fried_chicken.webp' },
    wraps: { title: 'Wrapped up right.', intro: 'Fresh fillings, bold sauces, and satisfying crunch.', label: 'Wraps', image: '02_wraps.webp' },
    burgers: { title: 'Built for the bite.', intro: 'Roadhouse burgers stacked with classic flavour.', label: 'Burgers', image: '03_burger.webp' },
    sandwiches: { title: 'Toasted. Loaded.', intro: 'Simple favourites made for an easy stop.', label: 'Sandwiches', image: '04_sandwiches.webp' },
    pizza: { title: 'Made to share.', intro: 'Six familiar combinations in medium and large.', label: 'Pizza', image: '05_pizza.webp' },
    drinks: { title: 'Keep it cold.', intro: 'Cold drinks to complete the stop.', label: 'Drinks', image: '06_drinks.webp' },
    milkshakes: { title: 'Make it a shake.', intro: 'Creamy classics and one loaded favourite.', label: 'Milkshakes', image: '07_milkshakes.webp' },
    extras: { title: 'One more thing.', intro: 'Sides, wings, sauces, and the finishing touches.', label: 'Extras', image: '08_other.webp' }
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
  const status = document.getElementById('category-status');
  const dialog = document.querySelector('.full-menu-dialog');
  const fullMenu = document.getElementById('full-menu-content');
  let active = 'featured';

  function cleanName(value) {
    return String(value || '').replace(/\s+(?:—|â€”)+\s*$/, '');
  }

  function itemMarkup(item) {
    const description = item.description ? `<p>${item.description}</p>` : '';
    return `<li><div class="menu-item-copy"><h3>${cleanName(item.name)}</h3>${description}</div><span class="price">${item.price}</span></li>`;
  }

  function setCategory(category, announce = true) {
    if (!scenes[category] || !menu[category]) return;
    active = category;
    const scene = scenes[category];
    const items = menu[category];
    tabs.forEach(tab => {
      const selected = tab.dataset.category === category;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', `tab-${category}`);
    panel.classList.remove('is-changing');
    void panel.offsetWidth;
    panel.classList.add('is-changing');
    title.textContent = scene.title;
    intro.textContent = scene.intro;
    sceneLabel.textContent = scene.label;
    count.textContent = `${String(items.length).padStart(2, '0')} PICKS`;
    list.innerHTML = items.map(itemMarkup).join('');
    hero.src = `./assets/${scene.image}`;
    hero.alt = `Illustrative ${scene.label.toLowerCase()} photograph — menu preview`;
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
  setCategory(scenes[initial] ? initial : active, false);
})();

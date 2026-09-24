/* Roadhouse belongs to the centre directory, with its own visual menu route. */
(() => {
  'use strict';
  const originalOpenStore = window.openStoreDialog;
  if (typeof originalOpenStore !== 'function') return;

  window.openStoreDialog = function (storeId, trigger) {
    const store = typeof STORES !== 'undefined' && STORES.find(item => item.id === storeId);
    if (store && /roadhouse/i.test(store.name)) {
      window.location.assign(new URL('./roadhouse/', document.baseURI).href);
      return;
    }
    return originalOpenStore(storeId, trigger);
  };

  const labelRoadhouse = () => {
    document.querySelectorAll('.store-card').forEach(card => {
      if (!/roadhouse/i.test(card.dataset.name || '')) return;
      const label = card.querySelector('button span');
      if (label) label.textContent = 'Explore the menu';
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', labelRoadhouse, { once: true });
  } else {
    labelRoadhouse();
  }
})();

(() => {
  if (window.morrowProductInitialized) return;
  window.morrowProductInitialized = true;
  const instances = new Map();

  function initialize(root) {
    if (instances.has(root)) return;
    const data = root.querySelector('[data-product-variants]');
    let variants;
    try {
      variants = JSON.parse(data.textContent);
    } catch {
      return;
    }
    const track = root.querySelector('[data-product-track]');
    const slides = [...track.children];
    const thumbnails = [...root.querySelectorAll('[data-product-thumb]')];
    const previous = root.querySelector('[data-product-prev]');
    const next = root.querySelector('[data-product-next]');
    const position = root.querySelector('[data-product-position]');
    const options = root.querySelector('[data-product-options]');
    const id = root.querySelector('[data-product-id]');
    const price = root.querySelector('[data-product-price]');
    const compare = root.querySelector('[data-product-compare]');
    const quantity = root.querySelector('[data-product-quantity]');
    const add = root.querySelector('[data-product-add]');
    const status = root.querySelector('[data-product-status]');
    const listeners = [];
    let current = 0;
    const on = (element, type, listener) => {
      if (!element) return;
      element.addEventListener(type, listener);
      listeners.push(() => element.removeEventListener(type, listener));
    };
    const updateGallery = (index) => {
      current = Math.max(0, Math.min(index, slides.length - 1));
      if (previous) previous.disabled = current === 0;
      if (next) next.disabled = current === slides.length - 1;
      if (position) position.textContent = `${current + 1} / ${slides.length}`;
      thumbnails.forEach((thumbnail, item) => {
        if (item === current) thumbnail.setAttribute('aria-current', 'true');
        else thumbnail.removeAttribute('aria-current');
      });
    };
    const goTo = (index, immediate = false) => {
      updateGallery(index);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollTo({ left: track.clientWidth * current, behavior: immediate || reduce ? 'instant' : 'smooth' });
    };
    const selectVariant = (variantId, initial = false) => {
      const variant = variants.find((item) => String(item.id) === String(variantId));
      if (!variant) return;
      id.value = variant.id;
      price.textContent = variant.price;
      compare.textContent = variant.compareAt || '';
      compare.hidden = !variant.compareAt;
      add.disabled = !variant.available;
      add.textContent = variant.available ? 'Add to bag' : 'Sold out';
      quantity.min = variant.quantity.min;
      quantity.step = variant.quantity.increment;
      if (variant.quantity.max == null) quantity.removeAttribute('max');
      else quantity.max = variant.quantity.max;
      quantity.value = variant.quantity.min;
      const image = slides.findIndex((slide) => slide.dataset.imageId === String(variant.imageId));
      if (image >= 0) goTo(image, initial);
      if (!initial) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url);
        status.textContent = variant.available ? 'Option selected.' : 'This option is sold out.';
      }
    };

    on(previous, 'click', () => goTo(current - 1));
    on(next, 'click', () => goTo(current + 1));
    thumbnails.forEach((thumbnail) => on(thumbnail, 'click', () => goTo(Number(thumbnail.dataset.productThumb))));
    on(track, 'scroll', () => {
      if (track.clientWidth) updateGallery(Math.round(track.scrollLeft / track.clientWidth));
    });
    on(options, 'change', (event) => {
      if (event.target.name === 'variant') selectVariant(event.target.value);
    });
    root.querySelectorAll('[data-product-controls]').forEach((controls) => { controls.hidden = false; });
    updateGallery(0);
    selectVariant(root.dataset.currentVariant, true);
    instances.set(root, () => listeners.forEach((remove) => remove()));
  }
  const initializeWithin = (root) => {
    if (root.matches?.('[data-product-root]')) initialize(root);
    root.querySelectorAll('[data-product-root]').forEach(initialize);
  };
  initializeWithin(document);
  document.addEventListener('shopify:section:load', (event) => initializeWithin(event.target));
  document.addEventListener('shopify:section:unload', (event) => {
    instances.forEach((cleanup, root) => {
      if (event.target.contains(root)) {
        cleanup();
        instances.delete(root);
      }
    });
  });
})();

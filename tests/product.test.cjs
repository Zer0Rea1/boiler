const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/product.js', 'utf8');
const template = fs.readFileSync('sections/main-product.liquid', 'utf8');
assert.match(template, /<noscript><button[^>]*>Select option<\/button><\/noscript>/);
assert(!template.includes('<select'), 'variant controls use radio inputs');

function element(dataset = {}) {
  const events = {};
  const attrs = {};
  return {
    dataset, children: [], hidden: false, value: '', textContent: '',
    addEventListener(type, listener) { (events[type] ||= new Set()).add(listener); },
    removeEventListener(type, listener) { events[type]?.delete(listener); },
    fire(type, event = {}) { events[type]?.forEach((listener) => listener(event)); },
    listenerCount() { return Object.values(events).reduce((sum, group) => sum + group.size, 0); },
    setAttribute(key, value) { attrs[key] = value; },
    removeAttribute(key) { delete attrs[key]; if (key === 'max') delete this.max; },
    getAttribute(key) { return attrs[key]; },
  };
}
function setup({ reduced = false } = {}) {
  const variants = [
    { id: 1, available: true, price: '$24', compareAt: null, imageId: 11, quantity: { min: 1, increment: 1, max: null } },
    { id: 2, available: false, price: '$40', compareAt: '$50', imageId: 22, quantity: { min: 2, increment: 2, max: 6 } },
  ];
  const track = element();
  track.clientWidth = 500;
  track.scrollLeft = 0;
  track.children = [element({ imageId: '11' }), element({ imageId: '22' })];
  track.scrollTo = (options) => { track.lastScroll = options; track.scrollLeft = options.left; };
  const parts = {};
  for (const name of ['variants', 'prev', 'next', 'position', 'options', 'id', 'price', 'compare', 'quantity', 'add', 'status']) parts[`[data-product-${name}]`] = element();
  parts['[data-product-variants]'].textContent = JSON.stringify(variants);
  parts['[data-product-track]'] = track;
  const thumbnails = [element({ productThumb: '0' }), element({ productThumb: '1' })];
  const controls = [element(), element()];
  const root = element({ currentVariant: '1' });
  root.querySelector = (selector) => parts[selector];
  root.querySelectorAll = (selector) => selector === '[data-product-thumb]' ? thumbnails : selector === '[data-product-controls]' ? controls : [];
  root.matches = (selector) => selector === '[data-product-root]';
  root.contains = (item) => item === root;
  const docEvents = {};
  const document = {
    querySelectorAll: () => [root],
    addEventListener(type, listener) { docEvents[type] = listener; },
  };
  const window = {
    matchMedia: () => ({ matches: reduced }),
    location: { href: 'https://example.com/products/serum?campaign=spring' },
    history: { replaceState(state, title, url) { window.lastUrl = String(url); } },
  };
  const context = { window, document, Map, JSON, URL };
  vm.runInNewContext(source, context);
  return { root, parts, track, thumbnails, controls, window, context, docEvents };
}
const test = setup();
const part = (name) => test.parts[`[data-product-${name}]`];
assert.equal(part('id').value, 1);
assert.equal(part('price').textContent, '$24');
assert(test.controls.every((control) => !control.hidden));
assert.equal(part('prev').disabled, true);
assert.equal(part('next').disabled, false);
part('options').fire('change', { target: { name: 'variant', value: '2' } });
assert.equal(part('id').value, 2);
assert.equal(part('price').textContent, '$40');
assert.equal(part('compare').textContent, '$50');
assert.equal(part('compare').hidden, false);
assert.equal(part('add').disabled, true);
assert.equal(part('add').textContent, 'Sold out');
assert.equal(part('quantity').value, 2);
assert.equal(part('quantity').min, 2);
assert.equal(part('quantity').step, 2);
assert.equal(part('quantity').max, 6);
assert.equal(test.track.lastScroll.left, 500);
assert.equal(test.track.lastScroll.behavior, 'smooth');
assert.equal(part('next').disabled, true);
assert.equal(test.thumbnails[1].getAttribute('aria-current'), 'true');
assert.equal(test.window.lastUrl, 'https://example.com/products/serum?campaign=spring&variant=2');
part('options').fire('change', { target: { name: 'variant', value: '1' } });
assert.equal(part('add').disabled, false);
assert.equal(part('compare').hidden, true);
assert.equal(part('quantity').max, undefined);
test.thumbnails[1].fire('click');
assert.equal(test.track.lastScroll.left, 500);
part('prev').fire('click');
assert.equal(test.track.lastScroll.left, 0);
test.track.scrollLeft = 500;
test.track.fire('scroll');
assert.equal(part('position').textContent, '2 / 2');
vm.runInNewContext(source, test.context);
assert.equal(part('options').listenerCount(), 1, 'script reload does not duplicate handlers');
test.docEvents['shopify:section:unload']({ target: test.root });
assert.equal(part('options').listenerCount(), 0);
assert.equal(test.track.listenerCount(), 0);
test.docEvents['shopify:section:load']({ target: test.root });
assert.equal(part('options').listenerCount(), 1);
const reduced = setup({ reduced: true });
reduced.thumbnails[1].fire('click');
assert.equal(reduced.track.lastScroll.behavior, 'instant');
console.log('Product checks passed: radio selection, prices, stock, quantity rules, variant image, gallery, reduced motion, editor cleanup.');

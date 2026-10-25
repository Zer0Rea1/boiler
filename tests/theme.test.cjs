const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('assets/theme.js', 'utf8');
function element(children = []) {
  const classes = new Set();
  return {
    children,
    style: {},
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      contains: (name) => classes.has(name),
    },
    querySelectorAll: () => [],
    matches: () => false,
    contains(group) { return group === this || children.includes(group); },
  };
}
function setup({ reduced = false, supported = true } = {}) {
  const group = element([element(), element()]);
  const root = element();
  const events = {};
  const observed = new Set();
  let intersect;
  let preferenceChange;
  const motion = {
    matches: reduced,
    addEventListener(type, callback) { preferenceChange = callback; },
  };
  const document = {
    documentElement: root,
    querySelectorAll: () => [group],
    addEventListener: (type, callback) => { events[type] = callback; },
  };
  class Observer {
    constructor(callback) { intersect = callback; }
    observe(target) { observed.add(target); }
    unobserve(target) { observed.delete(target); }
    disconnect() { observed.clear(); }
  }
  const window = { matchMedia: () => motion };
  if (supported) window.IntersectionObserver = Observer;
  vm.runInNewContext(source, { window, document, IntersectionObserver: Observer, Set });
  return { group, root, events, observed, motion, intersect, change: () => preferenceChange() };
}

const active = setup();
assert(active.observed.has(active.group));
assert(active.group.children.every((child) => child.classList.contains('t-stagger-line')));
assert.equal(active.group.children[1].style.transitionDelay, 'calc(var(--stagger-stagger) * 1)');
active.intersect([{ target: active.group, isIntersecting: false }]);
assert(!active.group.classList.contains('is-shown'));
active.intersect([{ target: active.group, isIntersecting: true }]);
assert(active.group.classList.contains('is-shown'));
assert.equal(active.observed.size, 0);

const section = element([element()]);
section.matches = () => true;
active.events['shopify:section:load']({ target: section });
assert(active.observed.has(section));
active.events['shopify:section:unload']({ target: section });
assert(!active.observed.has(section));

const preference = setup();
preference.motion.matches = true;
preference.change();
assert.equal(preference.observed.size, 0);
assert(preference.group.classList.contains('is-shown'));
assert(!preference.root.classList.contains('motion-ready'));

const reduced = setup({ reduced: true });
assert(!reduced.root.classList.contains('motion-ready'));
assert(!reduced.group.classList.contains('t-stagger'));
assert.equal(reduced.observed.size, 0);
const unsupported = setup({ supported: false });
assert(!unsupported.root.classList.contains('motion-ready'));
assert(!unsupported.group.classList.contains('t-stagger'));
console.log('Theme motion checks passed: reveal, stagger, editor reload/unload, reduced motion, unsupported browser.');

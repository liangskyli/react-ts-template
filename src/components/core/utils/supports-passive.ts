import { canUseDom } from './can-use-dom.ts';

export let supportsPassive = false;

if (canUseDom) {
  try {
    const opts = {};
    Object.defineProperty(opts, 'passive', {
      get() {
        supportsPassive = true;
      },
    });
    window.addEventListener('test-passive', null as never, opts);
  } catch {
    /* empty */
  }
}

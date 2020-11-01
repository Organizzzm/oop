import {capitalize} from '../core/utils';

export class DomListener {
  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error('No $root provided');
    }

    this.$root = $root;
    this.listeners = listeners;
  }

  initDOMListeners() {
    this.listeners.forEach((listener) => {
      const method = getMethodName(listener);

      if (!this[method]) {
        throw new Error('Method is not implemented');
      }

      this[method] = this[method].bind(this);
      this.$root.on(listener, this[method]);
    });
  }

  removeDOMListeners() {
    this.listeners.forEach((listener) => {
      const method = getMethodName(listener, this[method]);

      if (!this[method]) {
        throw new Error('Method is not implemented');
      }

      this.$root.off(listener);
    });
  }
}

function getMethodName(eventName) {
  return 'on' + capitalize(eventName);
}

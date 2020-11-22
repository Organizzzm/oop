import {$} from '@core/Dom';
import {ActiveRoute} from './ActiveRoute';

export class Router {
  constructor(selector, routes) {
    if (!selector) {
      throw new Error('Selector is not provided in Router');
    }

    this.$placeholder = $(selector);
    this.routes = routes;
    this.changePageHandler = this.changePageHandler.bind(this);
    this.page = null;

    this.init();
  }

  init() {
    window.addEventListener('hashchange', this.changePageHandler);
    this.changePageHandler();
  }

  changePageHandler(event) {
    if (this.page) this.page.destroy();
    this.$placeholder.clear();

    const Page = ActiveRoute.path.includes('excel') ?
    this.routes.excel : this.routes.dashboard;

    const page = new Page(ActiveRoute.param);

    this.$placeholder.append(page.getRoot());
    page.afterRender();
  }

  destroy() {
    window.removeEventListener('hashchange', this.changePageHandler);
  }
}

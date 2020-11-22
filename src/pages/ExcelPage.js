import {Page} from '../core/Page';
import {rootReducer} from '../redux/rootReducer';
import {debounce, storage} from '../core/utils';
import {createStore} from '../core/createStore';
import {Header} from '../components/header/Header';
import {Excel} from '../components/excel/Excel';
import {Toolbar} from '../components/toolbar/Toolbar';
import {Formula} from '../components/formula/Formula';
import {Table} from '../components/table/Table';
import {normalizeInitialState} from '../redux/initialState';

export class ExcelPage extends Page {
  getRoot() {
    const params = this.params ? this.params : Date.now().toString();
    const state = storage(storageName(params));
    const store = createStore(rootReducer, normalizeInitialState(state));

    const stateListener = debounce((state) => {
      storage(storageName(params), state);
    }, 1000);

    store.subscribe(stateListener);

    this.excel = new Excel({
      components: [
        Header,
        Toolbar,
        Formula,
        Table,
      ],
      store,
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
  }
}


function storageName(param) {
  return 'excel:' + param;
}

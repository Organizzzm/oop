import './scss/index.scss';
import {Table} from './components/table/Table';
import {Formula} from './components/formula/Formula';
import {Toolbar} from './components/toolbar/Toolbar';
import {Header} from './components/header/Header';
import {Excel} from './components/excel/Excel';
import {createStore} from './core/createStore';
import {rootReducer} from './redux/rootReducer';
import {storage, debounce} from '@core/utils';
import {initialState} from './redux/initialState';

const store = createStore(rootReducer, initialState);

const stateListener = debounce((state) => {
  storage('excel-state', state);
}, 1000);

store.subscribe(stateListener);

const excel = new Excel('#app', {
  components: [
    Header,
    Toolbar,
    Formula,
    Table,
  ],
  store,
});

excel.render();

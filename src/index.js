import './scss/index.scss';
import {Table} from './components/table/Table';
import {Formula} from './components/formula/Formula';
import {Toolbar} from './components/toolbar/Toolbar';
import {Header} from './components/header/Header';
import {Excel} from './components/excel/Excel';


const excel = new Excel('#app', {
  components: [
    Header,
    Toolbar,
    Formula,
    Table,
  ],
});

excel.render();

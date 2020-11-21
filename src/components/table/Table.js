import {$} from '@core/Dom';
import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {resizeHandler} from '@/components/table/table.resize';
import {shouldResize, isCell} from '@/components/table/table.functions';
import {TableSelection} from './TableSelection';
import {matrix, nextSelector} from '@core/utils';
import * as actions from '@/redux/actions';
import {defaultStyles} from '../../constants';
import {parse} from '../../core/parse';

export class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    });
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();

    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);

    this.$on('formula:input', (value) => {
      this.selection.current
          .attr('data-value', value)
          .text(parse(value));

      this.updateTextInStore(value);
    });

    this.$on('formula:done', () => {
      this.selection.current.focus();
    });

    this.$on('toolbar:applyStyle', (value) => {
      this.selection.applyStyles(value);
      this.$dispatch(actions.applyStyles({
        value,
        ids: this.selection.selectedIds,
      }));
    });
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);

    const styles = $cell.getStyles(Object.keys(defaultStyles));
    this.$dispatch(actions.changeStyles(styles));
  }

  toHtml() {
    return createTable(50, this.store.getState());
  }

  async resizeTable(event) {
    const data = await resizeHandler(this.$root, event.target);
    this.$dispatch(actions.tableResize(data));
  }

  onMousedown(event) {
    if (shouldResize(event.target)) {
      this.resizeTable(event);
    } else if (isCell(event.target)) {
      const $target = $(event.target);

      if (event.shiftKey) {
        const cells = matrix($target, this.selection.current)
            .map((id) => this.$root.find(`[data-id="${id}"]`));

        this.selection.selectGroup(cells);
      } else {
        this.selection.select($target);
        this.selectCell($target);
      }
    }
  }

  onKeydown(event) {
    const keys =
    ['Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];
    const {key} = event;

    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();

      const id = this.selection.current.id(true);
      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next);
    }
  }

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value,
    }));
  }

  onInput(event) {
    // this.$emit('table:input', $(event.target));
    this.updateTextInStore($(event.target).text());
  }
}



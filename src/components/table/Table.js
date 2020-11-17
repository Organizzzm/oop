import {$} from '@core/Dom';
import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from '@/components/table/table.template';
import {resizeHandler} from '@/components/table/table.resize';
import {shouldResize, isCell} from '@/components/table/table.functions';
import {TableSelection} from './TableSelection';
import {matrix, nextSelector} from '@core/utils';

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

    this.$on('formula:input', (text) => {
      this.selection.current.text(text);
    });

    this.$on('formula:done', (text) => {
      this.selection.current.focus();
    });
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
  }

  toHtml() {
    return createTable(50);
  }

  onMousedown(event) {
    if (shouldResize(event.target)) {
      resizeHandler(this.$root, event.target);
    } else if (isCell(event.target)) {
      const $target = $(event.target);

      if (event.shiftKey) {
        const cells = matrix($target, this.selection.current)
            .map((id) => this.$root.find(`[data-id="${id}"]`));

        this.selection.selectGroup(cells);
      } else {
        this.selection.select($target);
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

  onInput(event) {
    this.$emit('table:input', $(event.target));
  }
}



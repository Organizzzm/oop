import {$} from '../../core/Dom';

export function resizeHandler($root, target) {
  const $resizer = $(target);
  const $parent = $resizer.closest('[data-type="resizable"]');
  const coords = $parent.getCoords();
  const type = $resizer.data.resize;
  const sideProp = type === 'col' ? 'bottom' : 'right';
  const cssObj = {};
  let value;

  cssObj['opacity'] = 1;
  cssObj[sideProp] = '-5000px';

  $resizer.css(cssObj);

  const cells = $root.findAll(`[data-col="${$parent.data.col}"]`);

  document.onmousemove = (e) => {
    if (type === 'col') {
      const delta = e.pageX - coords.right;
      value = coords.width + delta;
      $resizer.css({left: value + 'px'});
    } else {
      const delta = e.pageY - coords.bottom;
      value = coords.height + delta;
      $resizer.css({top: value + 'px'});
    }
  };

  document.onmouseup = () => {
    document.onmousemove = null;
    document.onmouseup = null;

    if (type === 'col') {
      cells.forEach((el) => el.style.width = value + 'px');
    } else {
      $parent.css({height: value + 'px'});
    }

    $resizer.css({opacity: 0, bottom: 0});
  };
}

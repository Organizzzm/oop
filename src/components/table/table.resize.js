import {$} from '../../core/Dom';

export function resizeHandler($root, target) {
  return new Promise((resolve) => {
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
        $root
            .findAll(`[data-col="${$parent.data.col}"]`)
            .forEach((el) => el.style.width = value + 'px');
      } else {
        $parent.css({height: value + 'px'});
      }

      resolve({
        value,
        type,
        id: $parent.data[type],
      });

      $resizer.css({opacity: 0, bottom: 0, right: 0});
    };
  });
}

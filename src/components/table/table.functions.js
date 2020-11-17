export function shouldResize(target) {
  return target.dataset.resize;
}

export function isCell(target) {
  return target.dataset.type === 'cell';
}

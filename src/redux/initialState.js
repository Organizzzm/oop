import {defaultStyles, defaultTitle} from '../constants';
import {clone} from '../core/utils';

export const defaultState = {
  title: defaultTitle,
  rowState: {},
  colState: {},
  dataState: {},
  stylesState: {},
  currentText: '',
  currentStyles: defaultStyles,
  openedDate: new Date().toJSON(),
};

export function normalizeInitialState(state) {
  return state ? (state) : clone(defaultState);
}

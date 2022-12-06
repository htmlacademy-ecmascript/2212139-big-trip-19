import { render } from './render.js';
import FilterView from './view/Filter.js';
import SortView from './view/Sort.js';

const siteMainElement = document.querySelector('.trip-main');
const filterElement = siteMainElement.querySelector('.trip-controls');
const sortElement = siteMainElement.querySelector('.trip-events');

render(new FilterView(), filterElement);
render(new SortView(), sortElement);

import FilterView from './view/Filter.js';
import { render } from './render.js';

const siteMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteMainElement.querySelector('.trip-controls');

render(new FilterView(), siteHeaderElement);

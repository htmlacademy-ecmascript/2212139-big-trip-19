import { render, RenderPosition } from './render.js';
import FilterView from './view/Filter.js';
import SortView from './view/Sort.js';
import EmptyListView from './view/EmptyList.js';
import EditPointView from './view/EditPoint.js';
import ListView from './view/list.js';

const siteMainElement = document.querySelector('.trip-main');
const filterElement = siteMainElement.querySelector('.trip-controls');
const sortElement = siteMainElement.querySelector('.trip-events');

render(new FilterView(), filterElement, RenderPosition.BEFOREBEGIN);
render(new SortView(), sortElement);

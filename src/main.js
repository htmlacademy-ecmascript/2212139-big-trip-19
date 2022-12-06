import { render, RenderPosition } from './render.js';
import FilterView from './view/Filter.js';
import SortView from './view/Sort.js';
import EmptyListView from './view/EmptyList.js';
import EditPointView from './view/EditPoint.js';
import ListView from './view/list.js';
import NewPointView from './view/NewPoint.js';
import PointView from './view/Point.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = siteMainElement.querySelector(
  '.page-body__container'
);
const boardPresenter = new BoardPresenter({ boardContainer: siteMainElement });

render(new FilterView(), siteHeaderElement, RenderPosition.BEFOREBEGIN);
render(new SortView(), siteHeaderElement);

boardPresenter.init();

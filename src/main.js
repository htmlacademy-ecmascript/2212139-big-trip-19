import { render, RenderPosition } from './render.js';
import FilterView from './view/Filter.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const siteHeaderElement = document.querySelector('.trip-controls');
const boardPresenter = new BoardPresenter({ boardContainer: siteMainElement });

render(new FilterView(), siteHeaderElement, RenderPosition.BEFOREEND);

boardPresenter.init();

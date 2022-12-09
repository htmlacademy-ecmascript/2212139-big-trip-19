import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';

const headerElement = document.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();

const tripPresenter = new TripPresenter({
  boardContainer: tripEventsElement,
  filterContainer: headerElement,
  pointsModel,
});

tripPresenter.init();

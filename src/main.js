import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

const headerElement = document.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const destinationModel = new DestinationsModel();
const offersModel = new OffersModel();


const tripPresenter = new TripPresenter({
  boardContainer: tripEventsElement,
  filterContainer: headerElement,
});

tripPresenter.init(pointsModel, offersModel, destinationModel);

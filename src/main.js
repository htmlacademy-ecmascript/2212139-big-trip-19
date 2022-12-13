import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import { render } from './render.js';
import FilterView from './view/trip-filter.js';
import SortView from './view/trip-sort.js';

const headerElement = document.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const destinationModel = new DestinationsModel();
const offersModel = new OffersModel();

render(new FilterView(), headerElement);
render(new SortView(), tripEventsElement);

const tripPresenter = new TripPresenter();

tripPresenter.init(tripEventsElement, pointsModel, destinationModel, offersModel);

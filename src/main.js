import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import NewEventButtonView from './view/new-event-btn-view.js';
import { render } from './framework/render.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
//import { generateFilter } from './mosk/filter.js';


const headerElement = document.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');
const newEventsButtonContainerElement = document.querySelector('.trip-main');
const pointsModel = new PointsModel();
const destinationModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
//const filteredPoints = generateFilter(points);


const newPointButtonComponent = new NewEventButtonView({
  onClick: handleNewPointButtonClick
});

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const tripPresenter = new TripPresenter(
  {
    tripEventsElement, filterModel,
    pointsModel, destinationModel, offersModel,
    onNewPointDestroy: handleNewPointFormClose
  });

const filterPresenter = new FilterPresenter({
  filterContainer: headerElement,
  filterModel,
  pointsModel
});

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, newEventsButtonContainerElement);

filterPresenter.init();
tripPresenter.init();

// задание 6.2 сделано в предыдущей ветке

import TripPresenter from './presenter/events-presenter.js';
import PointsModel from './model/points-model.js';
import NewEventButtonView from './view/new-event-btn-view.js';
import { render } from './framework/render.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';


const AUTHORIZATION = 'Basic kTy9gdfgssdfdIsz2317rD';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip';
const headerElement = document.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');
const mainElement = document.querySelector('.trip-main');
const filterModel = new FilterModel();
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel({ pointsApiService });


const newPointButtonComponent = new NewEventButtonView({
  onNewEventButtonClick: handleNewEventButtonClick
});

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const tripInfoPresenter = new TripInfoPresenter(mainElement, pointsModel);

const tripPresenter = new TripPresenter(
  {
    tripEventsElement, filterModel,
    pointsModel, onNewPointDestroy: handleNewPointFormClose
  });

const filterPresenter = new FilterPresenter({
  filterContainer: headerElement,
  filterModel,
  pointsModel
});

function handleNewEventButtonClick() {
  tripPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, mainElement);
  });
//go

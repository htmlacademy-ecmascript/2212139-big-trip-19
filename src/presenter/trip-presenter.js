import { render, RenderPosition } from '../framework/render.js';
import TripListView from '../view/trip-list.js';
import EmptyListView from '../view/empty-list.js';
import { getSelectedDestination, getSelectedOffers, getOffersByType } from '../utils/point.js';
import PointPresenter from './point-presenter.js';
import { PointState, SortType } from '../const.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/trip-sort.js';
import { sortedPoints } from '../utils/sort.js';
import { generateSortOptions } from '../mosk/sort.js';


export default class EventsPresenter {

  #eventListContainer = new TripListView();
  #pointsModel = [];
  #destinationsModel = [];
  #offersModel = [];
  #eventsContainer = null;
  #eventPoints = [];
  #destinations = [];
  #offers = [];
  #pointPresenterMap = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];
  #sortOptions = generateSortOptions();


  constructor(eventsContainer, PointsModel, DestinationsModel, OffersModel) {
    this.#pointsModel = PointsModel;
    this.#destinationsModel = DestinationsModel;
    this.#offersModel = OffersModel;
    this.#eventsContainer = eventsContainer;
  }


  #renderPoint = (point, destination, allDestinations, offers, allOffers) => {

    const pointPresenter = new PointPresenter(
      this.#eventListContainer.element,
      this.#handlePointChange,
      this.#handleModeChange
    );

    pointPresenter.init(PointState.EDIT, point, destination, allDestinations, offers, allOffers);
    this.#pointPresenterMap.set(point.id, pointPresenter);
  };

  #renderSort() {
    this.#sortComponent = new SortView(this.#sortOptions, this.#currentSortType, this.#handleSortTypeChange);

    render(this.#sortComponent, this.#eventListContainer.element, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderEvens();
  };


  #handleModeChange = () => {
    this.#pointPresenterMap.forEach((presenter) => presenter.resetView());
  };

  #clearPointList() {
    this.#pointPresenterMap.forEach((presenter) => presenter.destroy());
    this.#pointPresenterMap.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#eventPoints = updateItem(this.#eventPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenterMap.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {

    switch (sortType) {
      case 'day':
        this.#eventPoints = sortedPoints(this.#eventPoints, 'day');
        break;
      case 'time':
        this.#eventPoints = sortedPoints(this.#eventPoints, 'time');
        break;
      case 'price':
        this.#eventPoints = sortedPoints(this.#eventPoints, 'price');
        break;
      case 'offers':
        this.#eventPoints = sortedPoints(this.#eventPoints, 'offers');
        break;
      default:
        this.#eventPoints = [...this.#sourcedBoardPoints];
    }
    this.#currentSortType = sortType;
  }

  #renderEvens() {
    if (!this.#eventPoints.length) {
      render(new EmptyListView(), this.#eventsContainer);
      return null;
    }

    render(this.#eventListContainer, this.#eventsContainer);
    //this.#renderEditPoint(PointState.ADD, this.#eventPoints, this.#destinations, this.#offers);

    for (let i = 0; i < this.#eventPoints.length; i++) {

      const offersPoint = getOffersByType(this.#offers, this.#eventPoints[i].type);
      const selectedDestination = getSelectedDestination(this.#destinations, this.#eventPoints[i].destination);
      const selectedOffers = getSelectedOffers(offersPoint, this.#eventPoints[i].offers);

      this.#renderPoint(this.#eventPoints[i], selectedDestination, this.#destinations, selectedOffers, offersPoint);
    }
  }

  init = () => {

    this.#eventPoints = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];


    this.#renderSort();
    this.#renderEvens();

  };
}

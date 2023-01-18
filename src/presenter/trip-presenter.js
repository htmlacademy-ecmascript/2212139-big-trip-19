import { remove, render, RenderPosition } from '../framework/render.js';
import TripListView from '../view/trip-list.js';
import EmptyListView from '../view/empty-list.js';
import {
  getSelectedDestination, getSelectedOffers,
  getOffersByType
} from '../utils/point.js';
import PointPresenter from './point-presenter.js';
import { BLANK_POINT, FilterType, SortType, UpdateType, UserAction } from '../const.js';
import SortView from '../view/trip-sort.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortedPoints } from '../utils/sort.js';
import { generateSortOptions } from '../mosk/sort.js';
import { filter } from '../utils/filter.js';


export default class EventsPresenter {

  #eventListContainer = new TripListView();
  #filterModel = null;
  #pointsModel = null;
  #destinationsModel = [];
  #offersModel = [];
  #eventsContainer = null;
  #destinations = [];
  #offers = [];
  #pointPresenterMap = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #noPointComponent = null;

  #sortOptions = generateSortOptions();
  #filteredPoints = [];
  #newPointPresenter = null;


  constructor({ tripEventsElement, filterModel,
    pointsModel, destinationModel, offersModel, onNewPointDestroy }) {

    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#eventsContainer = tripEventsElement;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListContainer.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }


  #renderPoint = (point, destination, allDestinations, offers, allOffers) => {

    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventListContainer.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, destination, allDestinations, offers, allOffers);
    this.#pointPresenterMap.set(point.id, pointPresenter);
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      sortOption: this.#sortOptions,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventListContainer.element, RenderPosition.BEFOREEND);
  }


  createPoint() {
    const point = BLANK_POINT;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(point, this.#destinations, this.#offers);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenterMap.forEach((presenter) => presenter.resetView());
  };

  #clearBoard({ resetSortType = false } = {}) {

    this.#newPointPresenter.destroy();
    this.#pointPresenterMap.forEach((presenter) => presenter.destroy());
    this.#pointPresenterMap.clear();

    remove(this.#sortComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }


  #handleViewAction = (actionType, updateType, update) => {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenterMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearBoard({ resetRenderedPointCount: true, resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new EmptyListView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent,
      this.#eventsContainer);
  };


  #renderBoard() {
    render(this.#eventListContainer, this.#eventsContainer);

    const points = this.points;

    if (!points.length) {
      this.#renderNoPoints();
      return;
    }

    for (let i = 0; i < points.length; i++) {

      const offersPoint = getOffersByType(this.#offers, points[i].type);
      const selectedDestination = getSelectedDestination(
        this.#destinations, points[i].destination);
      const selectedOffers = getSelectedOffers(offersPoint, points[i].offers);

      this.#renderPoint(points[i], selectedDestination,
        this.#destinations, selectedOffers, offersPoint);
    }
  }

  get points() {

    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return sortedPoints(filteredPoints, SortType.DAY);
      case SortType.TIME:
        return sortedPoints(filteredPoints, SortType.TIME);
      case SortType.PRICE:
        return sortedPoints(filteredPoints, SortType.PRICE);
      case SortType.OFFERS:
        return sortedPoints(filteredPoints, SortType.OFFERS);
      default:
        return filteredPoints;
    }
  }

  init = () => {

    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#renderSort();
    this.#renderBoard();
  };
}

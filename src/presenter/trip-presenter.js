import { remove, render, RenderPosition } from '../framework/render.js';
import TripListView from '../view/trip-list.js';
import EmptyListView from '../view/empty-list.js';
import {
  getSelectedDestination, getSelectedOffers,
  getOffersByType
} from '../utils/point.js';
import PointPresenter from './point-presenter.js';
import { FilterType, PointState, SortType, UpdateType, UserAction } from '../const.js';
import SortView from '../view/trip-sort.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortedPoints } from '../utils/sort.js';
import { generateSortOptions } from '../mosk/sort.js';
import { filterPointsByType, filter } from '../utils/filter.js';


export default class EventsPresenter {

  #eventListContainer = new TripListView();
  #filterModel = null;
  #pointsModel = null;
  #destinationsModel = [];
  #offersModel = [];
  #eventsContainer = null;
  #eventPoints = [];
  #destinations = [];
  #offers = [];
  #pointPresenterMap = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #currentPointState = PointState.EDIT;
  #noPointComponent = null;

  #sortOptions = generateSortOptions();
  #filteredPoints = [];
  #newPointPresenter = null;


  constructor({ eventsContainer, filterModel,
    PointsModel, DestinationsModel, OffersModel, onNewPointDestroy }) {

    this.#pointsModel = PointsModel;
    this.#destinationsModel = DestinationsModel;
    this.#filterModel = filterModel;
    this.#offersModel = OffersModel;
    this.#eventsContainer = eventsContainer;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListContainer.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }


  #renderPoint = (pointState, point, destination, allDestinations, offers, allOffers) => {

    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventListContainer.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(pointState, point, destination, allDestinations, offers, allOffers);
    this.#pointPresenterMap.set(point.id, pointPresenter);
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      sortOption: this.#sortOptions,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#eventListContainer.element, RenderPosition.AFTERBEGIN);
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  // #renderFilter() {
  //   this.#filterComponent = new FilterView({
  //     filters: this.#filterPointsCount,
  //     currentFilterType: this.#currentFilterType,
  //     onFilterChange: this.#handleFilterChange
  //   });
  //   this.#filteredPoints = filterPointsByType(this.#eventPoints, FilterType.EVERYTHING);
  //   render(this.#filterComponent, this.#headerContainer);
  // }

  // #handleFilterChange = (filterType) => {
  //   if (this.#currentFilterType === filterType) {
  //     return;
  //   }
  //   //this.#filteredPoints = filterPointsByType(this.#eventPoints, filterType);
  //   this.#currentFilterType = filterType;
  //   // this.#clearPointList();
  //   // this.#renderEvens();
  //   this.#clearBoard({ resetRenderedPointCount: true });
  //   this.#renderBoard();
  // };

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
      this.#currentSortType = SortType.DEFAULT;
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

  #renderNoPoints = (params) => {
    this.#noPointComponent = new EmptyListView({
      filterType: this.#filterType
    })
    render(this.#noPointComponent,
      this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }


  #renderBoard() {

    this.#renderNoPoints()

    render(this.#eventListContainer, this.#eventsContainer);

    for (let i = 0; i < this.#filteredPoints.length; i++) {

      const offersPoint = getOffersByType(this.#offers, this.#filteredPoints[i].type);
      const selectedDestination = getSelectedDestination(this.#destinations, this.#filteredPoints[i].destination);
      const selectedOffers = getSelectedOffers(offersPoint, this.#filteredPoints[i].offers);

      this.#renderPoint(this.#currentPointState, this.#filteredPoints[i], selectedDestination, this.#destinations, selectedOffers, offersPoint);
    }
  }

  get points() {

    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);

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
    }
    return filteredPoints;
  }

  init = () => {

    // this.#eventPoints = [...this.#pointsModel.points];
    // this.#sourcedBoardPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];


    this.#renderFilter();
    this.#renderSort();
    this.#renderBoard();

  };
}

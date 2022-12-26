import { render, RenderPosition } from '../framework/render.js';
import TripListView from '../view/trip-list.js';
import EmptyListView from '../view/empty-list.js';
import { getSelectedDestination, getSelectedOffers, getOffersByType } from '../utils/point.js';
import PointPresenter from './point-presenter.js';
import { FilterType, PointState, SortType } from '../const.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/trip-sort.js';
import FilterView from '../view/trip-filter.js';
import { sortedPoints } from '../utils/sort.js';
import { generateSortOptions } from '../mosk/sort.js';
import { filterPointsByType } from '../utils/filter.js';


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
  #currentFilterType = FilterType.EVERYTHING;
  #currentPointState = PointState.EDIT;
  #sourcedBoardPoints = [];
  #sortOptions = generateSortOptions();
  #headerContainer = null;
  #filterPointsCount = [];
  #filterComponent = null;
  #filteredPoints = [];


  constructor(headerElement, eventsContainer, filteredPoints, PointsModel, DestinationsModel, OffersModel) {
    this.#pointsModel = PointsModel;
    this.#destinationsModel = DestinationsModel;
    this.#offersModel = OffersModel;
    this.#eventsContainer = eventsContainer;
    this.#headerContainer = headerElement;
    this.#filterPointsCount = filteredPoints;
  }


  #renderPoint = (pointState, point, destination, allDestinations, offers, allOffers) => {

    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventListContainer.element,
      onDataChange: this.#handlePointChange,
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

  #renderFilter() {
    this.#filterComponent = new FilterView({
      filters: this.#filterPointsCount,
      currentFilterType: this.#currentFilterType,
      onFilterChange: this.#handleFilterChange
    });
    this.#filteredPoints = filterPointsByType(this.#eventPoints, FilterType.EVERYTHING);
    render(this.#filterComponent, this.#headerContainer);
  }

  #handleFilterChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }
    this.#filteredPoints = filterPointsByType(this.#eventPoints, filterType);
    this.#currentFilterType = filterType;
    this.#clearPointList();
    this.#renderEvens();
  };

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
    this.#filteredPoints = updateItem(this.#filteredPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);

    const offersPoint = getOffersByType(this.#offers, updatedPoint.type);
    const selectedDestination = getSelectedDestination(this.#destinations, updatedPoint.destination);
    const selectedOffers = getSelectedOffers(offersPoint, updatedPoint.offers);

    this.#pointPresenterMap.get(updatedPoint.id).init(this.#currentPointState, updatedPoint, selectedDestination, this.#destinations, selectedOffers, offersPoint);
  };

  #sortPoints(sortType) {

    switch (sortType) {
      case SortType.DAY:
        this.#filteredPoints = sortedPoints(this.#filteredPoints, SortType.DAY);
        break;
      case SortType.TIME:
        this.#filteredPoints = sortedPoints(this.#filteredPoints, SortType.TIME);
        break;
      case SortType.PRICE:
        this.#filteredPoints = sortedPoints(this.#filteredPoints, SortType.PRICE);
        break;
      case SortType.OFFERS:
        this.#filteredPoints = sortedPoints(this.#filteredPoints, SortType.OFFERS);
        break;
      default:
        this.#filteredPoints = [...this.#sourcedBoardPoints];
    }
    this.#currentSortType = sortType;
  }

  #renderEvens() {
    if (!this.#filteredPoints.length) {
      render(new EmptyListView(), this.#eventsContainer);
      return null;
    }

    render(this.#eventListContainer, this.#eventsContainer);
    //this.#renderEditPoint(PointState.ADD, this.#eventPoints, this.#destinations, this.#offers);

    for (let i = 0; i < this.#filteredPoints.length; i++) {

      const offersPoint = getOffersByType(this.#offers, this.#filteredPoints[i].type);
      const selectedDestination = getSelectedDestination(this.#destinations, this.#filteredPoints[i].destination);
      const selectedOffers = getSelectedOffers(offersPoint, this.#filteredPoints[i].offers);

      this.#renderPoint(this.#currentPointState, this.#filteredPoints[i], selectedDestination, this.#destinations, selectedOffers, offersPoint);
    }
  }

  init = () => {

    this.#eventPoints = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];


    this.#renderFilter();
    this.#renderSort();
    this.#renderEvens();

  };
}

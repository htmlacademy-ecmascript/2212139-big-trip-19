import { remove, render, RenderPosition } from '../framework/render.js';
import TripListView from '../view/trip-list.js';
import EmptyListView from '../view/empty-list.js';
import PointPresenter from './point-presenter.js';
import { BLANK_POINT, FilterType, SortType, TimeLimit, UpdateType, UserAction } from '../const.js';
import SortView from '../view/trip-sort.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortedPoints } from '../utils/sort.js';
import { generateSortOptions } from '../mosk/sort.js';
import { filter } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';


export default class EventsPresenter {

  #eventListContainer = new TripListView();
  #loadingComponent = new LoadingView();
  #filterModel = null;
  #pointsModel = null;
  #eventsContainer = null;
  #pointPresenterMap = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #noPointComponent = null;
  #sortOptions = generateSortOptions();
  #newPointPresenter = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });


  constructor({ tripEventsElement, filterModel,
    pointsModel, onNewPointDestroy }) {

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#eventsContainer = tripEventsElement;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListContainer.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }


  #renderPoint = (point, allDestinations, allOffers) => {

    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventListContainer.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, allDestinations, allOffers);
    this.#pointPresenterMap.set(point.id, pointPresenter);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      sortOption: this.#sortOptions,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#eventListContainer.element, RenderPosition.BEFOREEND);
  };


  createPoint = () => {
    const point = BLANK_POINT;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter
      .init(point, this.destinations, this.offers);
  };

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
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }


  #handleViewAction = async (actionType, updateType, update) => {

    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenterMap.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenterMap.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }

        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenterMap.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenterMap.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {

    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenterMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#eventsContainer);
  };


  #renderNoPoints = () => {
    this.#noPointComponent = new EmptyListView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent,
      this.#eventsContainer);
  };


  #renderBoard = () => {
    render(this.#eventListContainer, this.#eventsContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    if (!points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();

    for (const point of points) {

      this.#renderPoint(point, this.destinations, this.offers,);
    }
  };

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

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init = () => {

    this.#renderBoard();
  };
}

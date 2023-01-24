import TripInfoView from '../view/info-view.js';
import { remove, render, RenderPosition } from '../framework/render';
import { sortedPoints } from '../utils/sort.js';
import { SortType } from '../const.js';

export default class TripInfoPresenter {
  #infoContainer = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor(infoContainer, pointsModel) {
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;

    this.#points = this.#pointsModel.points;
    this.#offers = this.#pointsModel.offers;
    this.#destinations = this.#pointsModel.destinations;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {

    this.#points = sortedPoints(this.#points, SortType.DAY);
    this.#tripInfoComponent = new TripInfoView(this.#points, this.#offers, this.#destinations);

    render(this.#tripInfoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  };

  #handleModelEvent = () => {
    remove(this.#tripInfoComponent);

    this.#points = this.#pointsModel.points;
    this.#destinations = this.#pointsModel.destinations;
    this.#offers = this.#pointsModel.offers;

    this.init();
  };
}

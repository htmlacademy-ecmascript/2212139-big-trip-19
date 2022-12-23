import { render, replace, remove } from '../framework/render.js';
import PointEditView from '../view/trip-point-edit.js';
import PointView from '../view/trip-point.js';

import { isEscKey } from '../utils/point.js';


export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = [];
  #action = false;


  #destination = [];
  #allDestinations = [];
  #offers = [];
  #allOffers = [];


  constructor(pointListContainer) {
    this.#pointListContainer = pointListContainer;
  }

  init(action, point, destination, allDestinations, offers, allOffers) {
    this.#point = point;
    this.#destination = destination;
    this.#allDestinations = allDestinations;
    this.#offers = offers;
    this.#allOffers = allOffers;
    this.#action = action;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(
      this.#point, this.#destination,
      this.#offers, this.#handleEditClick);

    this.#pointEditComponent = new PointEditView(
      this.#action, this.#point, this.#allDestinations,
      this.#allOffers, this.#handleFormSubmit, this.#handleFormClick);

    // проверка = был ли перезаписан объект.
    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };

  #handleFormClick = () => {
    this.#replaceFormToCard();
  };
}

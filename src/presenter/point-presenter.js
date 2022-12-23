import { render, replace } from '../framework/render.js';
import EditPointView from '../view/edit-point.js';
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

    this.#pointComponent = new PointView(
      this.#point, this.#destination,
      this.#offers, this.#handleEditClick);

    this.#pointEditComponent = new EditPointView(
      this.#action, this.#point, this.#allDestinations,
      this.#allOffers, this.#handleFormSubmit, this.#handleFormClick);


    render(this.#pointComponent, this.#pointListContainer);
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

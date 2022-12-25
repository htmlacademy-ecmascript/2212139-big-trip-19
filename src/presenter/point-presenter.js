import { render, replace, remove } from '../framework/render.js';
import PointEditView from '../view/trip-point-edit.js';
import PointView from '../view/trip-point.js';
import { isEscKey } from '../utils/point.js';
import { Mode, PointState } from '../const.js';


export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;
  #action = PointState.EDIT;
  #destination = [];
  #allDestinations = [];
  #offers = [];
  #allOffers = [];
  #handleModeChange = null;
  #handleDataChange = null;
  #mode = Mode.DEFAULT;


  constructor({ eventListContainer, onDataChange, onModeChange }) {
    this.#pointListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      action: this.#action,
      point: this.#point,
      allDestinations: this.#allDestinations,
      allOffers: this.#allOffers,
      onFormSubmit: this.#handleFormSubmit,
      onFormClick: this.#handleFormClick
    });

    // проверка = был ли перезаписан объект.
    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }


  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite });
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

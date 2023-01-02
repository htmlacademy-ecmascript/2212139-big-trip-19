import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getSelectedDestination } from '../utils/point.js';
import { createDestinationTemplate } from './template/destination-template.js';
import { createFormOffersTemplate } from './template/form-offers-template.js';
import { createDestinationInfoTemplate } from './template/destination-info-template.js';
import { createPriceTemplate } from './template/price-template.js';
import { createDatesTemplate } from './template/dates-template.js';
import { createTypesTemplate } from './template/types-template.js';
import { createCloseButtonTemplate } from './template/close-btn-template.js';
import { BLANK_POINT, PointState } from '../const.js';

const createEditPointTemplate = (action, point, destinations, offers) => {
  const { basePrice, dateFrom, dateTo, type, destination, offers: selectedOffersId } = point;

  const isEditPoint = action === PointState.EDIT;

  const initialPrice = basePrice !== null ? basePrice : '';

  const initialDestination = destination !== null ? getSelectedDestination(destinations, destination) : destination;

  const isDestinationInfo = destination !== null;

  const isOffers = offers.length;

  const isOffersAndDestinationInfo = isOffers || isDestinationInfo;

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
        ${createTypesTemplate(type)}

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
          </label>
          ${createDestinationTemplate(destinations, initialDestination)}
        </div>

        ${createDatesTemplate(dateFrom, dateTo)}

        ${createPriceTemplate(initialPrice)}

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isEditPoint ? 'Delete' : 'Cancel'}</button>
        ${isEditPoint ? createCloseButtonTemplate() : ''}
    </header>
    ${isOffersAndDestinationInfo ? `<section class="event__details">
        ${isOffers ? createFormOffersTemplate(offers, selectedOffersId) : ''}
    ${isDestinationInfo ? createDestinationInfoTemplate(initialDestination) : ''}
      </section>` : ''}
  </form>
  </li>`;
};

export default class PointEditView extends AbstractStatefulView {

  #action = null;
  #destinations = [];
  #offers = [];
  #handleFormClick = null;
  #handleFormSubmit = null;


  constructor({ action = 'edit', point = BLANK_POINT, allDestinations, allOffers, onFormSubmit, onFormClick }) {
    super();
    this.#action = action;
    this.#destinations = allDestinations;
    this.#offers = allOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClick = onFormClick;
    this._setState(PointEditView.parsePointToState(point));

    this.#setInnerHandlers();
  }

  get template() {
    return createEditPointTemplate(this.#action, this._state, this.#destinations, this.#offers);
  }

  static parsePointToState = (point) => ({ ...point });

  static parseStateToPoint = (state) => ({ ...state });

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
        offers: []
      });
    }
  };


  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.value) {
      this.updateElement({
        destination: ''
      });
      return;
    }
    const selectedDestination = this.#destinations
      .find((destination) => evt.target.value === destination.name);

    this.updateElement({
      destination: selectedDestination.id
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'INPUT') {
      const currentOfferId = Number(evt.target.dataset.offerId);
      const currentOfferIndex = this._state.offers.indexOf(currentOfferId);

      if (currentOfferIndex === -1) {
        this._state.offers.push(currentOfferId);
        return;
      }

      this._state.offers.splice(currentOfferIndex, 1);
    }
  };

  #formClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  reset = (point) => {
    this.updateElement(PointEditView.parsePointToState(point));
  };
}

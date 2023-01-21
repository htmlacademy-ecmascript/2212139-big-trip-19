import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getOffersByType, getSelectedDestination } from '../utils/point.js';
import { createDestinationTemplate } from './template/destination-template.js';
import { createFormOffersTemplate } from './template/form-offers-template.js';
import { createDestinationInfoTemplate } from './template/destination-info-template.js';
import { createPriceTemplate } from './template/price-template.js';
import { createDatesTemplate } from './template/dates-template.js';
import { createTypesTemplate } from './template/types-template.js';
import { createCloseButtonTemplate } from './template/close-btn-template.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { CITIES } from '../mosk/const.js';
import { priceValidation } from '../utils/validation.js';


const createEditPointTemplate = (point, destinations, offers) => {
  const { basePrice, dateFrom, dateTo, type, destination, offers: selectedOffersId } = point;

  offers = getOffersByType(offers, point.type);

  let isEditPoint = true;

  if (!point.destination) {
    isEditPoint = false;
    point.destination = destinations[0].id;
  }

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

  #destinations = [];
  #offers = [];
  #handleFormClick = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({ point, allDestinations, allOffers, onFormSubmit, onFormClick, onDeleteClick }) {
    super();
    this.#destinations = allDestinations;
    this.#offers = allOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClick = onFormClick;
    this.#handleDeleteClick = onDeleteClick;
    this._setState(PointEditView.parsePointToState(point));

    this.#setInnerHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#offers);
  }

  static parsePointToState = (point) => ({ ...point });

  static parseStateToPoint = (state) => ({ ...state });

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    if (this._state.destination) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#formClickHandler);
    }
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#eventPriceChangeHandler);
    this.#setDateFromPicker();
    this.#setDateToPicker();

    if ((getOffersByType(this.#offers, this._state.type)).length) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#offerChangeHandler);
    }
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
      });
    }
  };


  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    if (CITIES.includes(evt.target.value) && evt.target.value) {
      this.updateElement({
        destination: CITIES.indexOf(evt.target.value),
      });
    } else {
      evt.target.value = '';
    }
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

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  #eventPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this.value = priceValidation(evt.target.value);
    this.updateElement({
      basePrice: priceValidation(evt.target.value),
    });
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  #setDateFromPicker = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        time24hr: true
      }
    );
  };

  #setDateToPicker = () => {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        time24hr: true
      }
    );
  };
}

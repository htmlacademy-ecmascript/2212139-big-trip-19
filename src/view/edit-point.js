import AbstractView from '../framework/view/abstract-view.js';
import { getSelectedDestination, getTodayDate } from '../utils.js';
import { DEFAULT_TRIP_TYPE } from '../const.js';
import { createDestinationTemplate } from './template/destination-template.js';
import { createFormOffersTemplate } from './template/form-offers-template.js';
import { createDestinationInfoTemplate } from './template/destination-info-template.js';
import { createPriceTemplate } from './template/price-template.js';
import { createDatesTemplate } from './template/dates-template.js';
import { createTypesTemplate } from './template/types-template.js';
import { createCloseBtnTemplate } from './template/close-btn-template.js';
import { BLANK_POINT } from '../const.js';

const createEditPointTemplate = (action, point, destinations, offers) => {
  const { basePrice, dateFrom, dateTo, type, destination, offers: selectedOffersId } = point;

  const isEdit = action === 'edit';

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
        <button class="event__reset-btn" type="reset">Cancel</button>
        ${isEdit ? createCloseBtnTemplate() : ''}
    </header>
    ${isOffersAndDestinationInfo ? `<section class="event__details">
        ${isOffers ? createFormOffersTemplate(offers, selectedOffersId) : ''}
    ${isDestinationInfo ? createDestinationInfoTemplate(initialDestination) : ''}
      </section>` : ''}
  </form>
  </li>`;
};

export default class EditPointView extends AbstractView {

  #action = null;
  #point = null;
  #destinations = [];
  #offers = [];
  #handleFormSubmit = null;

  constructor(action, point = BLANK_POINT, destinations, offers, { onFormSubmit }) {
    super();
    this.#action = action;
    this.#handleFormSubmit = onFormSubmit;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#point = this.#action !== 'add'
      ? point
      : {
        basePrice: null,
        dateFrom: getTodayDate(),
        dateTo: getTodayDate(),
        destination: null,
        offers: [],
        type: DEFAULT_TRIP_TYPE,
      };

    this.element.querySelector('.event__rollup-btn').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditPointTemplate(this.#action, this.#point, this.#destinations, this.#offers);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}

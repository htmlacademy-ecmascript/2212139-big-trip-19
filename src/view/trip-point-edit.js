import AbstractView from '../framework/view/abstract-view.js';
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

export default class PointEditView extends AbstractView {

  #action = null;
  #point = null;
  #destinations = [];
  #offers = [];
  #handleFormClick = null;
  #handleFormSubmit = null;

  constructor({ action = 'edit', point = BLANK_POINT, allDestinations, allOffers, onFormSubmit, onFormClick }) {
    super();
    this.#action = action;
    this.#point = point;
    this.#destinations = allDestinations;
    this.#offers = allOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClick = onFormClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formClickHandler);

    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditPointTemplate(this.#action, this.#point, this.#destinations, this.#offers);
  }


  #formClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClick(this.#point);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };
}

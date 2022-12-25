import AbstractView from '../framework/view/abstract-view.js';


const renderSortOptionsTemplate = (options, currentSortType) =>
  options
    .map(
      (option) =>
        `<div class="trip-sort__item  trip-sort__item--${option.name}">
          <input id="sort-${option.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${option.name}" ${option.name === currentSortType ? 'checked' : ''} ${option.disabled ? 'disabled' : ''}>
          <label class="trip-sort__btn" id=${option.name} for="sort-${option.name}">${option.name}</label>
        </div>`
    )
    .join('');

const createSortTemplate = (options, currentSortType) =>
  `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${renderSortOptionsTemplate(options, currentSortType)}
  </form>`;

export default class SortView extends AbstractView {

  #handleSortTypeChange = null;
  #options = null;
  #currentSortType = null;

  constructor({ sortOption, currentSortType, onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#options = sortOption;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#options, this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {

    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.id);
  };
}

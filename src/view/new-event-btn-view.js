import AbstractView from '../framework/view/abstract-view.js';

const createNewEventButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewEventButtonView extends AbstractView {
  #handleNewEventButtonClick = null;

  constructor({ onNewEventButtonClick }) {
    super();
    this.#handleNewEventButtonClick = onNewEventButtonClick;
    this.element.addEventListener('click', this.#newEventButtonClickHandler);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  #newEventButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleNewEventButtonClick();
  };
}

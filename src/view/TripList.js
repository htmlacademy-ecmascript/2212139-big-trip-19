import { createElement } from '../render.js';

function createListTemplate() {
  return '<div class="trip-events__list"></div>';
}

export default class TripListView {
  getTemplate() {
    return createListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

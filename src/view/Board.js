import { createElement } from '../render.js';

function createBoardTemplate() {
  return '<div class="page-body__container"></div>';
}

export default class BoardView {
  getTemplate() {
    return createBoardTemplate();
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

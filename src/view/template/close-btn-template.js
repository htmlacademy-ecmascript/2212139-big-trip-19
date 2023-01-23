export const createCloseButtonTemplate = (isEditPoint) =>
  `<button class="event__rollup-btn ${isEditPoint ? '' : 'event__rollup-btn-hidden'}" type="button" >
    <span class="visually-hidden">Open event</span>
  </button>`;

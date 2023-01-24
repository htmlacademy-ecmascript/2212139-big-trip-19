import { POINT_TYPES } from '../../const';

const POINT_TYPES_UP = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const renderTypeOptions = (options, currentOption) =>
  options
    .map(
      (option, index) =>
        `<div class="event__type-item">
            <input id="event-type-${option}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${option} ${currentOption === option ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${option}" for="event-type-${option}-1">${POINT_TYPES_UP[index]}</label>
        </div>`
    )
    .join('');

export const createTypesTemplate = (type, isDisabled) =>
  `<div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

    <div class="event__type-list">
        <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${renderTypeOptions(POINT_TYPES, type)}
        </fieldset>
    </div>
  </div>`;

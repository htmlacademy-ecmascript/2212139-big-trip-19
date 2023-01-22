import he from 'he';

const renderDestinationOptionsTemplate = (options) => {
  if (!options.length) {
    return '';
  }
  return options.map((option) => `<option value=${option.name}></option>`).join('');
};

export const createDestinationTemplate = (destinations, initialDestination, isDisabled) => {

  const destinationName = initialDestination !== null ? initialDestination.name : '';

  return `<input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-1">
          <datalist id="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            ${renderDestinationOptionsTemplate(destinations)}
          </datalist>`;
};



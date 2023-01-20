import { PRICE_PATTERN } from '../const.js';

const priceValidation = (value) => {

  let currentValue = value.replace(PRICE_PATTERN, '');

  if (currentValue < 0) {
    currentValue = Math.abs(currentValue);
  }
  currentValue = +currentValue;
  return currentValue;
};

const checkDestination = (name, destinations) =>
  destinations.find((elem) => elem.name === name);

export { priceValidation, checkDestination };

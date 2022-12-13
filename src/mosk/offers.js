import { getRandomInteger, getRandomArrayElement } from '../utils.js';
import { titles, OfferPrice, MAX_OFFERS_COUNT } from './const.js';
import { POINT_TYPES } from '../const.js';

const generateOffer = (id) => ({
  id: ++id,
  title: getRandomArrayElement(titles),
  price: getRandomInteger(OfferPrice.MIN, OfferPrice.MAX),
});

const getOffers = () => {
  const offersSet = new Set();
  for (let i = 0; i < MAX_OFFERS_COUNT; i++) {
    offersSet.add(generateOffer(i));
  }
  return Array.from(offersSet);
};

const getOffersByTypes = () => {

  const offers = [];

  for (const type of POINT_TYPES) {
    offers.push({
      type,
      offers: getRandomInteger(0, 4) ? getOffers() : [],
    });
  }
  return offers;
};

export { getOffersByTypes };

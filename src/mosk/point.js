import dayjs from 'dayjs';
import { getRandomInteger, getRandomArrayElement, getOffersByType } from '../utils.js';
import { POINT_TYPES } from '../const.js';
import { destinations } from './destination.js';
import { offers } from './offers.js';
import { PointPrice, DaysRange, HoursRange } from './const.js';

const getRandomDate = () => dayjs()
  .add(getRandomInteger(DaysRange.MIN, DaysRange.MAX), 'day')
  .add(getRandomInteger(HoursRange.MIN, HoursRange.MAX), 'hour');

const getPrice = () => getRandomInteger(PointPrice.MIN, PointPrice.MAX);

const getDates = () => {
  const date1 = getRandomDate();
  const date2 = getRandomDate();

  if (date2.isAfter(date1)) {
    return {
      dateFrom: date1.toISOString(),
      dateTo: date2.toISOString(),
    };
  }
  return {
    dateFrom: date2.toISOString(),
    dateTo: date1.toISOString(),
  };
};

const getDestinationId = () => getRandomArrayElement(destinations).id;

const getOfferIds = (type) => {
  const offersByType = getOffersByType(offers, type);
  if (!offersByType.length) {
    return [];
  }
  const randomOffers = offersByType.slice(0, getRandomInteger(1, offersByType.length));
  const ids = randomOffers.map((offer) => offer.id);
  return ids;
};

const getType = () => getRandomArrayElement(POINT_TYPES);

const getPoint = () => {
  const randomType = getType();
  const randomDates = getDates();

  return {
    basePrice: getPrice(),
    dateFrom: randomDates.dateFrom,
    dateTo: randomDates.dateTo,
    destination: getDestinationId(),
    offers: getOfferIds(randomType),
    type: randomType,
  };
};

export { getPoint };

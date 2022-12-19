import dayjs from 'dayjs';
import { getRandomInteger, getRandomArrayElement } from '../utils/common.js';
import { getOffersByType } from '../utils/point.js';
import { POINT_TYPES } from '../const.js';
import { getDestinations } from './destination.js';
import { getOffersByTypes } from './offers.js';
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

const getDestinationId = () => getRandomArrayElement(getDestinations()).id;

const getOfferIds = (type) => {
  const offersByType = getOffersByType(getOffersByTypes(), type);
  if (!offersByType.length) {
    return [];
  }
  const randomOffers = offersByType.slice(getRandomInteger(0, offersByType.length / 2 - 1), getRandomInteger(offersByType.length / 2, offersByType.length));
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
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

export { getPoint };

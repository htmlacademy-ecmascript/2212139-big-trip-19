import dayjs from 'dayjs';
import { require } from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const getRandomInteger = (a, b) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

const getTodayDate = () => dayjs().toISOString();

const humanizeDate = (date) => dayjs(date).format('MMM D');

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

const formatTime = (date) => dayjs(date).format('HH:mm');

const formatFormDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const durationDate = (startDate, endDate) => {

  const duration = require('dayjs/plugin/duration');
  dayjs.extend(duration);

  const durationTime = dayjs(endDate).diff(startDate);
  const durationTimeInHour = dayjs(endDate).diff(startDate, 'hour');
  let durationFormat = 'DD[D] HH[H] mm[M]';

  if (durationTimeInHour < 1) {
    durationFormat = 'mm[M]';
  }
  if (durationTimeInHour >= 1 && durationTimeInHour < 24) {
    durationFormat = 'HH[H] mm[M]';
  }

  return dayjs.duration(durationTime).format(durationFormat);
};

const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type).offers;

const getSelectedDestination = (destinations, destinationId) => destinations.find((item) => item.id === destinationId);

const getSelectedOffers = (offers, offersIds) => offers.filter((item) => offersIds.some((offerId) => offerId === item.id));

const isOfferIsSelected = (offerId, selectedOffersIds) => selectedOffersIds.includes(offerId);


export {
  getRandomArrayElement, getRandomInteger,
  getTodayDate, humanizeDate,
  formatTime, formatFormDate,
  formatDate, durationDate,
  getOffersByType, getSelectedDestination,
  getSelectedOffers, isOfferIsSelected
};

import dayjs from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const getRandomInteger = (a, b) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

const humanizeDate = (dueDate) => dayjs(dueDate).format('MMM D');

const humanizeTime = (dueDate) => dayjs(dueDate).format('HH:mm');

const humanizeDateAndTime = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');

const humanizeDurationTime = (startDate, endDate) => {

  const duration = dayjs.require('dayjs/plugin/duration');
  dayjs.extend(duration);

  const durationTime = dayjs(endDate).diff(startDate);
  const durationTimeInHour = dayjs(endDate).diff(startDate, 'hour');

  if (durationTimeInHour < 1) {
    return dayjs.duration(durationTime).format('mm[M]');
  }
  if (durationTimeInHour >= 1 && durationTime < 24) {
    return dayjs.duration(durationTime).format('HH[H] mm[M]');
  }
  if (durationTimeInHour >= 24) {
    return dayjs.duration(durationTime).format('DD[D] HH[H] mm[M]');
  }
  return null;
};

const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type).offers;

const getSelectedDestination = (destinations, destinationId) => destinations.find((item) => item.id === destinationId);

const getSelectedOffers = (offers, offersIds) => offers.filter((item) => offersIds.some((offerId) => offerId === item.id));

const isOfferIsSelected = (offerId, selectedOffersIds) => selectedOffersIds.includes(offerId);


export {getRandomArrayElement, getRandomInteger,
  humanizeDate as humanizePointDueDate, humanizeTime as humanizePointDueTime,
  humanizeDurationTime as humanizePointDurationTime, humanizeDateAndTime as humanizePointDueDateAndTime,
  getOffersByType, getSelectedDestination,
  getSelectedOffers, isOfferIsSelected};

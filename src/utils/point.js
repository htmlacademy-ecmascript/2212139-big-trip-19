import dayjs from 'dayjs';

const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type).offers;

const getSelectedDestination = (destinations, destinationId) => destinations.find((item) => item.id === destinationId);

const getSelectedOffers = (offers, offersIds) => offers.filter((item) => offersIds.some((offerId) => offerId === item.id));

const isOfferIsSelected = (offerId, selectedOffersIds) => selectedOffersIds.includes(offerId);

const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const isStartDateNotExpired = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());

const isEndDateNotExpired = (dateTo) => dayjs(dateTo).isAfter(dayjs());

const isFutureEvent = (dateFrom, dateTo) => isStartDateNotExpired(dateFrom) || isEndDateNotExpired(dateTo);

function isPresentEvent(dueDate) {
  return dueDate && dayjs(dueDate).isSame(dayjs(), 'D');
}

export {
  isEscKey, getOffersByType, getSelectedDestination, isPresentEvent,
  getSelectedOffers, isOfferIsSelected, isFutureEvent
};

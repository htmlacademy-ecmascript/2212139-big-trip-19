
const getOffersByType = (offers, type) => offers.find((offer) => offer.type === type).offers;

const getSelectedDestination = (destinations, destinationId) => destinations.find((item) => item.id === destinationId);

const getSelectedOffers = (offers, offersIds) => offers.filter((item) => offersIds.some((offerId) => offerId === item.id));

const isOfferIsSelected = (offerId, selectedOffersIds) => selectedOffersIds.includes(offerId);

const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {
  isEscKey, getOffersByType, getSelectedDestination,
  getSelectedOffers, isOfferIsSelected
};

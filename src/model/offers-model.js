import { getOffersByTypes } from '../mosk/offers.js';
import { getOffersByType } from '../utils.js';

export default class OffersModel {
  offers = getOffersByTypes();

  get = (type) => getOffersByType(this.offers, type);
}

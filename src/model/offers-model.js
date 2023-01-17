import { getOffersByTypes } from '../mosk/offers.js';
import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {

  #offers = getOffersByTypes();

  get offers() {
    return this.#offers;
  }
}

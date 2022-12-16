import { getDestinations } from '../mosk/destination.js';


export default class DestinationsModel {

  #destinations = getDestinations();

  get destinations() {
    return this.#destinations;
  }
}

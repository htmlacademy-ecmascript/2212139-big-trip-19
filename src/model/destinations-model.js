import { getDestinations } from '../mosk/destination.js';
import Observable from '../framework/observable.js';


export default class DestinationsModel extends Observable {

  #destinations = getDestinations();

  get destinations() {
    return this.#destinations;
  }
}

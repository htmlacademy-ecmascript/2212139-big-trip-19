import { getDestinations } from '../mosk/destination.js';


export default class DestinationsModel {
  destinations = getDestinations();

  get = () => this.destinations;
}

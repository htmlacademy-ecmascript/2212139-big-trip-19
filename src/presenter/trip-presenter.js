import { render } from '../render.js';
import TripListView from '../view/trip-list.js';
import EditPointView from '../view/edit-point.js';
import PointView from '../view/trip-point.js';
import { DEFAULT_TRIP_TYPE } from '../const.js';
import { getSelectedDestination, getSelectedOffers } from '../utils.js';

export default class EventsPresenter {
  eventListContainer = new TripListView();

  createEventItem = (element, eventList, ...args) => {
    render(new element(...args), eventList.getElement());
  };

  init = (eventsContainer, PointsModel, DestinationsModel, OffersModel) => {
    this.eventsContainer = eventsContainer;
    this.eventPoints = [...PointsModel.get()];
    this.destinations = [...DestinationsModel.get()];
    this.offers = [...OffersModel.get(DEFAULT_TRIP_TYPE)];

    render(this.eventListContainer, this.eventsContainer);
    this.createEventItem(EditPointView, this.eventListContainer, null, this.destinations, this.offers);

    for (let i = 0; i < this.eventPoints.length; i++) {

      this.offers = [...OffersModel.get(this.eventPoints[i].type)];

      const selectedDestination = getSelectedDestination(this.destinations, this.eventPoints[i].destination);
      const selectedOffers = getSelectedOffers(this.offers, this.eventPoints[i].offers);

      this.createEventItem(PointView, this.eventListContainer, this.eventPoints[i], selectedDestination, selectedOffers);
      this.createEventItem(EditPointView, this.eventListContainer, this.eventPoints[i], this.destinations, this.offers);
    }
  };
}

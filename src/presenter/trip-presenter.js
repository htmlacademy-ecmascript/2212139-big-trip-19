import { render } from '../render.js';
import TripListView from '../view/trip-list.js';
import EditPointView from '../view/edit-point.js';
import TripItemView from '../view/trip-item.js';
import PointView from '../view/trip-point.js';
import { DEFAULT_TRIP_TYPE } from '../const.js';
import { getSelectedDestination, getSelectedOffers } from '../utils.js';

export default class EventsPresenter {
  eventListComponent = new TripListView();

  createEventItem = (element, eventList, ...args) => {
    const eventItemComponent = new TripItemView();
    render(eventItemComponent, eventList.getElement());
    render(new element(...args), eventItemComponent.getElement());
  };

  init = (eventsContainer, PointsModel, DestinationsModel, OffersModel) => {
    this.eventsContainer = eventsContainer;
    this.eventPoints = [...PointsModel.get()];
    this.destinations = [...DestinationsModel.get()];
    this.offers = [...OffersModel.get(DEFAULT_TRIP_TYPE)];

    render(this.eventListComponent, this.eventsContainer);
    this.createEventItem(EditPointView, this.eventListComponent, null, this.destinations, this.offers);

    for (let i = 0; i < this.eventPoints.length; i++) {

      this.offers = [...OffersModel.get(this.eventPoints[i].type)];

      const selectedDestination = getSelectedDestination(this.destinations, this.eventPoints[i].destination);
      const selectedOffers = getSelectedOffers(this.offers, this.eventPoints[i].offers);

      this.createEventItem(PointView, this.eventListComponent, this.eventPoints[i], selectedDestination, selectedOffers);
      this.createEventItem(EditPointView, this.eventListComponent, this.eventPoints[i], this.destinations, this.offers);
    }
  };
}

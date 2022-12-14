import { render } from '../render.js';
import TripListView from '../view/trip-list.js';
import EditPointView from '../view/edit-point.js';
import PointView from '../view/trip-point.js';
import EmptyListView from '../view/empty-list.js';
import { DEFAULT_TRIP_TYPE, PointState } from '../const.js';
import { getSelectedDestination, getSelectedOffers, getOffersByType } from '../utils.js';

export default class EventsPresenter {

  #eventListContainer = new TripListView();
  #pointsModel = [];
  #destinationsModel = [];
  #offersModel = [];
  #eventsContainer = null;
  #eventPoints = [];
  #destinations = [];
  #offers = [];

  constructor(eventsContainer, PointsModel, DestinationsModel, OffersModel) {
    this.#pointsModel = PointsModel;
    this.#destinationsModel = DestinationsModel;
    this.#offersModel = OffersModel;
    this.#eventsContainer = eventsContainer;
  }


  #renderEditPoint = (pointState, point, destinations, offers) => {
    // const listItemComponent = new EventItemView();
    const pointEditComponent = new EditPointView(pointState, point, destinations, getOffersByType(offers, DEFAULT_TRIP_TYPE));
    render(pointEditComponent, this.#eventListContainer.element);
  };

  #renderPoints = (points, destinations, offers) => {
    for (let i = 0; i < points.length; i++) {
      const offersPoint = getOffersByType(offers, points[i].type);
      const selectedDestination = getSelectedDestination(destinations, points[i].destination);
      const selectedOffers = getSelectedOffers(offersPoint, points[i].offers);

      const pointViewComponent = new PointView(points[i], selectedDestination, selectedOffers);
      render(pointViewComponent, this.#eventListContainer.element);

    }
  };

  #renderEvens() {
    if (!this.#eventPoints.length) {
      render(new EmptyListView(), this.#eventsContainer);
      return null;
    }

    render(this.#eventListContainer, this.#eventsContainer);

    this.#renderEditPoint(PointState.ADD, null, this.#destinations, this.#offers);

    this.#renderPoints(this.#eventPoints, this.#destinations, this.#offers);

  }


  init = () => {

    this.#eventPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];


    this.#renderEvens();

  };
}

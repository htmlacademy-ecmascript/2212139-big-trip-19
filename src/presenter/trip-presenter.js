import { render } from '../render.js';
import TripListView from '../view/trip-list.js';
import SortView from '../view/trip-sort.js';
import EditPointView from '../view/edit-point.js';
import PointView from '../view/trip-point.js';
import FilterView from '../view/trip-filter.js';
import NewPointView from '../view/new-point.js';
import TripItemView from '../view/trip-item.js';
import { DEFAULT_TRIP_TYPE } from '../const.js';


export default class TripPresenter {

  tripListComponent = new TripListView();

  constructor({ boardContainer, filterContainer }) {
    this.boardContainer = boardContainer;
    this.filterContainer = filterContainer;
  }

  createEventItem = (element, eventList, ...args) => {
    const eventItemComponent = new TripItemView();
    render(eventItemComponent, eventList.getElement());
    render(new element(...args), eventItemComponent.getElement());
  };

  init(PointsModel, OffersModel, DestinationModel) {
    this.pointsModel = PointsModel;
    this.offersModel = OffersModel;
    this.destinationModel = DestinationModel;
    this.eventPoints = [...this.pointsModel.get()];
    this.destinations = [...this.destinationModel.get()];
    this.offers = [...this.offersModel.get(DEFAULT_TRIP_TYPE)];

    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.boardContainer);
    render(this.tripListComponent, this.boardContainer);
    //render(new EditPointView(), this.tripListComponent.getElement());
    //render(new NewPointView(), this.tripListComponent.getElement());
    this.createEventItem(EditPointView, this.tripListComponent, null, this.destinations, this.offers);

    // for (let i = 0; i < this.eventPoints.length; i++) {
    //   render(new PointView(this.eventPoints[i], this.destinations[i], this.offers[i]), this.tripListComponent.getElement());
    // }
  }
}

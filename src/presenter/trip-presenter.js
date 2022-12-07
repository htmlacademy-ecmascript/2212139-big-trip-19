import { render } from '../render.js';
import TripListView from '../view/trip-list.js';
import SortView from '../view/trip-sort.js';
import EditPointView from '../view/edit-point.js';
import PointView from '../view/trip-point.js';
import FilterView from '../view/trip-filter.js';
import NewPointView from '../view/new-point.js';

export default class TripPresenter {
  MAX_POINT_COUNT = 3;
  tripListComponent = new TripListView();

  constructor({ boardContainer, filterContainer }) {
    this.boardContainer = boardContainer;
    this.filterContainer = filterContainer;
  }

  init() {
    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.boardContainer);
    render(this.tripListComponent, this.boardContainer);
    render(new EditPointView(), this.tripListComponent.getElement());
    render(new NewPointView(), this.tripListComponent.getElement());

    for (let i = 0; i < this.MAX_POINT_COUNT; i++) {
      render(new PointView(), this.tripListComponent.getElement());
    }
  }
}

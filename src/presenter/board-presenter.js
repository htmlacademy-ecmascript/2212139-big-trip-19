import { render } from '../render.js';
import TripListView from '../view/TripList.js';
import SortView from '../view/Sort.js';
import EditPointView from '../view/EditPoint.js';
import PointView from '../view/Point.js';
import BoardView from '../view/Board.js';

export default class BoardPresenter {
  MAX_POINT_COUNT = 3;
  boardComponent = new BoardView();
  tripListComponent = new TripListView();

  constructor({ boardContainer }) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.tripListComponent, this.boardComponent.getElement());
    render(new EditPointView(), this.tripListComponent.getElement());

    for (let i = 0; i < this.MAX_POINT_COUNT; i++) {
      render(new PointView(), this.tripListComponent.getElement());
    }
  }
}

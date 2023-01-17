import { getPoint } from '../mosk/point.js';
import { POINTS_COUNT } from '../const.js';
import Observable from '../framework/observable.js';


export default class PointsModel extends Observable {
  #points = Array.from({ length: POINTS_COUNT }, getPoint);

  get points() {
    return this.#points;
  }
}

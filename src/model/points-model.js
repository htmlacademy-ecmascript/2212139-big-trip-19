import { getPoint } from '../mosk/point.js';
import { POINTS_COUNT } from '../const.js';


export default class PointsModel {
  points = Array.from({ length: POINTS_COUNT }, getPoint);

  get = () => this.points;
}

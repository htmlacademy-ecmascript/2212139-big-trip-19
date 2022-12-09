import { getPoint } from '../mosk/point.js';

const POINT_COUNT = 10;

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, getPoint);

  getPoints() {
    return this.points;
  }
}

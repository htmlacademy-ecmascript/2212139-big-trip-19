import { FilterType } from '../const';
import { isFutureEvent, isPresentEvent, isPastEvent } from './date.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureEvent(point.dateFrom, point.dateTo)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentEvent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastEvent(point.dateFrom, point.dateTo)),
};

const filterPointsByType = (points, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return points.filter((point) => isFutureEvent(point.dateFrom, point.dateTo));
    case FilterType.PRESENT:
      return points.filter((point) => isPresentEvent(point.dateFrom, point.dateTo));
    case FilterType.PAST:
      return points.filter((point) => isPastEvent(point.dateFrom, point.dateTo));
    default:
      return points;
  }
};

export { filter, filterPointsByType };

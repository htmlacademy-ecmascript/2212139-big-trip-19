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
    case filterType.EVERYTHING:
      return points;
    case filterType.FUTURE:
      return points.filter((point) => isFutureEvent(point.dateFrom, point.dateTo));
    case filterType.PRESENT:
      return points.filter((point) => isPresentEvent(point.dateFrom, point.dateTo));
    case filterType.PAST:
      return points.filter((point) => isPastEvent(point.dateFrom, point.dateTo));
    default:
      return points;
  }
};

export { filter, filterPointsByType };

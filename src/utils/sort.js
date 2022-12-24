import { SortType } from '../const.js';
import dayjs from 'dayjs';
import { durationDate } from './date.js';


const options = {
  [SortType.DAY]: () => false,
  [SortType.EVENT]: () => true,
  [SortType.TIME]: () => false,
  [SortType.PRICE]: () => false,
  [SortType.OFFERS]: () => false,
};


const sortedPoints = (points, sortType) => {
  switch (sortType) {
    case SortType.DAY:
      return points.sort((pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)));
    case SortType.TIME:
      return points.sort((pointA, pointB) => durationDate(pointA.dateFrom, pointA.dateTo)
        .diff(durationDate(pointB.dateFrom, pointB.dateTo)));
    case SortType.OFFERS:
      return points.sort((pointA, pointB) => pointA.offers.length - pointB.offers.length);
    case SortType.PRICE:
      return points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice);
    default:
      return points;
  }
};


export { sortedPoints, options };

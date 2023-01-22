import { SortType } from '../const.js';
import dayjs from 'dayjs';


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
      return points.sort((pointA, pointB) => dayjs(pointB.dateFrom).diff(dayjs(pointA.dateFrom)));
    case SortType.TIME:
      return points.sort((pointA, pointB) =>
        dayjs(pointB.dateTo).diff(pointB.dateFrom) - dayjs(pointA.dateTo).diff(pointA.dateFrom));
    case SortType.OFFERS:
      return points.sort((pointA, pointB) => pointB.offers.length - pointA.offers.length);
    case SortType.PRICE:
      return points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice);
    default:
      return points;
  }
};


export { sortedPoints, options };

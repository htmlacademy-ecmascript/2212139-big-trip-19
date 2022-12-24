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
    case 'day':
      return points.sort((pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)));
    case 'time':
      return points.sort((pointA, pointB) =>
        dayjs(pointA.dateTo).diff(pointA.dateFrom) - dayjs(pointB.dateTo).diff(pointB.dateFrom));
    case 'offers':
      return points.sort((pointA, pointB) => pointA.offers.length - pointB.offers.length);
    case 'price':
      return points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice);
    default:
      return points;
  }
};


export { sortedPoints, options };

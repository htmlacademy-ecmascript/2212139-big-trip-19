import { sortOptions } from '../utils/sort.js';

const generateSort = (points) =>
  Object.entries(sortOptions).map(([optionName, filterPoints]) => ({
    name: optionName,
    sortedPoints: filterPoints(points),
  }));

export { generateSort };

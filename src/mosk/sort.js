import { sortOptions } from '../utils/sort.js';

const generateSortOptions = (points) =>
  Object.entries(sortOptions).map(([optionName, filterPoints]) => ({
    name: optionName,
    sortedPoints: filterPoints(points),
  }));

export { generateSortOptions };

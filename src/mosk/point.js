import { getRandomArrayElement } from '../utils.js';

const mockPoints = [{}];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export { getRandomPoint };

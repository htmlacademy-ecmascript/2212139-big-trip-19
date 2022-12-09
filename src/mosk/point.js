import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import {getOffers} from './offers.js';

const RANGE_PHOTOS = 100;

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget',
  'Fusce tristique felis at fermentum pharetra',
  'Aliquam id orci ut lectus varius viverra',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
  'Sed sed nisi sed augue convallis suscipit in sed felis',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus',
  'Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it renowned for its skiing',
];

const getPointType = () => {
  const typePoints = [
    ('Taxi',
    'Bus',
    'Train',
    'Ship',
    'Drive',
    'Flight',
    'Check-in',
    'Sightseeing',
    'Restaurant'),
  ];

  return typePoints[getRandomArrayElement(typePoints.length)];
};

const getCity = () => {
  const cityNames = ['Chamonix', 'Geneva', 'Amsterdam', 'Prague'];
  return cityNames[getRandomArrayElement[cityNames.length]];
};

const getDescription = () =>
  DESCRIPTIONS[getRandomArrayElement[DESCRIPTIONS.length]];

const getDestination = (isEmpty) => {
  const destination = { description: isEmpty
    ? null
    : Array.from({ length: getRandomArrayElement(DESCRIPTIONS.length) },
      getDescription ).join('.'),
  name: getCity(),
  pictures: isEmpty
    ? null
    : [{ src: `http://picsum.photos/248/152?r=${getRandomArrayElement( RANGE_PHOTOS )}`,
      description: Array.from({ length: getRandomArrayElement(DESCRIPTIONS.length) },
        getDescription ).join('.'),},
    { src: `http://picsum.photos/248/152?r=${getRandomArrayElement( RANGE_PHOTOS )}`,
      description: Array.from({ length: getRandomArrayElement(DESCRIPTIONS.length) },
        getDescription ).join('.'),},
    { src: `http://picsum.photos/248/152?r=${getRandomArrayElement( RANGE_PHOTOS )}`,
      description: Array.from({ length: getRandomArrayElement(DESCRIPTIONS.length) },
        getDescription ).join('.'),},
    { src: `http://picsum.photos/248/152?r=${getRandomArrayElement( RANGE_PHOTOS )}`,
      description: Array.from({ length: getRandomArrayElement(DESCRIPTIONS.length) },
        getDescription ).join('.'),},
    { src: `http://picsum.photos/248/152?r=${getRandomArrayElement( RANGE_PHOTOS )}`,
      description: Array.from({ length: getRandomArrayElement(DESCRIPTIONS.length) },
        getDescription ).join('.'),},
    { src: `http://picsum.photos/248/152?r=${getRandomArrayElement( RANGE_PHOTOS )}`,
      description: Array.from({ length: getRandomArrayElement(DESCRIPTIONS.length) },
        getDescription ).join('.'),},
    ],
  };
  return destination;
};

const transformPoint = (point) => ({
  basePrice: point['basePrice'],
  dateFrom: point['dateFrom'],
  dateTo: point['dateTo'],
  destination: point['destination'],
  id: point['id'],
  isFavorite: point['isFavorite'],
  offers: point['offers'],
  type: point['type'],
});

const generatePoint = () => {
  const type = getPointType();
  const point = {
    basePrice: getRandomInteger(5, 500),
    dateFrom: `2022-07-${getRandomInteger(10, 11)}T22:${getRandomInteger(10, 59)}:56.845Z`,
    dateTo: `2022-07-${getRandomInteger(13, 14)}T11:${getRandomInteger( 10, 59)}:13.375Z`,
    destination: getDestination(getRandomInteger(0, 1)),
    id: '0',
    isFavorite: getRandomInteger(0, 1),
    offers: getOffers(type),
    type: type,
  };
  return transformPoint(point);
};

export {generatePoint};

import { descriptions, names, MAX_DESTINATIONS_COUNT } from './const.js';
import { getRandomInteger, getRandomArrayElement } from '../utils/common.js';


const getPhotos = () => {
  const count = getRandomInteger(1, 6);
  const photos = [];
  for (let i = 0; i < count; i++) {
    photos.push(
      {
        src: `http://picsum.photos/248/152?r=${Math.random()}`,
        description: getRandomArrayElement(descriptions),
      });
  }
  return photos;
};

const generateDestination = (id) => ({
  id: ++id,
  description: getRandomArrayElement(descriptions),
  name: getRandomArrayElement(names),
  pictures: getPhotos(),
});


const getDestinations = () => {
  const destinationsSet = new Set();
  for (let i = 0; i < MAX_DESTINATIONS_COUNT; i++) {
    destinationsSet.add(generateDestination(i));
  }
  return Array.from(destinationsSet);
};

export { getDestinations };

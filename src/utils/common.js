function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const getRandomInteger = (a, b) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}
export { getRandomArrayElement, getRandomInteger, updateItem };

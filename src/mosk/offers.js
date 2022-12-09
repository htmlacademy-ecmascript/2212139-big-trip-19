import {getRandomInteger} from '../utils.js';

const offers = [
  {
    'id': 1,
    'title': 'Upgrade to a business class',
    'price': 120
  },
  {
    'id': 2,
    'title': 'Choose the radio station',
    'price': 60
  },
  {
    'id': 3,
    'title': 'Add luggage',
    'price': 50
  },
  {
    'id': 4,
    'title': 'Switch to comfort',
    'price': 80
  },
  {
    'id': 5,
    'title': 'Add meal',
    'price': 15
  },
];

const getRandomOffersId = () => {
  const randomOffersId = [];
  if(offers && offers.length) {
    for (const offer of offers) {
      if (getRandomInteger(0, 1)) {
        randomOffersId.push(offer.id);
      }
    }
  }
  return randomOffersId;
};

const getOffers = (type) => ({ 'type': type,
  'offers': getRandomInteger(0, 1) ? null : getRandomOffersId(),
});

export {offers, getOffers};

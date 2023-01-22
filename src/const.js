import { getTodayDate } from './utils/date.js';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const POINTS_COUNT = 5;

const DEFAULT_TRIP_TYPE = 'taxi';

const FormType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};


const BLANK_POINT = {
  basePrice: '',
  dateFrom: getTodayDate(),
  dateTo: getTodayDate(),
  destination: null,
  offers: [],
  type: DEFAULT_TRIP_TYPE,
  isFavorite: false,
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};


const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const PRICE_PATTERN = /[\D]+/g;

const INVALID_DESTINATION = 'Please select a destination from the following list';


export {
  POINT_TYPES, POINTS_COUNT, DEFAULT_TRIP_TYPE, UserAction,
  BLANK_POINT, SortType, FilterType, Mode, UpdateType, INVALID_DESTINATION,
  PRICE_PATTERN, FormType
};

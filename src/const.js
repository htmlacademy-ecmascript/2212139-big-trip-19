import { getTodayDate } from './utils/date.js';

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const POINTS_COUNT = 5;

const DEFAULT_TRIP_TYPE = 'taxi';

const PointState = {
  EDIT: 'edit',
  ADD: 'add',
};

const BLANK_POINT = {
  basePrice: null,
  dateFrom: getTodayDate(),
  dateTo: getTodayDate(),
  destination: null,
  offers: [],
  type: DEFAULT_TRIP_TYPE,
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

export { POINT_TYPES, POINTS_COUNT, DEFAULT_TRIP_TYPE, PointState, BLANK_POINT, SortType, FilterType };

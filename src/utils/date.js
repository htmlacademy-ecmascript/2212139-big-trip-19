import dayjs from 'dayjs';
import { require } from 'dayjs';

const HOUR = 1;
const DAY = 24;


const getTodayDate = () => dayjs().toISOString();

const humanizeDate = (date) => dayjs(date).format('MMM D');

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

const formatTime = (date) => dayjs(date).format('HH:mm');

const formatFormDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const durationDate = (startDate, endDate) => {

  const duration = require('dayjs/plugin/duration');
  dayjs.extend(duration);

  const durationTime = dayjs(endDate).diff(startDate);
  const durationTimeInHour = dayjs(endDate).diff(startDate, 'hour');
  let durationFormat = 'DD[D] HH[H] mm[M]';

  if (durationTimeInHour < HOUR) {
    durationFormat = 'mm[M]';
  }
  if (durationTimeInHour >= HOUR && durationTimeInHour < DAY) {
    durationFormat = 'HH[H] mm[M]';
  }

  return dayjs.duration(durationTime).format(durationFormat);
};

const isStartDateExpired = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());

const isEndDateExpired = (dateTo) => dayjs(dateTo).isAfter(dayjs());

const isFutureEvent = (dateFrom, dateTo) => isStartDateExpired(dateFrom) && isEndDateExpired(dateTo);

const isPresentEvent = (dateFrom, dateTo) => !isStartDateExpired(dateFrom) && isEndDateExpired(dateTo);

const isPastEvent = (dateFrom, dateTo) => !isStartDateExpired(dateFrom) && !isEndDateExpired(dateTo);


export {
  getTodayDate, humanizeDate, formatDate, formatTime, isPastEvent,
  formatFormDate, durationDate, isFutureEvent, isPresentEvent
};

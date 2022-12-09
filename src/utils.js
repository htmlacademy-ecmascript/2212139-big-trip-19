import dayjs from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const getRandomInteger = (a, b) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(min + Math.random() * (max - min + 1));
};

const humanizePointDueDate = (dueDate) => dayjs(dueDate).format('MMM D');

const humanizePointDueTime = (dueDate) => dayjs(dueDate).format('HH:mm');

const humanizePointDueDateAndTime = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');

const humanizePointDurationTime = (startDate, endDate) => {

  const duration = dayjs.require('dayjs/plugin/duration');
  dayjs.extend(duration);

  const durationTime = dayjs(endDate).diff(startDate);
  const durationTimeInHour = dayjs(endDate).diff(startDate, 'hour');

  if (durationTimeInHour < 1) {
    return dayjs.duration(durationTime).format('mm[M]');
  }
  if (durationTimeInHour >= 1 && durationTime < 24) {
    return dayjs.duration(durationTime).format('HH[H] mm[M]');
  }
  if (durationTimeInHour >= 24) {
    return dayjs.duration(durationTime).format('DD[D] HH[H] mm[M]');
  }
  return null;
};

export {getRandomArrayElement, getRandomInteger, humanizePointDueDate, humanizePointDueTime, humanizePointDurationTime, humanizePointDueDateAndTime};

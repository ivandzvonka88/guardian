import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateTime = (timestamp, timezone) => {
  if (!timezone) return dayjs(timestamp).utc();
  try {
    const time = dayjs.tz(timestamp, timezone);
    return time;
  } catch (e) {
    const time = dayjs.tz(timestamp);
    return time;
  }
};

export const getDayStart = (timestamp, timezone) => {
  const time = getDateTime(timestamp, timezone);
  return time.hour(0).minute(0).second(0).toDate();
};

export const getTimestamp = (datetime, timezone) => {
  try {
    const time = dayjs.tz(datetime, timezone);
    return new Date(time).getTime();
  } catch (e) {
    const time = dayjs.tz(datetime);
    return new Date(time).getTime();
  }
};

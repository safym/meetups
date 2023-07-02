import * as moment from 'moment';

export const isDateString = (value: string) => {
  return typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid();
};

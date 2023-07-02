import * as moment from 'moment';

export const isDateMatch = (dateString: string, substring: string) => {
  const formattedSubstring = substring.replace(/\./g, '-');
  const isMatch = moment(dateString).format('DD-MM-YYYY').includes(formattedSubstring);

  return isMatch;
};

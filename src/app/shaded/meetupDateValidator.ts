import { FormControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export function meetupDateValidator(control: FormControl): ValidationErrors | null {
  const selectedDate = moment(control.value, 'YYYY-MM-DDTHH:mm');
  const currentDate = moment();

  if (selectedDate.isBefore(currentDate)) {
    return { invalidMeetupDate: 'Выберите будущую дату' };
  }

  return null;
}

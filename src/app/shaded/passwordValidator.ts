import { FormControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: FormControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return { invalidPassword: 'The password cannot be empty' };
  }

  if (value.length < 4) {
    return { invalidPassword: 'The password must contain at least 4 characters' };
  }

  return null;
}

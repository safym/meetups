import { FormControl, ValidationErrors } from '@angular/forms';

export function requiredValidator(control: FormControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return { invalidRequired: 'Поле не может быть пустым' };
  }

  return null;
}

import { FormControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: FormControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return { invalidPassword: 'Пароль не может быть пустым' };
  }

  if (value.length < 4) {
    return { invalidPassword: 'Пароль должен содержать минимум 4 символов' };
  }

  return null;
}

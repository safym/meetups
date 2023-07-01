import { FormControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: FormControl): ValidationErrors | null {
  const value = control.value;
  // Проверка на наличие разрешенных символов
  const hasValidESymbols = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/.test(value);
  // Проверка почтового домена на корректность
  const hasValidDomain = /@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(value);

  const emailValid = hasValidESymbols && hasValidDomain;

  if (!hasValidESymbols) {
    return { invalidEmail: 'Имя email содержит недопустимые символа' };
  } else if (!hasValidDomain) {
    return { invalidEmail: 'Недопустимый почтовый домен' };
  } else if (!emailValid) {
    return { invalidEmail: 'Email не прошел валидацию' };
  }

  return null;
}

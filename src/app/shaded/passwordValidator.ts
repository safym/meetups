import { FormControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: FormControl): ValidationErrors | null {
  const value = control.value;
  // Проверка на наличие цифр
  const hasNumber = /[0-9]/.test(value);
  // Проверка на наличие букв (прописных или заглавных)
  const hasLetter = /[a-zA-Z]/.test(value);
  // Проврека на наличие допустимых спецсимволо ( все кроме: *(){}<>,.)
  const hasValidSymbols = /^[^*(){}<>,.]*$/.test(value);
  // Пароль содержит от 5 символов
  const isLengthValid = value ? value.length >= 5 : false;

  const passwordValid = hasLetter && hasValidSymbols && isLengthValid;

  if (!isLengthValid) {
    return { invalidPassword: 'Недостаточно символов в пароле' };
  } else if (!hasValidSymbols) {
    return { invalidPassword: 'Недопустимые символы в пароле: *(){}<>,.' };
  } else if (!hasNumber && !hasLetter) {
    return { invalidPassword: 'Пароль должен содержать цифры или буквы' };
  } else if (!passwordValid) {
    return { invalidPassword: 'Пароль не прошел валидацию' };
  }

  return null;
}

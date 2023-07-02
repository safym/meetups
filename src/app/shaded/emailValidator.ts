import { FormControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: FormControl): ValidationErrors | null {
  const value = control.value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!value) {
    return { invalidEmail: 'Email не может быть пустым' };
  }

  if (!emailRegex.test(value)) {
    return { invalidEmail: 'Email не соответствует формату' };
  }

  const [localPart, domainPart] = value.split('@');

  if (localPart.length > 64) {
    return { invalidEmail: 'Email превышает максимальную длину' };
  }

  if (domainPart.length > 255) {
    return { invalidEmail: 'Домен превышает максимальную длину' };
  }

  const domainParts: string[] = domainPart.split('.');
  const invalidDomain = domainParts.some(part => part.length > 63);

  if (invalidDomain) {
    return { invalidEmail: 'Недопустимый почтовый домен' };
  }

  return null;
}

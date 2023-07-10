import { FormControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: FormControl): ValidationErrors | null {
  const value = control.value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!value) {
    return { invalidEmail: 'The Email cannot be empty' };
  }

  if (!emailRegex.test(value)) {
    return { invalidEmail: 'The Email does not match the format' };
  }

  const [localPart, domainPart] = value.split('@');

  if (localPart.length > 64) {
    return { invalidEmail: 'The Email exceeds the maximum length' };
  }

  if (domainPart.length > 255) {
    return { invalidEmail: 'The domain exceeds the maximum length' };
  }

  const domainParts: string[] = domainPart.split('.');
  const invalidDomain = domainParts.some(part => part.length > 63);

  if (invalidDomain) {
    return { invalidEmail: 'Invalid email domain' };
  }

  return null;
}

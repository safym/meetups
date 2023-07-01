import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
  email: string;
  password: string;
  isLoading: boolean = false;
  errorMessage: string | null;

  loginForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    // this.loginForm.valueChanges.subscribe((value) =>
    //   console.log(`${value.password}: ${value.email}`)
    // );
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['ADMIN@mail.ru', [Validators.required, this.emailValidator]],
      password: ['ADMIN', [Validators.required, this.passwordValidator]],
    });
  }

  onSubmit(): void {
    const emailValue = this.loginForm.value.email;
    const passwordValue = this.loginForm.value.password;

    if (emailValue && passwordValue) {
      this.login(emailValue, passwordValue);
    }
  }

  onInput(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  private emailValidator(control: FormControl): ValidationErrors | null {
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

  private passwordValidator(control: FormControl): ValidationErrors | null {
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

  login(email: string, password: string): void {
    this.isLoading = true;
    this.authService
      .login(email, password)
      .subscribe({
        next: response => {
          const token = response.token;
          this.authService.setAuthToken(token);
          this.authService.isLoggedIn = true;
        },
        error: error => {
          this.errorMessage = error.error[0] || error.error.message;
        },
        complete: () => {
          this.router.navigate(['/meetups']);
        },
      })
      .add(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserNullable } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { WithFormControl } from 'src/app/utils/withFormControl.type';
import { getControlErrorCode } from 'src/app/utils/getControlErrorCode';

import { passwordValidator } from 'src/app/shaded/passwordValidator';
import { emailValidator } from 'src/app/shaded/emailValidator';

type LoginFormControls = WithFormControl<UserNullable>;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup<LoginFormControls>;
  isLoading: boolean = false;
  errorMessage: string | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['ADMIN@mail.ru', [Validators.required, emailValidator]],
      password: ['ADMIN', [Validators.required, passwordValidator]],
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

  login(email: string, password: string): void {
    this.isLoading = true;
    this.authService
      .login(email, password)
      .subscribe({
        error: error => {
          this.errorMessage = 'Ошибка авторизации  ';
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

  showError(сontrolName: string) {
    const errorCode = getControlErrorCode(сontrolName);

    return this.loginForm.get(сontrolName)?.getError(errorCode);
  }
}

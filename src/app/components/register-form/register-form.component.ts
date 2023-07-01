import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { WithFormControl } from 'src/app/utils/withFormControl.type';
import { passwordValidator } from 'src/app/shaded/passwordValidator';
import { emailValidator } from 'src/app/shaded/emailValidator';
import { UserReristerFormNullable } from 'src/app/models/user.interface';

type RegisterFormControls = WithFormControl<UserReristerFormNullable>;

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup<RegisterFormControls>;
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
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      password: ['', [Validators.required, passwordValidator]],
      fio: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    const emailValue = this.registerForm.value.email;
    const passwordValue = this.registerForm.value.password;
    const fioValue = this.registerForm.value.fio;

    if (emailValue && passwordValue && fioValue) {
      this.register(emailValue, passwordValue, fioValue);
    }
  }

  onInput(): void {
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

  register(email: string, password: string, fio: string): void {
    this.isLoading = true;
    this.authService
      .register(email, password, fio)
      .subscribe({
        error: error => {
          this.errorMessage = error.error[0] || error.error.message;
        },
        complete: () => {
          this.router.navigate(['/users']);
        },
      })
      .add(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
}

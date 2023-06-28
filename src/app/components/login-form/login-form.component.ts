import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  email: string;
  password: string;
  isLoading: boolean = false;
  errorMessage: string | null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  onSubmit(): void {
    this.login(this.email, this.password);
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
        next: (response) => {
          const token = response.token;
          this.authService.setAuthToken(token);
        },
        error: (error) => {
          this.errorMessage = error.error[0] || error.error.message;
        },
        complete: () => {
          this.router.navigate(["/meetups"]);
        },
      })
      .add(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }
}

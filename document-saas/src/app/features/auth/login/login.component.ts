import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="login-container">
      <div class="left-panel">
        <div class="image-overlay"></div>
        <div class="content-wrapper">
          <div class="brand-content">
            <div class="logo-wrapper">
              <mat-icon class="logo-icon">description</mat-icon>
              <span class="brand-name">Document SaaS</span>
            </div>
            <h1>Transform Your Document Management</h1>
            <p>Experience the future of enterprise document workflows with AI-powered automation and real-time collaboration</p>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="form-container">
          <div class="form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your workspace</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="admin@company.com"
              />
              <mat-icon matSuffix>email</mat-icon>
              @if (loginForm.get("email")?.hasError("required") && loginForm.get("email")?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (loginForm.get("email")?.hasError("email")) {
                <mat-error>Invalid email format</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword.set(!hidePassword())"
              >
                <mat-icon>
                  {{ hidePassword() ? "visibility_off" : "visibility" }}
                </mat-icon>
              </button>
              @if (loginForm.get("password")?.hasError("required") && loginForm.get("password")?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Company Subdomain</mat-label>
              <input
                matInput
                formControlName="subdomain"
                placeholder="your-company"
              />
              <mat-icon matSuffix>domain</mat-icon>
              @if (loginForm.get("subdomain")?.hasError("required") && loginForm.get("subdomain")?.touched) {
                <mat-error>Subdomain is required</mat-error>
              }
            </mat-form-field>

            @if (errorMessage()) {
              <div class="error-banner">
                <mat-icon>error_outline</mat-icon>
                {{ errorMessage() }}
              </div>
            }

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width submit-btn"
              [disabled]="isLoading() || loginForm.invalid"
            >
              @if (isLoading()) {
                <mat-spinner diameter="20"></mat-spinner>
                <span>Signing in...</span>
              } @else {
                <span>Sign In</span>
              }
            </button>

            <div class="register-link">
              <p>New company? <a routerLink="/auth/register">Register here</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      background: #ffffff;
    }

    /* Left Panel with Background Image */
    .left-panel {
      flex: 0 0 55%;
      position: relative;
      background-image: url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(37, 99, 235, 0.75) 100%);
      z-index: 1;
    }

    .content-wrapper {
      position: relative;
      z-index: 2;
      padding: 48px;
      max-width: 500px;
      width: 100%;
    }

    .brand-content {
      color: white;
    }

    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .logo-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: white;
    }

    .brand-name {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .brand-content h1 {
      font-size: 42px;
      font-weight: 700;
      margin: 0 0 20px 0;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .brand-content p {
      font-size: 18px;
      line-height: 1.6;
      opacity: 0.95;
      margin: 0;
    }

    /* Right Panel */
    .right-panel {
      flex: 0 0 45%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      padding: 48px;
    }

    .form-container {
      width: 100%;
      max-width: 440px;
    }

    .form-header {
      text-align: left;
      margin-bottom: 36px;
    }

    .form-header h2 {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #1e293b;
      letter-spacing: -0.5px;
    }

    .form-header p {
      font-size: 15px;
      color: #64748b;
      margin: 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    ::ng-deep .mat-form-field-outline {
      background-color: #f8fafc;
      border-radius: 8px;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      color: #e2e8f0;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick {
      color: #3b82f6;
    }

    .submit-btn {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      margin-top: 8px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #3b82f6;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .submit-btn:disabled {
      background: #94a3b8;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #fef2f2;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      margin-bottom: 20px;
      border-left: 4px solid #dc2626;
    }

    .error-banner mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .register-link {
      text-align: center;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .register-link p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }

    .register-link a {
      color: #3b82f6;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .register-link a:hover {
      color: #2563eb;
      text-decoration: underline;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
      }

      .left-panel {
        flex: 0 0 auto;
        min-height: 400px;
      }

      .content-wrapper {
        padding: 32px 24px;
        text-align: center;
      }

      .logo-wrapper {
        justify-content: center;
      }

      .brand-content h1 {
        font-size: 28px;
      }

      .brand-content p {
        font-size: 16px;
      }

      .right-panel {
        flex: 0 0 auto;
        padding: 40px 24px;
      }

      .form-container {
        max-width: 100%;
      }

      .form-header {
        text-align: center;
      }

      .form-header h2 {
        font-size: 28px;
      }
    }

    /* Tablet Responsive */
    @media (min-width: 769px) and (max-width: 1024px) {
      .left-panel {
        flex: 0 0 50%;
      }

      .right-panel {
        flex: 0 0 50%;
      }

      .brand-content h1 {
        font-size: 32px;
      }

      .form-header h2 {
        font-size: 28px;
      }
    }

    /* Animation */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-container {
      animation: fadeInUp 0.6s ease-out;
    }

    .content-wrapper {
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }
  `],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  hidePassword = signal(true);
  errorMessage = signal("");

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      subdomain: ["", [Validators.required]],
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/dashboard"]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set("");

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open("Welcome back!", "Close", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: "top",
        });
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.isLoading.set(false);
        
        if (err.status === 401) {
          this.errorMessage.set("Invalid email, password or subdomain");
        } else if (err.status === 400) {
          this.errorMessage.set("Please check your credentials and try again");
        } else if (err.status === 0) {
          this.errorMessage.set("Cannot connect to server. Please try again.");
        } else {
          this.errorMessage.set("Login failed. Please try again.");
        }
      },
    });
  }
}
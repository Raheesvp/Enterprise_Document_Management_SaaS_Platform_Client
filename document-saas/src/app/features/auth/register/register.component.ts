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
import { MatStepperModule } from "@angular/material/stepper";
import { AuthService } from "../../../core/services/auth.service";
import { PasswordValidator } from "../../../core/validators/password-validator";

@Component({
  selector: "app-register",
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
    MatStepperModule,
  ],
  template: `
    <div class="register-container">
      <div class="left-panel">
        <div class="image-overlay"></div>
        <div class="content-wrapper">
          <div class="brand-content">
            <h1 class="brand-name">TenantStack</h1>
            <div class="tagline-container">
              <p class="main-tagline">Start Your Journey</p>
              <p class="sub-tagline">Create your multi-tenant workspace in minutes</p>
            </div>
            <div class="features-grid">
              <div class="feature">
                <div class="feature-dot"></div>
                <span>Isolated tenant environments</span>
              </div>
              <div class="feature">
                <div class="feature-dot"></div>
                <span>Enterprise-grade security</span>
              </div>
              <div class="feature">
                <div class="feature-dot"></div>
                <span>Scalable infrastructure</span>
              </div>
              <div class="feature">
                <div class="feature-dot"></div>
                <span>24/7 dedicated support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="form-container">
          <div class="form-header">
            <h2>Create workspace</h2>
            <p>Set up your company and admin account</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-section">
              <h3 class="section-title">Company Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Company name</mat-label>
                <input matInput formControlName="tenantName"
                  placeholder="Acme Corporation" />
                <mat-icon matSuffix>business</mat-icon>
                @if (registerForm.get("tenantName")?.hasError("required")
                  && registerForm.get("tenantName")?.touched) {
                  <mat-error>Company name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Subdomain</mat-label>
                <input matInput formControlName="subdomain"
                  placeholder="acme-corp" />
                <mat-icon matSuffix>domain</mat-icon>
                <mat-hint>Lowercase letters, numbers, hyphens only</mat-hint>
                @if (registerForm.get("subdomain")?.hasError("required") && registerForm.get("subdomain")?.touched) {
                  <mat-error>Subdomain is required</mat-error>
                }
                @if (registerForm.get("subdomain")?.hasError("pattern")) {
                  <mat-error>Only lowercase letters, numbers, and hyphens allowed</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Company email</mat-label>
                <input matInput type="email" formControlName="contactEmail"
                  placeholder="contact@acme.com" />
                <mat-icon matSuffix>email</mat-icon>
                @if (registerForm.get("contactEmail")?.hasError("required") && registerForm.get("contactEmail")?.touched) {
                  <mat-error>Company email is required</mat-error>
                }
                @if (registerForm.get("contactEmail")?.hasError("email")) {
                  <mat-error>Please enter a valid email address</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-section">
              <h3 class="section-title">Admin Account</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full name</mat-label>
                <input matInput formControlName="adminFullName"
                  placeholder="John Smith" />
                <mat-icon matSuffix>person</mat-icon>
                @if (registerForm.get("adminFullName")?.hasError("required") && registerForm.get("adminFullName")?.touched) {
                  <mat-error>Full name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Admin email</mat-label>
                <input matInput type="email" formControlName="adminEmail"
                  placeholder="admin@acme.com" />
                <mat-icon matSuffix>email</mat-icon>
                @if (registerForm.get("adminEmail")?.hasError("required") && registerForm.get("adminEmail")?.touched) {
                  <mat-error>Admin email is required</mat-error>
                }
                @if (registerForm.get("adminEmail")?.hasError("email")) {
                  <mat-error>Please enter a valid email address</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput
                  [type]="hidePassword() ? 'password' : 'text'"
                  formControlName="adminPassword"
                  placeholder="Create a strong password" />
                <button mat-icon-button matSuffix type="button"
                  (click)="hidePassword.set(!hidePassword())">
                  <mat-icon>
                    {{ hidePassword() ? "visibility_off" : "visibility" }}
                  </mat-icon>
                </button>
                <mat-hint>Minimum 8 characters with uppercase, number, and symbol</mat-hint>
                @if (registerForm.get("adminPassword")?.hasError("required") && registerForm.get("adminPassword")?.touched) {
                  <mat-error>Password is required</mat-error>
                }
                @if (registerForm.get("adminPassword")?.hasError("passwordStrength")) {
                  <mat-error>
                    Password must have:
                    @if (!registerForm.get("adminPassword")?.errors?.['passwordStrength']?.isLongEnough) { <span>min 8 chars, </span> }
                    @if (!registerForm.get("adminPassword")?.errors?.['passwordStrength']?.hasUpperCase) { <span>uppercase, </span> }
                    @if (!registerForm.get("adminPassword")?.errors?.['passwordStrength']?.hasNumeric) { <span>number, </span> }
                    @if (!registerForm.get("adminPassword")?.errors?.['passwordStrength']?.hasSpecialChar) { <span>special char</span> }
                  </mat-error>
                }
              </mat-form-field>
            </div>

            @if (errorMessage()) {
              <div class="error-banner">
                <mat-icon>error_outline</mat-icon>
                {{ errorMessage() }}
              </div>
            }

            <button
              mat-raised-button color="primary"
              type="submit"
              class="full-width submit-btn"
              [disabled]="isLoading() || registerForm.invalid">
              @if (isLoading()) {
                <mat-spinner diameter="20"></mat-spinner>
                <span>Creating workspace...</span>
              } @else {
                <span>Create workspace</span>
              }
            </button>

            <div class="login-link">
              <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      background: #ffffff;
    }

    /* Left Panel with Background Image */
    .left-panel {
      flex: 0 0 55%;
      position: relative;
      background-image: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
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
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(37, 99, 235, 0.82) 100%);
      z-index: 1;
    }

    .content-wrapper {
      position: relative;
      z-index: 2;
      padding: 48px;
      max-width: 550px;
      width: 100%;
    }

    .brand-content {
      color: white;
    }

    .brand-name {
      font-size: 48px;
      font-weight: 800;
      margin: 0 0 24px 0;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .tagline-container {
      margin-bottom: 48px;
    }

    .main-tagline {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 12px 0;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }

    .sub-tagline {
      font-size: 18px;
      margin: 0;
      opacity: 0.9;
      font-weight: 400;
    }

    .features-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 16px;
      line-height: 1.5;
    }

    .feature-dot {
      width: 8px;
      height: 8px;
      background: #3b82f6;
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    }

    /* Right Panel */
    .right-panel {
      flex: 0 0 45%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      padding: 48px;
      overflow-y: auto;
      max-height: 100vh;
    }

    .form-container {
      width: 100%;
      max-width: 480px;
    }

    .form-header {
      margin-bottom: 32px;
    }

    .form-header h2 {
      font-size: 34px;
      font-weight: 700;
      margin: 0 0 12px 0;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .form-header p {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }

    .form-section {
      margin-bottom: 28px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #3b82f6;
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 20px;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      background-color: #ffffff;
      border-radius: 12px;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-flex {
      background-color: #f9fafb;
      border-radius: 12px;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline-thick {
      color: #e2e8f0;
    }

    ::ng-deep .mat-form-field.mat-focused .mat-form-field-outline-thick {
      color: #3b82f6;
    }

    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-label {
      color: #64748b;
    }

    .submit-btn {
      height: 52px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 8px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: #0f172a;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
      background: #1e293b;
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
    }

    .submit-btn:disabled {
      background: #cbd5e1;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #fef2f2;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      margin-bottom: 24px;
      border-left: 4px solid #dc2626;
    }

    .error-banner mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .login-link {
      text-align: center;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #eef2ff;
    }

    .login-link p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
    }

    .login-link a {
      color: #3b82f6;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .login-link a:hover {
      color: #2563eb;
      text-decoration: underline;
    }

    /* Custom scrollbar */
    .right-panel::-webkit-scrollbar {
      width: 6px;
    }

    .right-panel::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .right-panel::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .right-panel::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .register-container {
        flex-direction: column;
      }

      .left-panel {
        flex: 0 0 auto;
        min-height: 380px;
      }

      .content-wrapper {
        padding: 32px 24px;
        text-align: center;
      }

      .brand-name {
        font-size: 36px;
      }

      .main-tagline {
        font-size: 22px;
      }

      .sub-tagline {
        font-size: 16px;
      }

      .features-grid {
        align-items: center;
      }

      .feature {
        justify-content: center;
      }

      .right-panel {
        flex: 0 0 auto;
        padding: 40px 24px;
        max-height: none;
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

      .brand-name {
        font-size: 40px;
      }

      .main-tagline {
        font-size: 24px;
      }

      .form-header h2 {
        font-size: 30px;
      }
    }

    /* Animation */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .form-container {
      animation: fadeInUp 0.5s ease-out;
    }

    .content-wrapper {
      animation: fadeInUp 0.5s ease-out 0.1s both;
    }
  `],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading    = signal(false);
  hidePassword = signal(true);
  errorMessage = signal("");

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      tenantName:    ["", Validators.required],
      subdomain:     ["", [
        Validators.required,
        Validators.pattern(/^[a-z0-9-]+$/)
      ]],
      contactEmail:  ["", [Validators.required, Validators.email]],
      adminFullName: ["", Validators.required],
      adminEmail:    ["", [Validators.required, Validators.email]],
      adminPassword: ["", [
        Validators.required,
        PasswordValidator.strength()
      ]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set("");

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snackBar.open(
          "Account created! Please sign in.", "Close",
          { duration: 4000, horizontalPosition: "end", verticalPosition: "top" }
        );
        this.router.navigate(["/auth/login"]);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message ?? "Registration failed. Please try again."
        );
      },
    });
  }
}
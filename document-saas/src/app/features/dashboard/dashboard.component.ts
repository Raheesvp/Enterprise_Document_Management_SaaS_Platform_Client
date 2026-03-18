import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { AuthService } from "../../core/services/auth.service";

interface StatCard {
  title:    string;
  subtitle: string;
  icon:     string;
  color:    string;
  route:    string;
  action:   string;
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <div>
          <h1>Welcome back, {{ authService.currentUser()?.fullName }} ??</h1>
          <p>Here is what is happening with your documents today.</p>
        </div>
        <div class="header-meta">
          <span class="tenant-badge">
            <mat-icon>business</mat-icon>
            {{ getTenantDomain() }}
          </span>
          <span class="role-badge">
            {{ authService.currentUser()?.role }}
          </span>
        </div>
      </div>

      <div class="stats-grid">
        @for (card of statCards; track card.title) {
          <mat-card class="stat-card" [routerLink]="card.route">
            <div class="stat-top">
              <div class="stat-icon-wrap"
                [style.background]="card.color + '20'">
                <mat-icon [style.color]="card.color">
                  {{ card.icon }}
                </mat-icon>
              </div>
            </div>
            <mat-card-content>
              <h3>{{ card.title }}</h3>
              <p>{{ card.subtitle }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button [style.color]="card.color">
                {{ card.action }}
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>

      @if (authService.isManager()) {
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-row">
            <button mat-raised-button color="primary"
              routerLink="/documents/upload">
              <mat-icon>upload_file</mat-icon>
              Upload Document
            </button>
            <button mat-stroked-button color="primary"
              routerLink="/workflow">
              <mat-icon>account_tree</mat-icon>
              View Pending Approvals
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .page-header h1 {
      font-size: 26px;
      font-weight: 700;
      color: #1E293B;
      margin: 0 0 4px;
    }
    .page-header p {
      color: #64748B;
      margin: 0;
      font-size: 14px;
    }
    .header-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .tenant-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #EFF6FF;
      color: #2563EB;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .tenant-badge mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    .role-badge {
      background: #F0FDF4;
      color: #16A34A;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      border-radius: 12px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    .stat-top {
      padding: 16px 16px 0;
    }
    .stat-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon-wrap mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    mat-card-content h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1E293B;
      margin: 12px 0 4px;
    }
    mat-card-content p {
      font-size: 13px;
      color: #64748B;
      margin: 0;
    }
    mat-card-actions {
      padding: 8px;
    }
    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
    }
    .quick-actions h2 {
      font-size: 18px;
      font-weight: 600;
      color: #1E293B;
      margin: 0 0 16px;
    }
    .action-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .action-row button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `],
})
export class DashboardComponent {
  authService = inject(AuthService);

  statCards: StatCard[] = [
    {
      title:    "Documents",
      subtitle: "Manage and track your files",
      icon:     "description",
      color:    "#2563EB",
      route:    "/documents",
      action:   "View Documents",
    },
    {
      title:    "Workflows",
      subtitle: "Pending approval chains",
      icon:     "account_tree",
      color:    "#7C3AED",
      route:    "/workflow",
      action:   "View Workflows",
    },
    {
      title:    "Notifications",
      subtitle: "Stay updated on actions",
      icon:     "notifications",
      color:    "#EA580C",
      route:    "/notifications",
      action:   "View All",
    },
    {
      title:    "Upload",
      subtitle: "Add new documents",
      icon:     "upload_file",
      color:    "#16A34A",
      route:    "/documents/upload",
      action:   "Upload Now",
    },
  ];

  getTenantDomain(): string {
    const email = this.authService.currentUser()?.email;
    if (!email) return "";
    const parts = email.split("@");
    return parts.length > 1 ? parts[1] : "";
  }
}

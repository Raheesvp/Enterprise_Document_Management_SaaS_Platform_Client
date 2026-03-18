import { Component, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { TopbarComponent } from "../topbar/topbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

// ShellComponent — the main app container
// Contains: topbar + sidebar + router-outlet
// Sidebar collapses on mobile screens automatically
@Component({
  selector: "app-shell",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    TopbarComponent,
    SidebarComponent,
  ],
  template: `
    <mat-sidenav-container class="shell-container">

      <!-- Sidebar Navigation -->
      <mat-sidenav
        #sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        class="sidenav">
        <app-sidebar
          (closeSidenav)="sidenav.close()">
        </app-sidebar>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content class="main-content">

        <!-- Top Bar -->
        <app-topbar
          (toggleSidenav)="sidenav.toggle()">
        </app-topbar>

        <!-- Page Content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>

      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styles: [`
    .shell-container {
      height: 100vh;
    }
    .sidenav {
      width: 260px;
      border-right: 1px solid #E2E8F0;
      background: white;
    }
    .main-content {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #F8FAFC;
    }
    .page-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }
  `],
})
export class ShellComponent {
  isMobile = signal(false);

  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }
}

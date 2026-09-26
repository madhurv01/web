import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './shared/layouts/public-layout/public-layout.component';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';
import { authGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },
      { path: 'about', loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent) },
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent) },
      { path: 'gov-login', loadComponent: () => import('./features/auth/gov-login/gov-login.component').then((m) => m.GovLoginComponent) },
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard('citizen')],
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'complaint',
        canActivate: [roleGuard('citizen')],
        loadComponent: () => import('./features/complaint/complaint.component').then((m) => m.ComplaintComponent),
      },
      {
        path: 'report-emergency',
        canActivate: [roleGuard('citizen')],
        loadComponent: () => import('./features/report-emergency/report-emergency.component').then((m) => m.ReportEmergencyComponent),
      },
      {
        path: 'track-complaint',
        canActivate: [roleGuard('citizen')],
        loadComponent: () => import('./features/track-complaint/track-complaint.component').then((m) => m.TrackComplaintComponent),
      },
      {
        path: 'view-complaint/:code',
        loadComponent: () => import('./features/view-complaint/view-complaint.component').then((m) => m.ViewComplaintComponent),
      },
      {
        path: 'water-status',
        loadComponent: () => import('./features/water-status/water-status.component').then((m) => m.WaterStatusComponent),
      },
      {
        path: 'gov-dashboard',
        canActivate: [roleGuard('government')],
        loadComponent: () => import('./features/gov-dashboard/gov-dashboard.component').then((m) => m.GovDashboardComponent),
      },
      {
        path: 'gov-dashboard/complaints',
        canActivate: [roleGuard('government')],
        loadComponent: () => import('./features/gov-dashboard/gov-dashboard.component').then((m) => m.GovDashboardComponent),
      },
      {
        path: 'news',
        loadComponent: () => import('./features/news/news.component').then((m) => m.NewsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

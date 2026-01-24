import { Routes } from '@angular/router';
import { Categories } from './pages/categories/categories';
import { Dashboard } from './pages/dashboard/dashboard';
import { OverviewComponent } from './pages/overview/overview';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'overview', component: OverviewComponent },
  { path: 'categories', component: Categories },
];

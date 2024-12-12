import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HotelsComponent } from './app/hotels/hotels.component';

const routes: Routes = [
  { path: '', redirectTo: 'hotels', pathMatch: 'full' },
  { path: 'hotels', loadComponent: () => import('./app/hotels/hotels.component').then(m => m.HotelsComponent) },
  { path: 'bookings', loadComponent: () => import('./app/bookings/bookings.component').then(m => m.BookingsComponent) },
  { path: 'staff', loadComponent: () => import('./app/staff/staff.component').then(m => m.StaffComponent) },
];

bootstrapApplication(HotelsComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Configure the HTTP client globally
  ],
});

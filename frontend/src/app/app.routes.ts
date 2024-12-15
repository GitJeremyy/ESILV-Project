import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'hotels', loadComponent: () => import('./hotels/hotels.component').then(m => m.HotelsComponent), canActivate: [AuthGuard] },
  { path: 'bookings', loadComponent: () => import('./bookings/bookings.component').then(m => m.BookingsComponent), canActivate: [AuthGuard] },
  { path: 'staff', loadComponent: () => import('./staff/staff.component').then(m => m.StaffComponent), canActivate: [AuthGuard] },
  { path: 'guests', loadComponent: () => import('./guests/guests.component').then(m => m.GuestsComponent), canActivate: [AuthGuard] },
  { path: 'rooms', loadComponent: () => import('./rooms/rooms.component').then(m => m.RoomsComponent), canActivate: [AuthGuard] },
  { path: 'reservation', loadComponent: () => import('./reservation/reservation.component').then(m => m.ReservationComponent), canActivate: [AuthGuard] },
  { path: 'modifications', loadComponent: () => import('./modifications/modifications.component').then(m => m.ModificationsComponent), canActivate: [AuthGuard] },
  { path: 'graphs', loadComponent: () => import('./graphs/graphs.component').then(m => m.GraphsComponent), canActivate: [AuthGuard] },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

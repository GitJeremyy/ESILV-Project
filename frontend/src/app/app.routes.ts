import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'hotels', loadComponent: () => import('./hotels/hotels.component').then(m => m.HotelsComponent) },
  { path: 'bookings', loadComponent: () => import('./bookings/bookings.component').then(m => m.BookingsComponent) },
  { path: 'staff', loadComponent: () => import('./staff/staff.component').then(m => m.StaffComponent) },
  { path: 'guests', loadComponent: () => import('./guests/guests.component').then(m => m.GuestsComponent) },
  { path: 'rooms', loadComponent: () => import('./rooms/rooms.component').then(m => m.RoomsComponent) },
  { path: 'reservation', loadComponent: () => import('./reservation/reservation.component').then(m => m.ReservationComponent) },
  { path: 'modifications', loadComponent: () => import('./modifications/modifications.component').then(m => m.ModificationsComponent) },
  { path: 'graphs', loadComponent: () => import('./graphs/graphs.component').then(m => m.GraphsComponent) }

];

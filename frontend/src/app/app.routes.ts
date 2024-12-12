import { Routes } from '@angular/router';
import { HotelsComponent } from './hotels/hotels.component';

export const routes: Routes = [
  { path: 'hotels', component: HotelsComponent },
  { path: '', redirectTo: 'hotels', pathMatch: 'full' }, // Redirige la page d'accueil vers /hotels
];

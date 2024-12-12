import { Routes } from '@angular/router';
import { HotelsComponent } from './hotels/hotels.component';

export const routes: Routes = [
    { path: 'hotels', component: HotelsComponent }, // Définir le chemin pour /hotels
    { path: '', redirectTo: '/hotels', pathMatch: 'full' }, // Redirect to hotels if no route is matched
];

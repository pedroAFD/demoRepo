import { Routes } from '@angular/router';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
    },
    {
        path: 'tasks',
        component: SidemenuComponent
    }
];

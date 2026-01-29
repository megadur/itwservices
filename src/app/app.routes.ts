import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Cv } from './components/cv/cv';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'cv', component: Cv }
];

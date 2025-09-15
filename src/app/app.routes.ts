import { Routes } from '@angular/router';
import { InsideWindow } from './components/inside-window/inside-window';

export const routes: Routes = [
    {
        path: "*",
        component: InsideWindow
    }
];

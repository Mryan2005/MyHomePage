import { Routes } from '@angular/router';
import {SubIntroduceMyselfWindow} from './components/sub-introduce-myself-window/sub-introduce-myself-window';
import {SubWorksListWindow} from './components/sub-works-list-window/sub-works-list-window';
import {SubTravellingWindow} from './components/sub-travelling-window/sub-travelling-window';
import {SubIssueListComponent} from './components/sub-issue-list-window/sub-issue-list-window';
import {SubFilesListWindow} from './components/sub-files-list-window/sub-files-list-window';
import {SubContactListWindow} from './components/sub-contact-list-window/sub-contact-list-window';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: SubIntroduceMyselfWindow},
    {path: 'works', component: SubWorksListWindow},
    {path: 'travel', component: SubTravellingWindow},
    {path: 'status', component: SubIssueListComponent},
    {path: 'files', component: SubFilesListWindow},
    {path: 'contact', component: SubContactListWindow},
    {path: 'help', redirectTo: 'home'},
    {path: '**', redirectTo: 'home'}
];

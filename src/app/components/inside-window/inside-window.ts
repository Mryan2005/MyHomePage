import {Component, Input} from '@angular/core';
import {AvatarService} from '../../config/avatar';
import {SubTravellingWindow} from '../sub-travelling-window/sub-travelling-window';
import {SubIntroduceMyselfWindow} from '../sub-introduce-myself-window/sub-introduce-myself-window';
import {SubIssueListComponent} from '../sub-issue-list-window/sub-issue-list-window';
import {SubWorksListWindow} from '../sub-works-list-window/sub-works-list-window';
import {SubContactListWindow} from '../sub-contact-list-window/sub-contact-list-window';
import {WebsitePramasService} from '../../services/Website-pramas';
import {OnInit} from '@angular/core';

@Component({
    selector: 'app-inside-window',
    imports: [
        SubTravellingWindow,
        SubIntroduceMyselfWindow,
        SubIssueListComponent,
        SubWorksListWindow,
        SubContactListWindow
    ],
    standalone: true,
    templateUrl: './inside-window.html',
    styleUrl: './inside-window.scss'
})
export class InsideWindow implements OnInit {
    constructor(
        public avatarService: AvatarService,
        public websitePramas: WebsitePramasService
    ) {
    }

    public currentDisplayPart: string = 'Home';

    onInit() {
        this.currentDisplayPart = this.websitePramas.currentDisplayPart;
}

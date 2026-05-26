import {Component, Input} from '@angular/core';
import {AvatarService} from '../../config/avatar';
import {SubTravellingWindow} from '../sub-travelling-window/sub-travelling-window';
import {SubIntroduceMyselfWindow} from '../sub-introduce-myself-window/sub-introduce-myself-window';
import {SubIssueListComponent} from '../sub-issue-list-window/sub-issue-list-window';

@Component({
    selector: 'app-inside-window',
    imports: [
        SubTravellingWindow,
        SubIntroduceMyselfWindow,
        SubIssueListComponent
    ],
    standalone: true,
    templateUrl: './inside-window.html',
    styleUrl: './inside-window.scss'
})
export class InsideWindow {
    @Input() currentDisplayPart: string = 'Home';

    constructor(
        public avatarService: AvatarService
    ) {
    }
}

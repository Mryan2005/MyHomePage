import {Component, Input} from '@angular/core';
import {AvatarService} from '../../config/avatar';

@Component({
    selector: 'app-sub-travelling-window',
    imports: [],
    standalone: true,
    templateUrl: './sub-travelling-window.html',
    styleUrl: './sub-travelling-window.scss'
})
export class SubTravellingWindow {
    @Input() currentDisplayPart: string = 'Home';

    constructor(
        public avatarService: AvatarService
    ) {
    }
}

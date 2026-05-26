import {Component, Input} from '@angular/core';
import {AvatarService} from '../../config/avatar';

@Component({
    selector: 'app-inside-window',
    imports: [],
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

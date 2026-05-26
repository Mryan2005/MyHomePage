import {Component} from '@angular/core';
import {AvatarService} from '../../config/avatar';

@Component({
    selector: 'app-inside-window',
    imports: [],
    standalone: true,
    templateUrl: './inside-window.html',
    styleUrl: './inside-window.scss'
})
export class InsideWindow {
    constructor(
        public avatarService: AvatarService
    ) {
    }
}

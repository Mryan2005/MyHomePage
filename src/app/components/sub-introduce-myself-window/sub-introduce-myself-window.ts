import {Component, Input} from '@angular/core';
import {AvatarService} from '../../config/avatar';

@Component({
    selector: 'app-sub-introduce-myself-window',
    imports: [],
    standalone: true,
    templateUrl: './sub-introduce-myself-window.html',
    styleUrl: './sub-introduce-myself-window.scss',
})
export class SubIntroduceMyselfWindow {
    @Input() currentDisplayPart: string = 'Home';

    constructor(
        public avatarService: AvatarService
    ) {
    }
}

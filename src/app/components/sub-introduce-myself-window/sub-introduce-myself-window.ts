import {Component, Input} from '@angular/core';
import {AvatarService} from '../../config/avatar';
import {WebsitePramas} from '../../services/Website-pramas';

@Component({
    selector: 'app-sub-introduce-myself-window',
    imports: [],
    standalone: true,
    templateUrl: './sub-introduce-myself-window.html',
    styleUrl: './sub-introduce-myself-window.scss',
})
export class SubIntroduceMyselfWindow {
    public currentDisplayPart: string = this.websitePramas.currentDisplayPart;

    openPortal() {
        this.websitePramas.currentDisplayPart = 'works';
    }

    constructor(
        public avatarService: AvatarService,
        public websitePramas: WebsitePramas
    ) {
    }
}

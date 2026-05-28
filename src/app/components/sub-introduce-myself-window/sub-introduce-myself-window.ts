import {Component, Input} from '@angular/core';
import {AvatarService} from '../../config/avatar';
import {WebsitePramasService} from '../../services/Website-pramas';
import {OnInit} from '@angular/core';

@Component({
    selector: 'app-sub-introduce-myself-window',
    imports: [],
    standalone: true,
    templateUrl: './sub-introduce-myself-window.html',
    styleUrl: './sub-introduce-myself-window.scss',
})
export class SubIntroduceMyselfWindow implements OnInit {
    public currentDisplayPart: string = 'Home';

    openPortal() {
        this.websitePramas.currentDisplayPart = 'Works';
    }

    constructor(
        public avatarService: AvatarService,
        public websitePramas: WebsitePramasService
    ) {
    }

    ngOnInit() {
        this.currentDisplayPart = this.websitePramas.currentDisplayPart;
    }
}

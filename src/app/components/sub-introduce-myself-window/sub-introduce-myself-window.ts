import {Component, Input} from '@angular/core';
import {AvatarService} from '../../config/avatar';
import {WebsitePramasService} from '../../services/Website-pramas';
import {OnInit} from '@angular/core';
import {PhotoViewerService} from '../../services/photo-viewer.service';

@Component({
    selector: 'app-sub-introduce-myself-window',
    imports: [],
    standalone: true,
    templateUrl: './sub-introduce-myself-window.html',
    styleUrl: './sub-introduce-myself-window.scss',
})
export class SubIntroduceMyselfWindow implements OnInit {
    public currentDisplayPart: string = 'Home';
    public adam_smith_avatar: string = '/assets/images/7646049331687920481(20260531-213655).png'

    openPortal() {
        this.websitePramas.currentDisplayPart = 'Works';
    }

    constructor(
        public avatarService: AvatarService,
        public websitePramas: WebsitePramasService,
        public photoViewer: PhotoViewerService
    ) {
    }

    ngOnInit() {
        this.currentDisplayPart = this.websitePramas.currentDisplayPart;
    }
}

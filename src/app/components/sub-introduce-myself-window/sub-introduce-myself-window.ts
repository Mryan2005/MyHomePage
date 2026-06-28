import {Component, Input, AfterViewInit} from '@angular/core';
import {AvatarService} from '../../config/avatar';
import {WebsitePramasService} from '../../services/Website-pramas';
import {OnInit} from '@angular/core';
import {PhotoViewerService} from '../../services/photo-viewer.service';
declare const liquidGL: any;

@Component({
    selector: 'app-sub-introduce-myself-window',
    imports: [],
    standalone: true,
    templateUrl: './sub-introduce-myself-window.html',
    styleUrl: './sub-introduce-myself-window.scss',
})
export class SubIntroduceMyselfWindow implements OnInit, AfterViewInit {
    public currentDisplayPart: string = 'Home';
    public adam_smith_avatar: string = '/assets/images/7646049331687920481(20260531-213655).png'
    public ciallo_image = ['/assets/images/ciallo/Murasame_ciallo.png', '/assets/images/ciallo/Yoshino_Ciallo.png'];

    openPortal() {
        this.websitePramas.currentDisplayPart = 'Works';
    }

    openCialloImage() {
        const mean = (this.ciallo_image.length - 1) / 2;
        const stdDev = this.ciallo_image.length / 5; // 控制集中程度（越小越集中）

        let index = Math.round(this.gaussianRandom(mean, stdDev));

        // 边界保护
        index = Math.max(0, Math.min(this.ciallo_image.length - 1, index));

        this.photoViewer.open(this.ciallo_image[index], '/assets/music/恋ひ恋う縁 .以恋结缘.-KOTOKO.mp3');
    }

    gaussianRandom(mean = 0, stdDev = 1): number {
        let u = 0, v = 0;

        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();

        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdDev + mean;
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

    ngAfterViewInit() {
        liquidGL({
            target: ".right-column",
            snapshot: "body",
            resolution:2,
            refraction:0.01,
            bevelDepth:0.08,
            bevelWidth:0.15,
            frost:2,
            shadow:true,
            specular:true,
            reveal:"fade",
            tilt:false,
            magnify:1
        });
    }
}

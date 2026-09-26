import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {AvatarService} from '../../config/avatar';
import {WebsitePramasService} from '../../services/Website-pramas';
import {OnInit} from '@angular/core';
import {PhotoViewerService} from '../../services/photo-viewer.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sub-introduce-myself-window',
    imports: [],
    standalone: true,
    templateUrl: './sub-introduce-myself-window.html',
    styleUrl: './sub-introduce-myself-window.scss',
})
export class SubIntroduceMyselfWindow implements OnInit, AfterViewInit, OnDestroy {
    public currentDisplayPart: string = 'Home';
    public adam_smith_avatar: string = '/assets/images/7646049331687920481(20260531-213655).png'
    public ciallo_image = ['/assets/images/ciallo/Murasame_ciallo.png', '/assets/images/ciallo/Yoshino_Ciallo.png'];
    private profileLensInitialized = false;
    private readonly syncLayoutBoundsHandler = () => this.syncLayoutBounds();

    openPortal() {
        this.websitePramas.currentDisplayPart = 'Works';
        this.router.navigate(['/works']);
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
        public photoViewer: PhotoViewerService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.currentDisplayPart = this.websitePramas.currentDisplayPart;
    }

    ngAfterViewInit() {
        window.addEventListener('resize', this.syncLayoutBoundsHandler, {passive: true});
        window.visualViewport?.addEventListener('resize', this.syncLayoutBoundsHandler, {passive: true});

        requestAnimationFrame(() => {
            this.syncLayoutBounds();
            this.initializeProfileLens();
        });
    }

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.syncLayoutBoundsHandler);
        window.visualViewport?.removeEventListener('resize', this.syncLayoutBoundsHandler);
    }

    private initializeProfileLens(): void {
        if (this.profileLensInitialized) return;
        const liquid = (window as any).liquidGL;
        const target = document.querySelector('#profile-liquid-glass');
        if (typeof liquid !== 'function' || !target) return;

        this.profileLensInitialized = true;
        liquid({
            target: '#profile-liquid-glass',
            snapshot: '#site-background',
            resolution: Math.min(window.devicePixelRatio || 1, 1.5),
            refraction: 0.035,
            bevelDepth: 0.12,
            bevelWidth: 0.22,
            frost: 0,
            shadow: false,
            specular: true,
            reveal: 'none',
            tilt: false,
            magnify: 1.025
        });
    }

    private syncLayoutBounds(): void {
        const layout = document.querySelector<HTMLElement>('#profile-liquid-glass');
        if (!layout) return;
        const rect = layout.getBoundingClientRect();

        layout.style.setProperty('--profile-top', `${Math.max(0, rect.top)}px`);
        layout.style.setProperty('--profile-right', `${Math.max(0, window.innerWidth - rect.right)}px`);
        layout.style.setProperty('--profile-bottom', `${Math.max(0, window.innerHeight - rect.bottom)}px`);
        layout.style.setProperty('--profile-left', `${Math.max(0, rect.left)}px`);
    }
}

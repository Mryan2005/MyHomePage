import {AfterViewInit, ChangeDetectorRef, Component, Inject, PLATFORM_ID, Renderer2, OnInit} from '@angular/core';
import {BackgroundService} from './config/background';
import {Footbar} from './components/footbar/footbar';
import {TopbarComponent} from './components/topbar/topbar.component';
import {NgIf} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
    imports: [Footbar, TopbarComponent, NgIf, RouterOutlet],
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class App implements AfterViewInit, OnInit {
    constructor(
        private renderer: Renderer2,
        public bgService: BackgroundService,
        public cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
    }

    title = 'myhomeIndex';
    isTargetDomain: boolean = false;
    
    ngAfterViewInit(): void {
        // if (isPlatformBrowser(this.platformId)) {
        //   const backgroundImage = this.bgService.getBackgroundImage();
        //   this.renderer.setStyle(document.body, 'transition', 'background-image 1s ease-in-out');
        //   this.renderer.setStyle(document.body, 'background-image', `url('${backgroundImage}')`);
        //   this.renderer.setStyle(document.body, 'background-size', 'cover');
        //   this.renderer.setStyle(document.body, 'background-position', 'center');
        //   this.renderer.setStyle(document.body, 'background-repeat', 'no-repeat');
        //   this.renderer.setStyle(document.body, 'background-attachment', 'fixed');
        // }
    }

    ngOnInit() {
        const currentDomain = window.location.hostname;
        this.isTargetDomain = (currentDomain === 'index.mryan2005.top');
        console.info("currentDomain:",  currentDomain)
        this.cdr.markForCheck();
    }

    processBarButtonClicked(buttonName: string) {
        // this.currentDisplayPart = buttonName;
        this.cdr.markForCheck();
    }
}

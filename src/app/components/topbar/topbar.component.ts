import {Component, EventEmitter, Input, OnInit, Output, OutputEmitterRef} from '@angular/core';
import {WebsitePramasService} from '../../services/Website-pramas';
import {Router} from '@angular/router';

@Component({
    selector: 'app-topbar',
    imports: [],
    standalone: true,
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.scss'
})

export class TopbarComponent implements OnInit {
    @Input() currentTime: string = '';
    @Input() barTitle: string = 'Desktop';
    @Output() clickBarButton = new EventEmitter<string>();

    isFilesPage: boolean = false;

    constructor(
        public websitePramas: WebsitePramasService,
        private router: Router
    ) {
    }

    clickBarButton1(buttonName: string) {
        console.debug(`TopbarComponent: clickBarButton1 called with buttonName=${buttonName}`);
        this.websitePramas.currentDisplayPart = buttonName;
        const routeMap: Record<string, string> = {
            Home: 'home',
            Works: 'works',
            Travel: 'travel',
            Task: 'task',
            Files: 'files',
            Contact: 'contact',
            Help: 'help'
        };
        this.router.navigate([routeMap[buttonName] ?? 'home']);
    }

    onPingClick(event: Event): void {
        event.stopPropagation();
        this.websitePramas.triggerPing();
    }

    onProgressClick(event: Event): void {
        event.stopPropagation();
        this.websitePramas.toggleProgressOverlay();
    }

    ngOnInit(): void {
        this.websitePramas.currentDisplayPart$.subscribe((part) => {
            this.isFilesPage = part === 'Files';
        });
    }

}

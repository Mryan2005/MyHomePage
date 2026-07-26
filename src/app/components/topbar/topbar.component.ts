import {Component, EventEmitter, Input, OnInit, Output, OutputEmitterRef, ChangeDetectorRef, NgZone} from '@angular/core';
import {WebsitePramasService} from '../../services/Website-pramas';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';

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
    isTaskPage: boolean = false;

    constructor(
        public websitePramas: WebsitePramasService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private zone: NgZone
    ) {
    }

    clickBarButton1(buttonName: string) {
        console.debug(`TopbarComponent: clickBarButton1 called with buttonName=${buttonName}`);
        this.websitePramas.currentDisplayPart = buttonName;
        const routeMap: Record<string, string> = {
            Home: 'home',
            Works: 'works',
            Travel: 'travel',
            Now: 'now',
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

    private updatePageFlags(url: string) {
        const isFiles = url.startsWith('/files');
        const isTask = url.startsWith('/now');
        if (this.isFilesPage !== isFiles || this.isTaskPage !== isTask) {
            this.zone.run(() => {
                this.isFilesPage = isFiles;
                this.isTaskPage = isTask;
            });
        }
    }

    ngOnInit(): void {
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e) => {
                this.updatePageFlags((e as NavigationEnd).urlAfterRedirects);
            });

        this.updatePageFlags(this.router.url);
    }

}

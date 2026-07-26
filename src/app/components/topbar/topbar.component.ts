import {Component, EventEmitter, Input, OnInit, Output, OutputEmitterRef, ChangeDetectorRef} from '@angular/core';
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
        private cdr: ChangeDetectorRef
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

    private updatePageFlags(url: string) {
        this.isFilesPage = url.startsWith('/files');
        this.isTaskPage = url.startsWith('/task');
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        // 监听路由变化（覆盖直接 URL 导航、前进后退等所有情况）
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e) => {
                this.updatePageFlags((e as NavigationEnd).urlAfterRedirects);
            });

        // 初始化时也检查一次
        this.updatePageFlags(this.router.url);
    }

}

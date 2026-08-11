import {Component, EventEmitter, Input, OnInit, Output, OutputEmitterRef, ChangeDetectorRef, NgZone, HostListener} from '@angular/core';
import {WebsitePramasService} from '../../services/Website-pramas';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';

interface HelpMenuItem {
    label: string;
    action: () => void;
}

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
    showHelpMenu = false;
    showAboutModal = false;
    aboutModalTitle = '';
    aboutModalContent = '';
    currentPage = 'home';
    helpMenuItems: HelpMenuItem[] = [];

    constructor(
        public websitePramas: WebsitePramasService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private zone: NgZone
    ) {
    }

    clickBarButton1(buttonName: string) {
        console.debug(`TopbarComponent: clickBarButton1 called with buttonName=${buttonName}`);
        this.showHelpMenu = false;
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

    toggleShowPause(event: Event): void {
        event.stopPropagation();
        this.websitePramas.showPause = !this.websitePramas.showPause;
    }

    toggleShowDone(event: Event): void {
        event.stopPropagation();
        this.websitePramas.showDone = !this.websitePramas.showDone;
    }

    toggleHelpMenu(event: Event): void {
        event.stopPropagation();
        this.showHelpMenu = !this.showHelpMenu;
    }

    closeHelpMenu(): void {
        this.showHelpMenu = false;
    }

    @HostListener('document:click')
    onDocumentClick(): void {
        if (this.showHelpMenu) {
            this.showHelpMenu = false;
            this.cdr.detectChanges();
        }
    }

    openAboutModal(): void {
        this.closeHelpMenu();

        const aboutContent: Record<string, { title: string; content: string }> = {
            home: {
                title: '关于本站',
                content: '<p>这是 <b>Mryan2005</b> 的个人主页，展示作品、旅行足迹、任务进展、文件分享和联系方式。</p><p>本站使用 Angular 构建，设计风格致敬 Apple 的简洁美学。</p>',
            },
            works: {
                title: '关于 Works',
                content: '<p>这里列出了我的开源项目和个人作品。</p><p>每项标注了 <b>Public Repo</b>（公开仓库）或 <b>Private Repo</b>（私有仓库），点击可跳转到对应链接。</p>',
            },
            travel: {
                title: '关于 Travel',
                content: '<p>这里嵌入了一张交互式地图，记录我去过的地方。</p><p>数据来自 <b>Where Have I Been</b> 项目，展示我的旅行足迹。</p>',
            },
            now: {
                title: '关于 Now',
                content: '<p>这是一个 Now 页面，灵感来自 <a href="https://nownownow.com" target="_blank">nownownow.com</a>，描述我最新的关注点和近况。</p>',
            },
            files: {
                title: '关于 Files',
                content: '<p>这里列出了我分享的文件和云端文档链接。</p><p>每项标注了 <b>Can Open</b>（可访问）或 <b>Cannot Open</b>（暂不可访问）的状态。</p>',
            },
            contact: {
                title: '关于 Contact',
                content: '<p>这里列出了联系我的各种方式。</p><p>每项标注了 <b>Valid</b>（有效）或 <b>Not Valid</b>（暂不可用），点击可跳转到对应链接。</p>',
            },
        };

        const info = aboutContent[this.currentPage] || aboutContent['home'];
        this.aboutModalTitle = info.title;
        this.aboutModalContent = info.content;
        this.showAboutModal = true;
    }

    closeAboutModal(): void {
        this.showAboutModal = false;
    }

    private updateHelpMenu(): void {
        const menus: Record<string, HelpMenuItem[]> = {
            home: [
                { label: '关于本站', action: () => this.openAboutModal() },
            ],
            works: [
                { label: '关于', action: () => this.openAboutModal() },
            ],
            travel: [
                { label: '关于', action: () => this.openAboutModal() },
            ],
            now: [
                { label: '关于', action: () => this.openAboutModal() },
            ],
            files: [
                { label: '关于', action: () => this.openAboutModal() },
            ],
            contact: [
                { label: '关于', action: () => this.openAboutModal() },
            ],
        };

        this.helpMenuItems = menus[this.currentPage] || menus['home'];
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

        // 提取当前页面名
        const page = url.split('/')[1] || 'home';
        if (this.currentPage !== page) {
            this.zone.run(() => {
                this.currentPage = page;
                this.updateHelpMenu();
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

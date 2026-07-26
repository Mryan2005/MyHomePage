import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubDiscussionsService } from '../../services/github-discussions.service';
import { WebsitePramasService } from '../../services/Website-pramas';
import { GithubDiscussion } from '../../interfaces/github-discussion';
import { firstValueFrom } from 'rxjs';
import { Subscription } from 'rxjs';

interface StatusSegment {
    key: string;
    label: string;
    count: number;
    pct: number;       // 整数，用于 bar width
    pctText: string;   // 一位小数文本，如 "33.4%"
    color: string;
}

@Component({
    selector: 'app-sub-progress-overview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sub-progress-overview.html',
    styleUrl: './sub-progress-overview.scss'
})
export class SubProgressOverviewComponent implements OnInit, OnDestroy {

    loading = false;
    error = '';

    segments: StatusSegment[] = [];
    totalDiscussions = 0;

    show = false;
    private overlaySubscription?: Subscription;

    constructor(
        private githubDiscussionsService: GithubDiscussionsService,
        private websitePramas: WebsitePramasService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit() {
        this.overlaySubscription = this.websitePramas.showProgressOverlay$.subscribe((visible) => {
            this.show = visible;
            if (visible) {
                this.loadData();
            }
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy() {
        this.overlaySubscription?.unsubscribe();
    }

    async loadData() {
        this.loading = true;
        this.error = '';
        this.cdr.detectChanges();

        try {
            const discussions: GithubDiscussion[] =
                await firstValueFrom(this.githubDiscussionsService.getDiscussions());
            this.computeStats(discussions);
        } catch (e) {
            this.error = '加载进度数据失败';
        } finally {
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    computeStats(discussions: GithubDiscussion[]) {
        this.totalDiscussions = discussions.length;
        let ongoing = 0, pause = 0, done = 0;

        for (const d of discussions) {
            if (d.labels.length) {
                pause++;
            } else if (d.closed) {
                done++;
            } else {
                ongoing++;
            }
        }

        const raw: { key: string; label: string; count: number; color: string }[] = [
            { key: 'ongoing', label: '进行中', count: ongoing, color: '#58a6ff' },
            { key: 'pause',   label: '暂停',   count: pause,  color: '#d29922' },
            { key: 'done',    label: '已完成', count: done,   color: '#3fb950' },
        ];

        // 计算精确百分比（一位小数）
        const intPcts = raw.map(item =>
            this.totalDiscussions > 0
                ? Math.round((item.count / this.totalDiscussions) * 100)
                : 0
        );

        // 最后一段补足 100%，避免四舍五入误差
        const sumExceptLast = intPcts.slice(0, -1).reduce((a, b) => a + b, 0);
        intPcts[intPcts.length - 1] = Math.max(0, 100 - sumExceptLast);

        this.segments = raw.map((item, i) => ({
            ...item,
            pct: intPcts[i],
            pctText: (this.totalDiscussions > 0
                ? ((item.count / this.totalDiscussions) * 100).toFixed(1)
                : '0.0') + '%',
        }));
    }

    close() {
        this.websitePramas.closeProgressOverlay();
    }

    onOverlayClick(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('overlay-bg')) {
            this.close();
        }
    }
}

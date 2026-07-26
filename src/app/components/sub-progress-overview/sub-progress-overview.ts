import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubDiscussionsService } from '../../services/github-discussions.service';
import { WebsitePramasService } from '../../services/Website-pramas';
import { GithubDiscussion } from '../../interfaces/github-discussion';
import { firstValueFrom } from 'rxjs';
import { Subscription } from 'rxjs';

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

    /** 子任务进度 */
    overallTotal = 0;
    overallCompleted = 0;
    overallPercent = 0;

    /** 讨论状态统计 */
    totalDiscussions = 0;
    ongoingCount = 0;
    pauseCount = 0;
    doneCount = 0;

    /** 状态条各段百分比 */
    ongoingPct = 0;
    pausePct = 0;
    donePct = 0;

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
        // 子任务进度
        this.overallTotal = 0;
        this.overallCompleted = 0;
        for (const d of discussions) {
            if (d.progress) {
                this.overallTotal += d.progress.total;
                this.overallCompleted += d.progress.completed;
            }
        }
        this.overallPercent = this.overallTotal > 0
            ? Math.round((this.overallCompleted / this.overallTotal) * 100)
            : 0;

        // 讨论状态统计
        this.totalDiscussions = discussions.length;
        this.ongoingCount = 0;
        this.pauseCount = 0;
        this.doneCount = 0;

        for (const d of discussions) {
            if (d.labels.length) {
                this.pauseCount++;
            } else if (d.closed) {
                this.doneCount++;
            } else {
                this.ongoingCount++;
            }
        }

        // 状态条百分比
        if (this.totalDiscussions > 0) {
            this.ongoingPct = Math.round((this.ongoingCount / this.totalDiscussions) * 100);
            this.pausePct = Math.round((this.pauseCount / this.totalDiscussions) * 100);
            // donePct 补足 100%，避免四舍五入误差
            this.donePct = 100 - this.ongoingPct - this.pausePct;
        } else {
            this.ongoingPct = 0;
            this.pausePct = 0;
            this.donePct = 0;
        }
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

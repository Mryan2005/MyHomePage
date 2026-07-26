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

    overallTotal = 0;
    overallCompleted = 0;
    overallPercent = 0;

    /** SVG 圆环周长 (r=52) */
    readonly circumference = 2 * Math.PI * 52;
    /** SVG stroke-dashoffset */
    get dashOffset(): number {
        return this.circumference * (1 - this.overallPercent / 100);
    }

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
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy() {
        this.overlaySubscription?.unsubscribe();
    }

    async loadData() {
        this.loading = true;
        this.error = '';
        this.cdr.markForCheck();

        try {
            const discussions: GithubDiscussion[] =
                await firstValueFrom(this.githubDiscussionsService.getDiscussions());
            this.computeOverall(discussions);
        } catch (e) {
            this.error = '加载进度数据失败';
        } finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    computeOverall(discussions: GithubDiscussion[]) {
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

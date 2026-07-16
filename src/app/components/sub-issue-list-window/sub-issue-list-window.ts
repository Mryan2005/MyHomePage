import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GithubDiscussionsService} from '../../services/github-discussions.service';
import {GithubDiscussion} from '../../interfaces/github-discussion';
import {firstValueFrom} from 'rxjs';

@Component({
    selector: 'app-sub-issue-list-window',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sub-issue-list-window.html',
    styleUrl: './sub-issue-list-window.scss'
})
export class SubIssueListComponent implements OnInit {

    discussions: GithubDiscussion[] = [];
    selectedDiscussion?: GithubDiscussion;

    loading = false;
    error = '';

    constructor(
        private githubDiscussionsService: GithubDiscussionsService,
        public cdr: ChangeDetectorRef
    ) {
    }

    async ngOnInit() {

        this.loading = true;

        try {

            this.discussions =
                await firstValueFrom(
                    this.githubDiscussionsService.getDiscussions()
                );
            this.selectedDiscussion = this.discussions[0];
            this.cdr.detectChanges();
        } catch (e) {

            this.error = '加载失败';
            this.cdr.detectChanges();

        } finally {

            this.loading = false;
            this.cdr.detectChanges();

        }
    }

    selectDiscussion(discussion: GithubDiscussion): void {
        this.selectedDiscussion = discussion;
    }

    getStatus(discussion: GithubDiscussion): 'Pause' | 'Ongoing' | 'Done' {
        if (discussion.labels.length) {
            return 'Pause';
        }
        return discussion.closed ? 'Done' : 'Ongoing';
    }

    getTimeAgo(createdAt: string): string {
        const now = new Date().getTime();
        const created = new Date(createdAt).getTime();
        const diffMinutes = Math.max(1, Math.floor((now - created) / 60000));

        if (diffMinutes < 60) {
            return `${diffMinutes}m`;
        }

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            return `${diffHours}h`;
        }

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d`;
    }
}

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
            this.cdr.detectChanges();
        } catch (e) {

            this.error = '加载失败';
            this.cdr.detectChanges();

        } finally {

            this.loading = false;
            this.cdr.detectChanges();

        }
    }
}

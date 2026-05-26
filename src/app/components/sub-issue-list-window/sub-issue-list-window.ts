import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GithubIssuesService} from '../../services/github-issues.service';
import {GithubIssue} from '../../interfaces/github-issue';
import {firstValueFrom} from 'rxjs';

@Component({
    selector: 'app-sub-issue-list-window',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sub-issue-list-window.html',
    styleUrl: './sub-issue-list-window.scss'
})
export class SubIssueListComponent implements OnInit {

    issues: GithubIssue[] = [];

    loading = false;
    error = '';

    constructor(
        private githubIssuesService: GithubIssuesService
    ) {
    }

    async ngOnInit() {

        this.loading = true;

        try {

            this.issues =
                await firstValueFrom(
                    this.githubIssuesService.getIssues()
                );

        } catch (e) {

            this.error = '加载失败';

        } finally {

            this.loading = false;
        }
    }
}

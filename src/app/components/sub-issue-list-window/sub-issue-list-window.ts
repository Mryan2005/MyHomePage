import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GithubIssuesService} from '../../services/github-issues.service';
import {GithubIssue} from '../../interfaces/github-issue';

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

    ngOnInit(): void {
        this.loadIssues();
    }

    loadIssues(): void {

        this.loading = true;

        this.githubIssuesService.getIssues({
            owner: 'Mryan2005',
            repo: 'MyHomePage',
            labels: 'status',
            state: 'open',
            per_page: 10,
            page: 1,
        }).subscribe({

            next: (res) => {
                this.issues = res;
                this.loading = false;
            },

            error: (err) => {
                this.error = err?.message || '加载失败';
                this.loading = false;
            }

        });
    }
}

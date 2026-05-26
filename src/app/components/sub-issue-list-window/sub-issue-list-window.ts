import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GithubDiscussionsService} from '../../services/github-discussions.service';
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

    discussions: GithubIssue[] = [];

    loading = false;
    error = '';

    constructor(
        private githubDiscussionsService: GithubDiscussionsService
    ) {
    }

    async ngOnInit() {

        this.loading = true;

        try {

            this.discussions =
                await firstValueFrom(
                    this.githubDiscussionsService.getDiscussions()
                );

        } catch (e) {

            this.error = '加载失败';

        } finally {

            this.loading = false;
        }
    }
}

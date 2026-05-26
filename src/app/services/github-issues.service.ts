import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GithubIssue} from '../interfaces/github-issue';
import {Octokit} from 'octokit';

@Injectable({
    providedIn: 'root',
})
export class GithubIssuesService {
    constructor(private http: HttpClient) {
    }

    private octokit = new Octokit({
        auth: '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'
    });

    async getIssues(owner: string, repo: string) {

        const res = await this.octokit.request(
            'GET /repos/{owner}/{repo}/issues',
            {
                owner,
                repo,
                labels: "status",
                per_page: 10
            }
        );

        return res.data;
    }
}

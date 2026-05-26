import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Octokit} from 'octokit';
import {environment} from '../environments/environment.local';

@Injectable({
    providedIn: 'root',
})
export class GithubIssuesService {
    constructor(private http: HttpClient) {
    }

    private octokit = new Octokit({
        auth: `${environment.githubToken}`
    });

    getIssues() {
        return this.http.get<any[]>(
            '/assets/issues.json'
        );
    }
}

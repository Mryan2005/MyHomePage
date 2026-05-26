import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GithubIssue} from '../interfaces/github-issue';

@Injectable({
    providedIn: 'root',
})
export class GithubIssuesService {
    constructor(private http: HttpClient) {
    }

    getIssues(params: {
        owner: string;
        repo: string;
        labels: string | string[];
        state?: 'open' | 'closed' | 'all';
        per_page?: number;
        page?: number;
    }): Observable<GithubIssue[]> {
        const headers = new HttpHeaders({
            Authorization: `Bearer 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`
        });

        const labels = Array.isArray(params.labels)
            ? params.labels.join(',')
            : params.labels;

        let httpParams = new HttpParams()
            .set('state', params.state ?? 'open')
            .set('per_page', String(params.per_page ?? 10))
            .set('page', String(params.page ?? 1));

        if (labels) {
            httpParams = httpParams.set('labels', labels);
        }

        const url = `https://api.github.com/repos/${params.owner}/${params.repo}/issues`;

        return this.http.get<GithubIssue[]>(url, {
            params: httpParams,
            headers
        });
    }
}

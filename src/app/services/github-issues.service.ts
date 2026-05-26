import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class GithubIssuesService {
    constructor(private http: HttpClient) {
    }

    getIssues() {
        return this.http.get<any[]>(
            '/assets/issues.json'
        );
    }
}

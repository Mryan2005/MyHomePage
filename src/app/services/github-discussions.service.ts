import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class GithubDiscussionsService {
    constructor(private http: HttpClient) {
    }

    getDiscussions() {

        return this.http.get<any[]>(
            '/assets/discussions.json'
        );
    }
}

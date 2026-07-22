import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebsitePramasService {
    private currentDisplayPartSubject = new BehaviorSubject<string>('Home');
    private filesPingRequestedSubject = new Subject<void>();

    get currentDisplayPart$(): Observable<string> {
        return this.currentDisplayPartSubject.asObservable();
    }

    get currentDisplayPart(): string {
        return this.currentDisplayPartSubject.value;
    }

    set currentDisplayPart(value: string) {
        this.currentDisplayPartSubject.next(value);
    }

    get filesPingRequested$(): Observable<void> {
        return this.filesPingRequestedSubject.asObservable();
    }

    requestFilesPing(): void {
        this.filesPingRequestedSubject.next();
    }
}
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebsitePramasService {
    private currentDisplayPartSubject = new BehaviorSubject<string>('Home');

    get currentDisplayPart$(): Observable<string> {
        return this.currentDisplayPartSubject.asObservable();
    }

    get currentDisplayPart(): string {
        return this.currentDisplayPartSubject.value;
    }

    set currentDisplayPart(value: string) {
        this.currentDisplayPartSubject.next(value);
    }
}
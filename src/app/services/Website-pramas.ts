import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebsitePramasService {
    private currentDisplayPartSubject = new BehaviorSubject<string>('Home');
    private pingTriggerSubject = new Subject<void>();
    private showProgressOverlaySubject = new BehaviorSubject<boolean>(false);

    get currentDisplayPart$(): Observable<string> {
        return this.currentDisplayPartSubject.asObservable();
    }

    get pingTrigger$(): Observable<void> {
        return this.pingTriggerSubject.asObservable();
    }

    get showProgressOverlay$(): Observable<boolean> {
        return this.showProgressOverlaySubject.asObservable();
    }

    get currentDisplayPart(): string {
        return this.currentDisplayPartSubject.value;
    }

    set currentDisplayPart(value: string) {
        this.currentDisplayPartSubject.next(value);
    }

    get showProgressOverlay(): boolean {
        return this.showProgressOverlaySubject.value;
    }

    triggerPing(): void {
        this.pingTriggerSubject.next();
    }

    toggleProgressOverlay(): void {
        this.showProgressOverlaySubject.next(!this.showProgressOverlaySubject.value);
    }

    closeProgressOverlay(): void {
        this.showProgressOverlaySubject.next(false);
    }
}
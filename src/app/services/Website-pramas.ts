import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebsitePramasService {
    private currentDisplayPartSubject = new BehaviorSubject<string>('Home');
    private pingTriggerSubject = new Subject<void>();
    private showProgressOverlaySubject = new BehaviorSubject<boolean>(false);
    private showPauseSubject = new BehaviorSubject<boolean>(false);
    private showDoneSubject = new BehaviorSubject<boolean>(false);

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

    get showPause$(): Observable<boolean> {
        return this.showPauseSubject.asObservable();
    }

    get showPause(): boolean {
        return this.showPauseSubject.value;
    }

    set showPause(value: boolean) {
        this.showPauseSubject.next(value);
    }

    get showDone$(): Observable<boolean> {
        return this.showDoneSubject.asObservable();
    }

    get showDone(): boolean {
        return this.showDoneSubject.value;
    }

    set showDone(value: boolean) {
        this.showDoneSubject.next(value);
    }
}
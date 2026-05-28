import {Injectable} from '@angular/core';
import {ChangeDetectorRef} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WebsitePramasService {
    constructor(
        public cdr: ChangeDetectorRef
    ) {
    }

    private _currentDisplayPart: string = 'Home';

    get currentDisplayPart(): string {
        return this._currentDisplayPart;
    }

    set currentDisplayPart(value: string) {
        this._currentDisplayPart = value;
        this.cdr.detectChanges();
    }
}
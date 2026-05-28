import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WebsitePramasService {
    constructor() {
    }

    private _currentDisplayPart: string = 'Home';

    get currentDisplayPart(): string {
        return this._currentDisplayPart;
    }

    set currentDisplayPart(value: string) {
        this._currentDisplayPart = value;
    }
}
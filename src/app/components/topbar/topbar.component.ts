import {Component, EventEmitter, Input, OnInit, Output, OutputEmitterRef} from '@angular/core';
import {WebsitePramas} from '../../services/Website-pramas';

@Component({
    selector: 'app-topbar',
    imports: [],
    standalone: true,
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.scss'
})

export class TopbarComponent implements OnInit {
    @Input() currentTime: string = '';
    @Input() barTitle: string = 'Desktop';
    @Output() clickBarButton = new EventEmitter<string>();

    constructor(
        public websitePramas: WebsitePramas
    ) {
    }

    clickBarButton1(buttonName: string) {
        console.debug(`TopbarComponent: clickBarButton1 called with buttonName=${buttonName}`);
        this.websitePramas.currentDisplayPart = buttonName;
    }

    ngOnInit(): void {
    }

}

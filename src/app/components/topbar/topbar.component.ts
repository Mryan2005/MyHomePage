import {Component, EventEmitter, Input, OnInit, Output, OutputEmitterRef} from '@angular/core';

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

    constructor() {
    }

    clickBarButton1(buttonName: string) {
        this.clickBarButton.emit(buttonName);
    }

    ngOnInit(): void {
    }

}

import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AvatarService} from '../../config/avatar';
import {SubTravellingWindow} from '../sub-travelling-window/sub-travelling-window';
import {SubIntroduceMyselfWindow} from '../sub-introduce-myself-window/sub-introduce-myself-window';
import {SubIssueListComponent} from '../sub-issue-list-window/sub-issue-list-window';
import {SubWorksListWindow} from '../sub-works-list-window/sub-works-list-window';
import {SubContactListWindow} from '../sub-contact-list-window/sub-contact-list-window';
import {WebsitePramasService} from '../../services/Website-pramas';
import {Subscription} from 'rxjs';
import {SubFilesListWindow} from '../sub-files-list-window/sub-files-list-window';
import { After } from 'node:v8';
declare const liquidGL: any;
@Component({
    selector: 'app-inside-window',
    imports: [
        SubTravellingWindow,
        SubIntroduceMyselfWindow,
        SubIssueListComponent,
        SubWorksListWindow,
        SubContactListWindow,
        SubFilesListWindow
    ],
    standalone: true,
    templateUrl: './inside-window.html',
    styleUrl: './inside-window.scss'
})
export class InsideWindow implements OnInit, OnDestroy, AfterViewInit {
    constructor(
        public avatarService: AvatarService,
        public websitePramas: WebsitePramasService
    ) {
    }

    public currentDisplayPart: string = 'Home';
    private displayPartSubscription?: Subscription;

    ngOnInit() {
        this.displayPartSubscription = this.websitePramas.currentDisplayPart$.subscribe(
            (value) => {
                this.currentDisplayPart = value;
            }
        );
    }

    ngAfterViewInit() {
        liquidGL({
            target: ".liquidGL",
            snapshot: "body",
            resolution:2,
            refraction:0.01,
            bevelDepth:0.08,
            bevelWidth:0.15,
            frost:2,
            shadow:true,
            specular:true,
            reveal:"fade",
            tilt:false,
            magnify:1
        });
    }

    ngOnDestroy(): void {
        this.displayPartSubscription?.unsubscribe();
    }
}

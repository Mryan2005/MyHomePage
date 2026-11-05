import {Component, ElementRef, ViewChild} from '@angular/core';
import {ROADMAP} from '../../data/roadmap';
import {buildRoadmap, RoadmapDisplayStage} from './roadmap.model';

@Component({
    selector: 'app-roadmap',
    standalone: true,
    templateUrl: './roadmap.html',
    styleUrl: './roadmap.scss'
})
export class RoadmapComponent {
    readonly items = buildRoadmap(ROADMAP);
    selectedEvent?: RoadmapDisplayStage;
    @ViewChild('eventDialog') private eventDialog?: ElementRef<HTMLDialogElement>;

    openEvent(event: Event, item: RoadmapDisplayStage): void {
        event.preventDefault();
        event.stopPropagation();
        this.selectedEvent = item;
        this.eventDialog?.nativeElement.showModal();
    }

    onEventBackdropClick(event: MouseEvent): void {
        const dialog = this.eventDialog?.nativeElement;
        if (!dialog || event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
}

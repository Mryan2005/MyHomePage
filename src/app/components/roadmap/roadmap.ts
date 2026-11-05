import {Component} from '@angular/core';
import {ROADMAP} from '../../data/roadmap';
import {buildRoadmap} from './roadmap.model';

@Component({
    selector: 'app-roadmap',
    standalone: true,
    templateUrl: './roadmap.html',
    styleUrl: './roadmap.scss'
})
export class RoadmapComponent {
    readonly items = buildRoadmap(ROADMAP);
}

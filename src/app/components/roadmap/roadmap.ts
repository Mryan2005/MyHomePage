import {Component} from '@angular/core';
import {ROADMAP} from '../../data/roadmap';

@Component({
    selector: 'app-roadmap',
    standalone: true,
    templateUrl: './roadmap.html',
    styleUrl: './roadmap.scss'
})
export class RoadmapComponent {
    // Adapt the year/month configuration to the Roadmap cards' period/title/description model.
    readonly items = Object.entries(ROADMAP)
        .map(([year, months]) => ({
            year: Number(year),
            months: Object.entries(months)
                .map(([month, tasks]) => ({
                    month: Number(month),
                    tasks: (tasks ?? []).filter(task => task.trim().length > 0)
                }))
                .filter(({tasks}) => tasks.length > 0)
                .sort((a, b) => a.month - b.month)
        }))
        .filter(({months}) => months.length > 0)
        .sort((a, b) => a.year - b.year)
        .flatMap(({year, months}) => months.map(({month, tasks}) => ({
            period: `${year} 年`,
            title: `${month} 月`,
            description: tasks.map(task => `• ${task}`).join('\n')
        })));
}

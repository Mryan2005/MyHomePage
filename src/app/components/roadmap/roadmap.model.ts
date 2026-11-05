import {RoadmapData, RoadmapStage, RoadmapTask} from '../../data/roadmap';

export interface RoadmapDisplayTask {
    title: string;
    description: string;
    status: string;
    link: string;
}

export interface RoadmapDisplayStage {
    title: string;
    period: string;
    description: string;
    tasks: RoadmapDisplayTask[];
}

function normalizeTask(task: RoadmapTask): RoadmapDisplayTask {
    const value = typeof task === 'string' ? {title: task} : task;
    const link = value.link?.trim() ?? '';
    return {
        title: value.title.trim(),
        description: value.description?.trim() ?? '',
        status: value.status?.trim() ?? '',
        link: /^https?:\/\//i.test(link) ? link : ''
    };
}

function compareGroups(a: [string, unknown], b: [string, unknown]): number {
    const numberA = /^\d+$/.test(a[0]);
    const numberB = /^\d+$/.test(b[0]);
    if (numberA && numberB) return Number(a[0]) - Number(b[0]);
    return Number(numberB) - Number(numberA);
}

export function buildRoadmap(data: RoadmapData): RoadmapDisplayStage[] {
    const stages: readonly RoadmapStage[] = Array.isArray(data) ? data :
        Object.entries(data).sort(compareGroups).flatMap(([year, groups]) =>
            Object.entries(groups).sort(compareGroups).map(([month, tasks]) => ({
                period: /^\d+$/.test(year) ? `${year} 年` : year,
                title: /^\d+$/.test(month) ? `${month} 月` : month,
                items: tasks as readonly RoadmapTask[]
            })));
    return stages.map(stage => ({
        title: stage.title.trim(),
        period: stage.period?.trim() ?? '',
        description: stage.description?.trim() ?? '',
        tasks: (stage.items ?? []).map(normalizeTask).filter(task => task.title.length > 0)
    })).filter(stage => stage.title.length > 0 && (stage.description.length > 0 || stage.tasks.length > 0));
}

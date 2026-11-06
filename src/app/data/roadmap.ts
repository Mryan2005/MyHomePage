/** 简单事项可直接写字符串，详细事项可填写标题、说明、状态和链接。 */
export type RoadmapTask = string | {
    title: string;
    description?: string;
    status?: string;
    link?: string;
};

/** 可预先填写的选择方向。 */
export interface RoadmapChoice {
    id: string;
    title: string;
    description?: string;
    reason?: string;
    /** 回看时补充的假设分支，并非当时已发生或确曾考虑的事件。 */
    retrospective?: boolean;
}

/** 自由阶段：时间可写年份、区间、季度或「长期」，也可以不填。 */
export interface RoadmapStage {
    title: string;
    period?: string;
    description?: string;
    items?: readonly RoadmapTask[];
    state?: 'past' | 'current' | 'future';
    choices?: readonly RoadmapChoice[];
    /** 未来倾向，随时可调整，不表示已经作出决定。 */
    preferredChoice?: string;
    /** 已经实际作出的选择，填写对应选项的 id。 */
    selectedChoice?: string;
}

/** 支持原来的 年份 → 月份 → 事项，也支持按填写顺序展示的自由阶段数组。 */
export type RoadmapData = Record<string, Record<string, readonly RoadmapTask[]>> | readonly RoadmapStage[];

// 按「事件 → 选择 → 后续走向」组织。未来分支是设想，日期是大致目标。
export const ROADMAP: RoadmapData = [
    {
        title: '意外的开始',
        state: 'past',
        description: '',
        items: [
            // {
            //     title: '18 岁入沪上大学',
            //     description: '实现文档链接预览，并为 DOCX 探索项目自有的编辑引擎。',
            //     link: 'https://github.com/YohooSoft/markdown-it-new',
            // },
            {
                title: '18 岁入沪上大学',
                description: '',
            }
        ],
    },
    {
        title: '等我有空再写',
        state: 'past',
        description: '',
        items: [
            {
                title: '未填写',
                description: '',
            },
        ],
    },
    {
        title: '抉择 · 考研？就业？',
        state: 'past',
        description: '究竟是考研还是就业呢？',
        choices: [
            {
                id: 'kaoyan',
                title: '考研',
                description: '就是考吧',
                reason: 'Tsukihana 的代码还要完成，需要更多的时间去做',
            },
            {
                id: 'jiuye',
                title: '就业',
                description: '就是再上海找班上',
                reason: '其实，如果你想落沪，这时候就得等 7 年了，还不如考研'
            },
        ],
        selectedChoice: 'kaoyan',
    },
    {
        period: '2026 年 11 月',
        title: '为了留在所爱的城市',
        state: 'current',
        description: '眼前的主线是备考，上岸再说。',
        items: ['备考复习与刷题'],
    },
];

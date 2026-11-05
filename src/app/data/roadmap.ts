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

// 阶段按数组顺序展示；period、description 和事项状态均可自由填写。
export const ROADMAP: RoadmapData = [
    {
        period: '2026 年 11 月',
        title: 'PROLOGUE · 故事的起点',
        state: 'current',
        description: '下一段旅程，从眼前的复习与刷题开始。',
        items: ['备考复习与刷题'],
    },
    {
        period: '2026 年 12 月',
        title: 'CHAPTER 01 · 为下一程做准备',
        state: 'future',
        items: ['参加考试', '撰写毕业设计计划书'],
    },
    {
        period: '2027 年 1 月',
        title: 'CHAPTER 02 · 完成眼前的课题',
        state: 'future',
        items: ['推进毕业设计'],
    },
    {
        period: '2027 年 2 月',
        title: 'DECISION 01 · 继续走向深造之路',
        state: 'future',
        choices: [{id: 'postgraduate', title: '继续读研', description: '目标：顺利上岸。'}],
        preferredChoice: 'postgraduate',
        items: [
            '继续推进毕业设计',
            {title: '顺利上岸', status: '目标'},
        ],
    },
    {
        period: '2027 年 3 月',
        title: 'CHAPTER 03 · 向下一站靠近',
        state: 'future',
        items: ['准备研究生复试'],
    },
    {
        period: '2030 年 6 月',
        title: 'DECISION 02 · 把研究继续下去',
        state: 'future',
        choices: [{id: 'hong-kong-phd', title: '赴香港攻读博士学位'}],
        preferredChoice: 'hong-kong-phd',
    },
    {
        period: '2034 年 1 月',
        title: 'CHAPTER 04 · 渐近终章',
        state: 'future',
        description: '或许，离博士毕业已经不远了吧。',
    },
    {
        period: '2038 年 7 月',
        title: 'TO BE CONTINUED · 未完待续',
        state: 'future',
        description: '那时，应该已经取得香港永久居民身份了吧。',
    },
];

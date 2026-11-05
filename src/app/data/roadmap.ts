/** 简单事项可直接写字符串，详细事项可填写标题、说明、状态和链接。 */
export type RoadmapTask = string | {
    title: string;
    description?: string;
    status?: string;
    link?: string;
};

/** 自由阶段：时间可写年份、区间、季度或「长期」，也可以不填。 */
export interface RoadmapStage {
    title: string;
    period?: string;
    description?: string;
    items?: readonly RoadmapTask[];
}

/** 支持原来的 年份 → 月份 → 事项，也支持按填写顺序展示的自由阶段数组。 */
export type RoadmapData = Record<string, Record<string, readonly RoadmapTask[]>> | readonly RoadmapStage[];

export const ROADMAP: RoadmapData = {
    // 按以下格式添加实际计划；空月份、空年份不会显示。
    2026: {
        11: ['备考刷题'],
        12: ['考试', '写毕设计划书'],
    },
    2027: {
        1: ['做毕设'],
        2: ['做毕设', '上岸'],
        3: ['准备复试']
    },
    2030: {
        6: ['港博']
    },
    2034: {
        1: ['或许，快毕业了吧']
    },
    2038: {
        7: ['应该已经拿到香港港永居了吧']
    }
};

// 也可以将上面的整个对象替换成阶段数组，完全按填写顺序展示：
// export const ROADMAP: RoadmapData = [
//     {
//         period: '2027–2030',
//         title: '自定义阶段标题',
//         description: '阶段说明，可写多行文字。',
//         items: [
//             '简单事项',
//             {title: '详细事项', description: '补充说明', status: '计划中', link: 'https://example.com'},
//         ],
//     },
//     {title: '长期愿景', description: '不必填写具体日期，也不必填写事项列表。'},
// ];

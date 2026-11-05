export type RoadmapMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** 年份 → 月份（1–12）→ 要做的事情。年份、月份会按升序展示。 */
export type RoadmapData = Record<number, Partial<Record<RoadmapMonth, readonly string[]>>>;

export const ROADMAP: RoadmapData = {
    // 按以下格式添加实际计划；空月份、空年份不会显示。
    2026: {
        11: ['备考刷题'],
        12: ['考试', '写毕设计划书'],
    },
    2027: {
        1: ['做毕设'],
        2: ['做毕设', '上岸']
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

export type RoadmapMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** 年份 → 月份（1–12）→ 要做的事情。年份、月份会按升序展示。 */
export type RoadmapData = Record<number, Partial<Record<RoadmapMonth, readonly string[]>>>;

export const ROADMAP: RoadmapData = {
    // 按以下格式添加实际计划；空月份、空年份不会显示。
    // 2026: {
    //     11: ['要做的事情', '另一件要做的事情'],
    //     12: ['要做的事情'],
    // },
    // 2027: {
    //     1: ['要做的事情'],
    // },
};

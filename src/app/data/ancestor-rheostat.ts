export interface AncestorRank {
    level: number;
    name: string;
    description: string;
    image: string;
    accent: string;
}

// 当前状态和当前风评可在这里独立配置。
export const ANCESTOR_CURRENT_STATE = '还在干这行，不好不坏';
export const ANCESTOR_CURRENT_VIBE = 2;

// 是否允许把滑片往回拉。设为 false 时，向左移动会保持在原档位。
export const ANCESTOR_ALLOW_PULL_BACK = false;

// 禁止回拉时会随机显示其中一条提示。
export const ANCESTOR_BLOCKED_BACKWARD_MESSAGES = [
    '祖气不可逆，不能往回拉。',
    '已登上的台阶，不能假装没走过。',
    '历史的车轮不允许倒转。'
];

// 成功往前拉时显示的提示，键为目标档位（0-5）。
export const ANCESTOR_FORWARD_HINT: Record<number, string> = {
    1: '摆脱小难，先从牢閑客开始。',
    2: '还在干这行，不好不坏。',
    3: '有所作为，离圣又近一步。',
    4: '立足港沪，神性初显。',
    5: '弃笔炒股，恭迎閑客祖。'
};

export const ANCESTOR_RANKS: AncestorRank[] = [
    {level: 0, name: '小难閑客', description: '一无是处', image: '/assets/images/ancestor-ranks/rank-0.png', accent: '#7aa0c8'},
    {level: 1, name: '牢閑客', description: '毫无成就', image: '/assets/images/ancestor-ranks/rank-1.png', accent: '#c45a4a'},
    {level: 2, name: '閑客子', description: '还在干这行，不好不坏', image: '/assets/images/ancestor-ranks/rank-2.png', accent: '#8aa7d9'},
    {level: 3, name: '閑客圣', description: '有所作为', image: '/assets/images/ancestor-ranks/rank-3.png', accent: '#e8c56a'},
    {level: 4, name: '閑客神', description: '立足港沪', image: '/assets/images/ancestor-ranks/rank-4.png', accent: '#ffc85c'},
    {level: 5, name: '閑客祖', description: '弃笔炒股', image: '/assets/images/ancestor-ranks/rank-5.png', accent: '#ffd56a'}
];

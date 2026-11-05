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
        title: '字与式的回响',
        state: 'past',
        description: '从自己遇到的阅读与编辑问题出发，把几个具体功能做进了项目。',
        items: [
            {
                title: '为 markdown-it-new 加入文档预览与编辑能力',
                description: '实现文档链接预览，并为 DOCX 探索项目自有的编辑引擎。',
                link: 'https://github.com/YohooSoft/markdown-it-new',
            },
            {
                title: '实现公式复制为 LaTeX 源码',
                description: '选中公式后，可以直接复制用于书写和交流的 LaTeX 表达。',
            },
            {
                title: '为个人助手补充文档作者元数据与文件管理能力',
                description: '让文档生成、修改和长对话中的文件处理有更清楚的记录。',
            },
        ],
    },
    {
        title: '抉择 · 纸页由谁书写',
        state: 'past',
        description: '为文档预览补上编辑能力时，DOCX 编辑从第三方方案转向了项目自己的实现。两条走向都留在这里。',
        choices: [
            {
                id: 'own-docx-engine',
                title: '实现项目自有的 DOCX 编辑引擎',
                description: '后来采用了自有的 OOXML/DOM 实现，继续打磨分页、段落编辑与基础表格等能力。',
                reason: '将这部分编辑能力纳入项目自身的实现与维护。',
            },
            {
                id: 'third-party-docx-editor',
                title: '继续沿用第三方 DOCX 编辑器',
                description: '这是转向自有实现前采用过的方向；若继续走下去，工作会更多围绕现有编辑器的集成与适配展开。',
            },
        ],
        selectedChoice: 'own-docx-engine',
    },
    {
        title: '抉择 · 文件应在何处停留',
        state: 'past',
        description: '给个人助手补充文件管理时，选择让临时文件与正式文档采用不同的保留方式。',
        choices: [
            {
                id: 'classified-retention',
                title: '分类保留，并支持到期清理',
                description: '为临时文件与正式文档分别设置保留规则，同时补充固定、另存和清理等操作。',
            },
            {
                id: 'keep-everything',
                title: '统一长期保留，之后手动整理',
                description: '另一种可能是先保留全部文件，再由使用者定期整理；这条分支是回看时补充的设想。',
                retrospective: true,
            },
        ],
        selectedChoice: 'classified-retention',
    },
    {
        period: '2026 年 11 月',
        title: '灯下的试卷',
        state: 'current',
        description: '眼前的主线是备考。先完成这一轮复习，再走到检验准备的时刻。',
        items: ['备考复习与刷题'],
    },
    {
        period: '2026 年 12 月',
        title: '落笔之时',
        state: 'future',
        description: '参加考试，同时把毕业设计要做什么、如何推进写成计划。',
        items: ['参加考试', '撰写毕业设计计划书'],
    },
    {
        period: '2027 年 1 月',
        title: '未竟的课题',
        state: 'future',
        description: '从计划书进入实际工作，推进毕业设计的实现与整理。',
        items: ['推进毕业设计'],
    },
    {
        period: '2027 年 2 月',
        title: '抉择 · 答卷之后，路向何方',
        state: 'future',
        description: '到结果和后续安排明确时，再决定下一步。当前倾向继续读研；其余方向先作为预案。',
        items: ['继续推进毕业设计'],
        choices: [
            {
                id: 'postgraduate',
                title: '继续读研',
                description: '目标是顺利上岸；若具备复试资格，就进入复试准备这一段。',
                reason: '希望更系统地学习计算机与人工智能，也继续探索做研究的可能。',
            },
            {
                id: 'reassess',
                title: '若结果未达预期，重新整理下一步',
                description: '先完成毕业设计、复盘这一轮准备，再决定后续安排。这是一条预备分支。',
            },
        ],
        preferredChoice: 'postgraduate',
    },
    {
        period: '2027 年 3 月',
        title: '下一扇门前',
        state: 'future',
        description: '升学方向的后续事件：如果具备复试资格，准备复试，并整理能够介绍的毕业设计与项目经历。',
        items: ['准备研究生复试'],
    },
    {
        period: '2027–2030',
        title: '从代码里生长的问题',
        state: 'future',
        description: '如果顺利进入研究生阶段，希望把长期写代码的实践与研究训练接起来。以下是待推进的事件。',
        items: [
            {title: '围绕计算机与人工智能补齐理论基础', status: '计划'},
            {
                title: '选择一个值得持续研究的具体问题',
                description: '可以从已有的文档工具、交互或个人助手实践中寻找切口，具体题目尚未确定。',
                status: '待确定',
            },
            {title: '继续维护开源项目，整理实现、实验与使用记录', status: '计划'},
        ],
    },
    {
        period: '2030 年 6 月',
        title: '抉择 · 向更远的学问之地',
        state: 'future',
        description: '到研究兴趣与机会更明确时，决定是否继续博士阶段。香港读博是目前的倾向，并非已经落实的安排。',
        choices: [
            {
                id: 'hong-kong-phd',
                title: '赴香港攻读博士学位',
                description: '若研究方向与申请机会合适，希望继续博士阶段的学习与研究。',
            },
            {
                id: 'reconsider-research-path',
                title: '若条件尚不合适，重新评估研究路径',
                description: '根据届时的研究积累和实际机会，调整方向或时间安排。',
            },
        ],
        preferredChoice: 'hong-kong-phd',
    },
    {
        period: '2034 年 1 月',
        title: '长卷将成',
        state: 'future',
        description: '如果此前顺利走入博士阶段，或许已离毕业不远。具体进度要留给实际的研究过程。',
    },
    {
        period: '2038 年 7 月',
        title: '旅途仍在延伸',
        state: 'future',
        description: '希望那时已找到适合长期生活的地方，仍在做研究、写代码或维护自己在意的项目。具体的生活安排，留给未来决定。',
    },
];

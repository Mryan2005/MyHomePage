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
    // ========================================
    // 序章 · 故事的起点
    // ========================================
    {
        period: '2023 年',
        title: '序章·第一幕「风起于陌生的城」',
        state: 'past',
        description:
            '十八岁那年，一场并非完全按照预想展开的旅途，将我带到了上海。彼时尚不知道，这座城市将在往后的岁月里，占据如此重要的位置。',
        items: [
            {
                title: '18 岁入沪上大学',
                description:
                    '进入上海第二工业大学，开始智能科学与技术专业的本科学习。',
            },
        ],
    },
    {
        period: '2023 年起',
        title: '序章·第二幕「万家灯火间的旅人」',
        state: 'past',
        description:
            '起初只是来这里读书。后来，在一次次行走与生活中，上海逐渐不再只是地图上的一个地名。',
        items: [
            '开始在上海生活，逐渐熟悉这座城市',
            '在大学生活中寻找自己的兴趣与方向',
            '逐渐萌生毕业后继续留在上海的愿望',
        ],
    },

    // ========================================
    // 第一章 · 未竟的愿望
    // ========================================
    {
        period: '大学初期',
        title: '第一章·第一幕「初临异乡的微光」',
        state: 'past',
        description:
            '初来乍到，面对陌生的环境与更广阔的知识世界，虽已有些许基础，却也不过是漫长旅途的起点。',
        items: [
            {
                title: '从已有的基础重新出发',
                description:
                    '带着此前积累的计算机知识，开始大学阶段的专业学习。',
            },
            {
                title: '探索人工智能的世界',
                description:
                    '逐渐接触更加系统的计算机科学与人工智能知识。',
            },
        ],
    },
    {
        period: '大学期间',
        title: '第一章·第二幕「迟来的竞逐之约」',
        state: 'past',
        description:
            '初高中时未曾参与竞赛的遗憾，并未随着岁月消散。既然过去的时光无法重来，那便在新的舞台上，试着补全那段未曾写下的故事。',
        items: [
            {
                title: '弥补未曾参与竞赛的遗憾',
                description:
                    '开始探索大学阶段的各类竞赛与实践机会。',
            },
            {
                title: '让知识走向实践',
                description:
                    '尝试将课堂上学到的知识运用到实际问题与项目中。',
            },
            {
                title: '夜桜月花 · 未完成的故事',
                description:
                    '逐步探索 AI 原生系统、自主运行能力与插件架构，推进个人项目。',
                link: 'https://github.com/YohooSoft/Yozakura-Tsukihana',
            },
        ],
    },

    // ========================================
    // 第二章 · 为了留在所爱的城市
    // ========================================
    {
        period: '2026 年',
        title: '第二章·第一幕「辞别诸事，独赴长夜」',
        state: 'current',
        description:
            '曾经同时前行的诸多道路，如今必须有所取舍。为了即将到来的试炼，开始退出手头的项目与事务，将精力转向另一场重要的挑战。',
        items: [
            '逐步退出此前参与的项目与事务',
            '集中精力准备研究生招生考试',
        ],
        choices: [
            {
                id: 'kaoyan',
                title: '继续求学 · 考研',
                description:
                    '选择继续深造，为未来争取更多可能。',
                reason:
                    '希望继续提升专业能力，也希望为自己留在所爱的城市创造机会。',
            },
            {
                id: 'jiuye',
                title: '走入社会 · 就业',
                description:
                    '本科毕业后直接寻找工作，开始职业生涯。',
                reason:
                    '虽然可以更早进入职场，但现阶段更希望继续求学。',
            },
            {
                id: 'independent',
                title: '隐藏选项 · 未竟的创造之路',
                description:
                    '放下常规升学与就业路线，将精力投入个人项目。',
                reason:
                    '尚有太多未完成的构想，但现阶段仍需要优先考虑学业与未来发展。',
                retrospective: true,
            },
        ],
        selectedChoice: 'kaoyan',
    },
    {
        period: '2026 年 12 月',
        title: '第二章·第二幕「为了留在所爱的城市」',
        state: 'future',
        description:
            '为了能够留在自己所爱的城市，漫长的准备终于迎来第一阶段的交卷。',
        items: [
            '参加全国硕士研究生招生考试初试',
        ],
    },

    // ========================================
    // 第三章 · 尚未揭晓的答案
    // ========================================
    {
        period: '2027 年春',
        title: '第三章·第一幕「春风尚未宣告的答案」',
        state: 'future',
        description:
            '答卷已经交出，命运却还未给出回应。待春风再起之时，旅途将通向何方，仍是未知之数。',
        choices: [
            {
                id: 'retest',
                title: '踏上新的求学之路',
                description:
                    '若达到相关要求，参加研究生招生复试，争取顺利录取。',
                reason:
                    '这是当前最希望实现的结果，也意味着下一段求学旅程即将开始。',
            },
            {
                id: 'readjust',
                title: '于歧路中另寻方向',
                description:
                    '若结果未能如愿，根据实际情况考虑调剂、再次报考或就业。',
                reason:
                    '即使一条道路未能走通，也不意味着整个旅途就此结束。',
            },
        ],
        preferredChoice: 'retest',
    },
    {
        period: '约 2027—2030 年',
        title: '第三章·第二幕「未尽的书页与远方」',
        state: 'future',
        description:
            '倘若顺利开启研究生生活，便又有数载光阴可以追寻知识与理想。曾经未能解答的问题，也许能在新的旅途中寻得答案。',
        items: [
            {
                title: '继续深入计算机科学与人工智能领域',
                description:
                    '探索大语言模型、自然语言处理、多模态及相关研究方向。',
            },
            {
                title: '完成硕士阶段的学习与研究',
                description:
                    '根据实际培养要求，完成课程、科研与学位工作。',
            },
            {
                title: '延续月花的故事',
                description:
                    '在条件允许的情况下，继续完善夜桜月花的技术体系。',
            },
        ],
    },

    // ========================================
    // 第四章 · 双城之间的歧路
    // ========================================
    {
        period: '硕士毕业后 · 待定',
        title: '第四章·第一幕「双城之间，命运的歧路」',
        state: 'future',
        description:
            '求学的旅途终有抵达终点的一日。届时，是留在熟悉的城市安家，还是跨越海岸，追寻更加遥远的未来？两条道路，等待着未来的我作出选择。',
        choices: [
            {
                id: 'shanghai-work',
                title: '留沪之路 · 万家灯火终有归处',
                description:
                    '硕士毕业后在上海就业，积累工作经验，在满足相关政策条件后申请落户上海，争取长期定居。',
                reason:
                    '从十八岁来到上海开始，这座城市便逐渐成为我想留下的地方。希望有朝一日，不再只是途经此地的旅人。',
            },
            {
                id: 'hongkong-phd',
                title: '赴港之路 · 向海的另一端启程',
                description:
                    '硕士毕业后前往香港攻读博士学位，博士毕业后留在香港工作四年，再决定下一段人生旅程。',
                reason:
                    '希望在人工智能领域继续深造，也希望在香港积累科研与职业经验，为未来开辟更多可能。',
            },
        ],
        preferredChoice: 'hongkong-phd',
    },

    // ========================================
    // 终章 · 尚未写下的未来
    // ========================================
    {
        period: '赴港读博并工作四年后 · 待定',
        title: '终章·第一幕「行尽山海，何处是归途」',
        state: 'future',
        description:
            '倘若选择的道路一切顺利，从上海的大学时光，到香港的博士生涯，再到四年的工作岁月，漫长的旅途终将抵达新的路口。曾经拼尽全力追逐的目标，或许都已成为往事。只是，走过这么远的路以后，我又该去往何方？',
        items: [
            {
                title: '重新选择未来的归处',
                description:
                    '根据届时的生活、事业与个人意愿，决定继续留在香港、返回上海，或前往新的城市。',
            },
            {
                title: '开启人生的下一段旅程',
                description:
                    '不再单纯以升学、毕业或工作年限为目标，而是思考自己真正希望拥有的生活。',
            },
            {
                title: '月花未尽的故事',
                description:
                    '继续发展夜桜月花，让这个从大学时代开始的项目陪伴自己走向更远的未来。',
            },
        ],
    },
];

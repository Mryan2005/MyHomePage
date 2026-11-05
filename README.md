# MyhomeIndex

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Roadmap 配置

`/now` 右上角的 `roadmap` 按钮会打开路线图卡片。编辑
`src/app/data/roadmap.ts` 中的 `ROADMAP`，可选择以下任意一种写法。
配置修改后需要重新构建部署。

### 年份、月份与自定义分组

原来的「年份 → 月份 → 事项数组」写法保持兼容。分组名称也可以写成
`2027–2030`、`长期`、`年底前`、`持续进行` 等文字：

```ts
export const ROADMAP: RoadmapData = {
    2026: {
        11: ['简单事项', '另一件事项'],
        '年底前': [{title: '完成项目', description: '整理资料并发布版本。', status: '进行中'}],
    },
    '2027–2030': {
        '研究阶段': ['开展长期研究'],
    },
    '长期': {
        '持续进行': ['保持学习'],
    },
};
```

数字年份和月份自动升序排列，并补上「年」「月」；文字分组按填写顺序
排列在数字分组之后。需要完全控制展示顺序时，使用下面的阶段数组。

### 自由阶段与跨年时间段

阶段数组完全按填写顺序展示，不要求固定年份或月份。`period` 可写跨年区间、
季度、相对时间等任意文字，也可以省略。可以只写阶段说明，不填写事项列表：

```ts
export const ROADMAP: RoadmapData = [
    {
        period: '2027–2030',
        title: '自定义阶段名',
        description: '阶段整体说明。\n可以分行记录目标和想法。',
        items: [
            '简单事项',
            {
                title: '详细事项',
                description: '补充背景、目标或行动步骤。',
                status: '计划中',
                link: 'https://example.com/project',
            },
        ],
    },
    {
        title: '长期愿景',
        description: '没有明确期限的计划也可以放在这里。',
    },
];
```

阶段的 `title` 必填；`period`、`description`、`items` 均为可选字段。
事项可以写字符串，也可以写对象：

| 字段 | 必填 | 含义 |
| --- | --- | --- |
| `title` | 是 | 事项标题；有链接时可点击打开 |
| `description` | 否 | 详细说明，支持使用 `\n` 换行 |
| `status` | 否 | 自定义状态文字，例如「计划中」「进行中」「已完成」 |
| `link` | 否 | HTTP/HTTPS 链接，在新标签页打开；其他协议不生成链接 |

文字以纯文本显示，不执行 HTML 或解析 Markdown。事项保持数组顺序。
空白事项、没有说明或有效事项的阶段会跳过；没有有效内容时显示待更新提示。
配置文件内附有可直接修改的注释示例。

### 章节、未来选择与当前节点

每个阶段都是可折叠章节，点击章节标题即可展开或收起；默认展开
`state: 'current'` 的章节，其余章节默认收起。
章节与选择卡片内边距为 8px，正文和状态为 16px，章节标题为 18px。

- `state`: `past`（已走过）、`current`（当前节点）、`future`（未来计划）。手动维护，不会因日期到来自动改变。
- `choices`: 可提前填写多个可能的方向，每项包含唯一 `id`、`title`，可选 `description` 和 `reason`（选择理由）。
- `preferredChoice`: 填写倾向选项的 `id`，显示「暂定选择」，可随时修改。
- `selectedChoice`: 只有实际决定后才填写，显示「已作选择」；同一选项同时被标记时以此为准。

没有被标记的选项显示「备选方向」。选项和当前节点互相独立：到达节点不代表已经作出决定。
这些内容通过配置文件维护，不在页面内编辑或自动保存。

```ts
{
    period: '未来',
    title: 'DECISION · 下一步怎么走？',
    state: 'future',
    choices: [
        {id: 'research', title: '继续深造', description: '先填写大致设想。'},
        {id: 'alternative', title: '另一种可能', reason: '可以补充考虑这个方向的理由。'},
    ],
    preferredChoice: 'research',
    // 到达这个节点时，将 state 改为 'current'。
    // 实际决定后可添加 selectedChoice: 'research'。
}
```

卡片布局参考 [markdown-it-new 的 Roadmap cards](https://github.com/YohooSoft/markdown-it-new/tree/codex/neural-model-preview#roadmap-cards)，
当前使用 Angular 模板渲染。

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

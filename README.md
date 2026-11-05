# MyhomeIndex

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

## Roadmap 配置

`/now` 右上角的 `roadmap` 按钮会打开路线图卡片。编辑
`src/app/data/roadmap.ts` 中的 `ROADMAP`，按「年份 → 月份（1–12）→ 事项数组」配置：

```ts
export const ROADMAP: RoadmapData = {
    2026: {
        11: ['要做的事情', '另一件要做的事情'],
        12: ['要做的事情'],
    },
    2027: {
        1: ['要做的事情'],
    },
};
```

年份、月份自动升序排列，每个月份显示为一个编号节点，事项按数组顺序展示。
空年份、空月份和空白事项会跳过；未配置内容时显示待更新提示。
配置修改后需要重新构建部署。

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

import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GithubDiscussionsService} from '../../services/github-discussions.service';
import {WebsitePramasService} from '../../services/Website-pramas';
import {GithubDiscussion} from '../../interfaces/github-discussion';
import {firstValueFrom, Subscription} from 'rxjs';
import MarkdownIt from 'markdown-it';

/** 在 Task 页面默认展示的分类名称（与 GitHub Discussion Category 的 name 一致） */
const DEFAULT_TASK_CATEGORY = 'Task';

@Component({
    selector: 'app-sub-issue-list-window',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sub-issue-list-window.html',
    styleUrl: './sub-issue-list-window.scss'
})
export class SubIssueListComponent implements OnInit, OnDestroy {

    private md = new MarkdownIt();

    allDiscussions: GithubDiscussion[] = [];
    discussions: GithubDiscussion[] = [];
    selectedDiscussion?: GithubDiscussion;
    selectedDiscussionBodyHtml = '';

    loading = false;
    error = '';

    /** 当前选中的分类筛选（空字符串 = 全部） */
    selectedCategory = DEFAULT_TASK_CATEGORY;

    /** 从数据中提取的全部分类名称 */
    categories: string[] = [];

    private showPause = false;
    private showDone = false;
    private subscriptions: Subscription[] = [];

    constructor(
        private githubDiscussionsService: GithubDiscussionsService,
        private websitePramas: WebsitePramasService,
        public cdr: ChangeDetectorRef
    ) {
    }

    async ngOnInit() {

        // 订阅筛选状态变化
        this.subscriptions.push(
            this.websitePramas.showPause$.subscribe(v => {
                this.showPause = v;
                if (this.allDiscussions.length) {
                    this.applyFilter();
                    this.selectedDiscussion = this.discussions[0];
                    this.updateSelectedDiscussionBody();
                    this.cdr.detectChanges();
                }
            })
        );
        this.subscriptions.push(
            this.websitePramas.showDone$.subscribe(v => {
                this.showDone = v;
                if (this.allDiscussions.length) {
                    this.applyFilter();
                    this.selectedDiscussion = this.discussions[0];
                    this.updateSelectedDiscussionBody();
                    this.cdr.detectChanges();
                }
            })
        );

        this.loading = true;

        try {

            this.allDiscussions =
                await firstValueFrom(
                    this.githubDiscussionsService.getDiscussions()
                );

            // 同步初始值
            this.showPause = this.websitePramas.showPause;
            this.showDone = this.websitePramas.showDone;

            // 提取分类列表
            const catSet = new Set<string>();
            for (const d of this.allDiscussions) {
                catSet.add(d.category?.name || '');
            }
            this.categories = Array.from(catSet).filter(Boolean).sort();

            // 如果默认分类不存在，回退到第一个分类或全部
            if (this.categories.length && !this.categories.includes(this.selectedCategory)) {
                this.selectedCategory = this.categories[0];
            }

            this.applyFilter();

            this.selectedDiscussion = this.discussions[0];
            this.updateSelectedDiscussionBody();
            this.cdr.detectChanges();
        } catch (e) {

            this.error = '加载失败';
            this.cdr.detectChanges();

        } finally {

            this.loading = false;
            this.cdr.detectChanges();

        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    /** 应用分类和状态的筛选 */
    applyFilter() {
        let filtered = this.allDiscussions;

        // 分类筛选
        if (this.selectedCategory) {
            filtered = filtered.filter(d => d.category?.name === this.selectedCategory);
        }

        // 按状态分组
        const withStatus = filtered.map(d => ({ d, status: this.getStatus(d) }));

        // 根据开关过滤
        const afterToggles = withStatus.filter(({ status }) => {
            if (status === 'Pause' && !this.showPause) return false;
            if ((status === 'Done' || status === 'Cancelled') && !this.showDone) return false;
            return true;
        });

        // 分离 Ongoing 与其他状态
        const ongoing = afterToggles.filter(({ status }) => status === 'Ongoing');
        const others = afterToggles.filter(({ status }) => status !== 'Ongoing');

        // Ongoing 按创建时间升序（最早优先），取前 10 条
        const topOngoing = ongoing
            .sort((a, b) => new Date(a.d.createdAt).getTime() - new Date(b.d.createdAt).getTime())
            .slice(0, 10);

        // 合并：Ongoing → Pause → Done → Cancelled
        const statusOrder = ['Ongoing', 'Pause', 'Done', 'Cancelled'];
        const sortedOthers = others.sort(
            (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
        );

        this.discussions = [...topOngoing, ...sortedOthers].map(s => s.d);
    }

    onCategoryChange(name: string) {
        this.selectedCategory = name;
        this.applyFilter();
        this.selectedDiscussion = this.discussions[0];
        this.updateSelectedDiscussionBody();
    }

    selectDiscussion(discussion: GithubDiscussion): void {
        this.selectedDiscussion = discussion;
        this.updateSelectedDiscussionBody();
    }

    getStatus(discussion: GithubDiscussion): 'Cancelled' | 'Pause' | 'Ongoing' | 'Done' {
        const hasCancelled = discussion.labels.some(l => l.name === 'Cancelled Task');
        const hasPause = discussion.labels.some(l => l.name === 'Pause');

        if (discussion.closed && hasCancelled) {
            return 'Cancelled';
        }
        if (discussion.closed) {
            return 'Done';
        }
        if (hasPause) {
            return 'Pause';
        }
        return 'Ongoing';
    }

    getStatusLabel(discussion: GithubDiscussion): string {
        const map: Record<string, string> = {
            'Cancelled': 'Cancelled',
            'Pause': 'Pause',
            'Ongoing': 'Ongoing',
            'Done': 'Done',
        };
        return map[this.getStatus(discussion)] || '';
    }

    getTimeAgo(createdAt: string): string {
        const now = new Date().getTime();
        const created = new Date(createdAt).getTime();
        const diffMinutes = Math.max(1, Math.floor((now - created) / 60000));

        if (diffMinutes < 60) {
            return `最近${diffMinutes}分钟开始的事情`;
        }

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            return `最近${diffHours}小时开始的事情`;
        }

        const diffDays = Math.floor(diffHours / 24);
        return `最近${diffDays}天前开始的事情`;
    }

    private updateSelectedDiscussionBody(): void {
        const content = this.selectedDiscussion?.body?.trim() || '暂无详情描述';
        this.selectedDiscussionBodyHtml = this.md.render(content);
    }
}

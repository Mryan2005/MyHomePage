import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GithubDiscussionsService} from '../../services/github-discussions.service';
import {GithubDiscussion} from '../../interfaces/github-discussion';
import {firstValueFrom} from 'rxjs';
import {marked} from 'marked';

/** 在 Task 页面默认展示的分类名称（与 GitHub Discussion Category 的 name 一致） */
const DEFAULT_TASK_CATEGORY = 'Task';

@Component({
    selector: 'app-sub-issue-list-window',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sub-issue-list-window.html',
    styleUrl: './sub-issue-list-window.scss'
})
export class SubIssueListComponent implements OnInit {

    allDiscussions: GithubDiscussion[] = [];
    discussions: GithubDiscussion[] = [];
    selectedDiscussion?: GithubDiscussion;
    selectedDiscussionBodyHtml = '';

    loading = false;
    error = '';

    /** 当前选中的分类筛选（空字符串 = 全部） */
    selectedCategory = DEFAULT_TASK_CATEGORY;
    /** 当前是否显示已完成的任务 */
    showDone = false;

    /** 从数据中提取的全部分类名称 */
    categories: string[] = [];

    constructor(
        private githubDiscussionsService: GithubDiscussionsService,
        public cdr: ChangeDetectorRef
    ) {
    }

    async ngOnInit() {

        this.loading = true;

        try {

            this.allDiscussions =
                await firstValueFrom(
                    this.githubDiscussionsService.getDiscussions()
                );

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

    /** 应用分类和完成状态的筛选 */
    applyFilter() {
        let filtered = this.allDiscussions;

        // 分类筛选
        if (this.selectedCategory) {
            filtered = filtered.filter(d => d.category?.name === this.selectedCategory);
        }

        // 默认隐藏已完成
        if (!this.showDone) {
            filtered = filtered.filter(d => !d.closed || d.labels.length > 0);
            // 保留未关闭的 + 暂停的（有label但可能已关闭）
        }

        this.discussions = filtered;
    }

    onCategoryChange(name: string) {
        this.selectedCategory = name;
        this.applyFilter();
        this.selectedDiscussion = this.discussions[0];
        this.updateSelectedDiscussionBody();
    }

    onShowDoneChange(checked: boolean) {
        this.showDone = checked;
        this.applyFilter();
        this.selectedDiscussion = this.discussions[0];
        this.updateSelectedDiscussionBody();
    }

    selectDiscussion(discussion: GithubDiscussion): void {
        this.selectedDiscussion = discussion;
        this.updateSelectedDiscussionBody();
    }

    getStatus(discussion: GithubDiscussion): 'Pause' | 'Ongoing' | 'Done' {
        if (discussion.labels.length) {
            return 'Pause';
        }
        return discussion.closed ? 'Done' : 'Ongoing';
    }

    getTimeAgo(createdAt: string): string {
        const now = new Date().getTime();
        const created = new Date(createdAt).getTime();
        const diffMinutes = Math.max(1, Math.floor((now - created) / 60000));

        if (diffMinutes < 60) {
            return `${diffMinutes}m`;
        }

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
            return `${diffHours}h`;
        }

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d`;
    }

    private updateSelectedDiscussionBody(): void {
        const content = this.selectedDiscussion?.body?.trim() || '暂无详情描述';
        this.selectedDiscussionBodyHtml = marked.parse(content, {async: false}) as string;
    }
}

import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { fileslist } from 'src/app/data/files';
import { FileEntry, FileTree } from 'src/app/interfaces/File';
import { WebsitePramasService } from 'src/app/services/Website-pramas';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sub-files-list-window',
  imports: [],
  templateUrl: './sub-files-list-window.html',
  styleUrl: './sub-files-list-window.scss',
})
export class SubFilesListWindow implements OnInit, OnDestroy {
    files: FileTree = structuredClone(fileslist);
    private pingSubscription?: Subscription;

    // ===== Finder UI 状态 =====
    selectedFile: string | null = null;
    selectedGroup = '';
    selectedDir = '';
    viewMode: 'grid' | 'list' = 'grid';
    sortAsc = true;
    searchText = '';
    contextMenu: { x: number; y: number; name: string; entry: FileEntry } | null = null;

    constructor(
        public cdr: ChangeDetectorRef,
        private websitePramas: WebsitePramasService,
    ) {
    }

    ngOnInit() {
        // 默认选中第一个分组的第一个目录
        const groups = this.groups;
        if (groups.length) {
            this.selectedGroup = groups[0];
            const dirs = this.groupDirs;
            if (dirs.length) {
                this.selectedDir = dirs[0];
            }
        }

        this.pingSubscription = this.websitePramas.pingTrigger$.subscribe(() => {
            this.checkUrls();
        });
    }

    ngOnDestroy() {
        this.pingSubscription?.unsubscribe();
    }

  async checkUrls() {
    console.log('开始通过智能弹窗探测连通性...');

    for (const group of Object.values(this.files)) {
      for (const dir of Object.values(group)) {
        for (const entry of Object.values(dir)) {
          if (!entry.url) {
            console.warn('文件没有 URL 属性');
            entry.canOpen = false;
            continue;
          }

          try {
            // 使用 window.open 的小窗口探测模式
            const isAlive = await this.probeUrlViaWindow(entry.url);

            if (isAlive) {
              console.log(`✅ 可访问: ${entry.url}`);
              entry.canOpen = true;
            } else {
              console.error(`❌ 无法访问: ${entry.url}`);
              entry.canOpen = false;
            }
          } catch (error) {
            entry.canOpen = false;
          }

          // 动态更新界面
          this.cdr.markForCheck();
        }
      }
    }
  }

  probeUrlViaWindow(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      // 弹出一个几乎不可见的超小窗口（部分浏览器会强制限制最小尺寸，但这不影响探测）
      const checkWin = window.open(
        url,
        '_blank',
        'width=10,height=10,left=20000,top=20000,menubar=no,status=no,toolbar=no,scrollbars=no,resizable=no'
      );

      // 如果被浏览器阻止了弹窗（Pop-up blocker）
      if (!checkWin) {
        console.warn('检测到浏览器阻止了弹窗，请允许当前页面的弹窗权限以完成检测。');
        resolve(false);
        return;
      }

      // 设定一个 3.5 秒的保底心跳探测
      // 只要窗口能存活并且没有报错跳转，由于它不是 iframe 嵌套，金山文档可以正常加载
      const timer = setTimeout(() => {
        cleanup(true); // 3.5秒内窗口正常且没崩，代表链接有效
      }, 3500);

      // 监听窗口是否被意外关闭或崩溃
      const crashCheck = setInterval(() => {
        if (checkWin.closed) {
          cleanup(false); // 用户或系统异常关闭了
        }
      }, 500);

      const cleanup = (result: boolean) => {
        clearTimeout(timer);
        clearInterval(crashCheck);
        if (checkWin && !checkWin.closed) {
          checkWin.close(); // 优雅关闭探测窗口
        }
        resolve(result);
      };
    });
  }

  // ===== Finder 交互 =====

  /** 顶层分组名（Sidebar 分组） */
  get groups(): string[] {
      return Object.keys(this.files);
  }

  /** 当前分组下的目录名（Sidebar 项目） */
  get groupDirs(): string[] {
      return Object.keys(this.files[this.selectedGroup] || {});
  }

  /** 指定分组下的目录名 */
  groupDirsOf(group: string): string[] {
      return Object.keys(this.files[group] || {});
  }

  /** 当前目录下的文件（按搜索词过滤、文件夹在前、按名称排序） */
  get currentFiles(): { name: string; entry: FileEntry }[] {
      const dir = this.files[this.selectedGroup]?.[this.selectedDir] || {};
      const keyword = this.searchText.trim().toLowerCase();
      let list = Object.entries(dir).map(([name, entry]) => ({ name, entry }));
      if (keyword) {
          list = list.filter(f => f.name.toLowerCase().includes(keyword));
      }
      const dirMul = this.sortAsc ? 1 : -1;
      const folders = list.filter(f => f.entry.type === 'folder')
          .sort((a, b) => a.name.localeCompare(b.name) * dirMul);
      const docs = list.filter(f => f.entry.type !== 'folder')
          .sort((a, b) => a.name.localeCompare(b.name) * dirMul);
      return [...folders, ...docs];
  }

  selectDir(group: string, dir: string): void {
      this.selectedGroup = group;
      this.selectedDir = dir;
      this.selectedFile = null;
      this.searchText = '';
  }

  onSearch(event: Event): void {
      this.searchText = (event.target as HTMLInputElement).value;
  }

  selectFile(name: string): void {
      this.selectedFile = name;
  }

  openFile(entry: FileEntry): void {
      if (entry.url) {
          window.location.href = entry.url;
      }
  }

  toggleView(): void {
      this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  toggleSort(): void {
      this.sortAsc = !this.sortAsc;
  }

  share(): void {
      const nav = navigator as any;
      if (nav.share) {
          nav.share({ title: 'Mryan2005 的共享文件', url: window.location.href }).catch(() => {});
      }
  }

  openContextMenu(event: MouseEvent, name: string, entry: FileEntry): void {
      event.preventDefault();
      this.selectedFile = name;
      const x = Math.min(event.clientX, window.innerWidth - 220);
      const y = Math.min(event.clientY, window.innerHeight - 200);
      this.contextMenu = { x, y, name, entry };
  }

  @HostListener('document:click')
  closeContextMenu(): void {
      this.contextMenu = null;
  }

  menuOpen(): void {
      const entry = this.contextMenu?.entry;
      this.contextMenu = null;
      if (entry) {
          this.openFile(entry);
      }
  }

  menuOpenNewTab(): void {
      const entry = this.contextMenu?.entry;
      this.contextMenu = null;
      if (entry?.url) {
          window.open(entry.url, '_blank');
      }
  }

  menuCopyLink(): void {
      const entry = this.contextMenu?.entry;
      this.contextMenu = null;
      if (entry?.url) {
          navigator.clipboard?.writeText(entry.url);
      }
  }
}

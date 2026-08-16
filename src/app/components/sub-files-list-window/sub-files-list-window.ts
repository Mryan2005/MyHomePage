import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { fileslist } from 'src/app/data/files';
import { File } from 'src/app/interfaces/File';
import { WebsitePramasService } from 'src/app/services/Website-pramas';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sub-files-list-window',
  imports: [],
  templateUrl: './sub-files-list-window.html',
  styleUrl: './sub-files-list-window.scss',
})
export class SubFilesListWindow implements OnInit, OnDestroy {
    files: File[] = [...fileslist];
    private pingSubscription?: Subscription;

    // ===== Finder UI 状态 =====
    selectedFile: File | null = null;
    viewMode: 'grid' | 'list' = 'grid';
    sortAsc = true;
    searchText = '';
    activeSidebar = '共享文件';
    contextMenu: { x: number; y: number; file: File } | null = null;

    constructor(
        public cdr: ChangeDetectorRef,
        private websitePramas: WebsitePramasService,
    ) {
    }

    ngOnInit() {
        this.pingSubscription = this.websitePramas.pingTrigger$.subscribe(() => {
            this.checkUrls();
        });
    }

    ngOnDestroy() {
        this.pingSubscription?.unsubscribe();
    }

  async checkUrls() {
    let TrueFiles: File[] = this.files;
    console.log('开始通过智能弹窗探测连通性...');

    for (const file of TrueFiles) {
      if (!file.url) {
        console.warn(`文件 ${file.title || '未知'} 没有 URL 属性`);
        file.canOpen = false;
        continue;
      }

      try {
        // 使用 window.open 的小窗口探测模式
        const isAlive = await this.probeUrlViaWindow(file.url);

        if (isAlive) {
          console.log(`✅ 可访问: ${file.url}`);
          file.canOpen = true;
        } else {
          console.error(`❌ 无法访问: ${file.url}`);
          file.canOpen = false;
        }
      } catch (error) {
        file.canOpen = false;
      }

      // 动态更新界面
      this.files = [...TrueFiles];
        this.cdr.markForCheck();
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

  /** 是否为文件夹（数据中以 folder: 前缀标识） */
  isFolder(file: File): boolean {
      return /^folder:/i.test(file.title);
  }

  /** 显示名称（去掉 folder: 前缀） */
  displayName(file: File): string {
      return file.title.replace(/^folder:\s*/i, '');
  }

  /** 按搜索词过滤、按名称排序（文件夹在前） */
  get filteredFiles(): File[] {
      const keyword = this.searchText.trim().toLowerCase();
      const matched = keyword
          ? this.files.filter(f => this.displayName(f).toLowerCase().includes(keyword))
          : [...this.files];
      const dir = this.sortAsc ? 1 : -1;
      const folders = matched.filter(f => this.isFolder(f))
          .sort((a, b) => a.title.localeCompare(b.title) * dir);
      const docs = matched.filter(f => !this.isFolder(f))
          .sort((a, b) => a.title.localeCompare(b.title) * dir);
      return [...folders, ...docs];
  }

  onSearch(event: Event): void {
      this.searchText = (event.target as HTMLInputElement).value;
  }

  selectFile(file: File): void {
      this.selectedFile = file;
  }

  openFile(file: File): void {
      if (file.url) {
          window.location.href = file.url;
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

  setSidebar(name: string): void {
      this.activeSidebar = name;
  }

  openContextMenu(event: MouseEvent, file: File): void {
      event.preventDefault();
      this.selectedFile = file;
      const x = Math.min(event.clientX, window.innerWidth - 220);
      const y = Math.min(event.clientY, window.innerHeight - 200);
      this.contextMenu = { x, y, file };
  }

  @HostListener('document:click')
  closeContextMenu(): void {
      this.contextMenu = null;
  }

  menuOpen(): void {
      const file = this.contextMenu?.file;
      this.contextMenu = null;
      if (file) {
          this.openFile(file);
      }
  }

  menuOpenNewTab(): void {
      const file = this.contextMenu?.file;
      this.contextMenu = null;
      if (file?.url) {
          window.open(file.url, '_blank');
      }
  }

  menuCopyLink(): void {
      const file = this.contextMenu?.file;
      this.contextMenu = null;
      if (file?.url) {
          navigator.clipboard?.writeText(file.url);
      }
  }
}

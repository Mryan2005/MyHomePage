import { Component, OnInit } from '@angular/core';
import { fileslist } from 'src/app/data/files';
import { File } from 'src/app/interfaces/File';

@Component({
  selector: 'app-sub-files-list-window',
  imports: [],
  templateUrl: './sub-files-list-window.html',
  styleUrl: './sub-files-list-window.scss',
})
export class SubFilesListWindow implements OnInit {
  files: File[] = [...fileslist];

  ngOnInit() {
    this.checkUrls();
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
    }
  }

  probeUrlViaWindow(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      // 弹出一个几乎不可见的超小窗口（部分浏览器会强制限制最小尺寸，但这不影响探测）
      const checkWin = window.open(
        url, 
        '_blank', 
        'width=10,height=10,left=10000,top=10000,menubar=no,status=no,toolbar=no'
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
}

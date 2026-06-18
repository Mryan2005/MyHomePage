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
  // 浅拷贝一份初始数据，防止直接修改只读的静态 fileslist
  files: File[] = [...fileslist];

  ngOnInit() {
    this.checkUrls();
  }
  
  async checkUrls() {
    let TrueFiles: File[] = this.files;
    console.log('开始通过 <iframe> 隐藏探测文件 URL 连通性...');

    for (const file of TrueFiles) {
      if (!file.url) {
        console.warn(`文件 ${file.title || '未知'} 没有 URL 属性`);
        file.canOpen = false;
        continue;
      }
      
      try {
        // 核心修改：通过 await 等待 iframe 挂载、加载并返回结果
        const isAlive = await this.probeUrlViaIframe(file.url);
        
        if (isAlive) {
          console.log(`✅ 可访问 (iframe 成功加载): ${file.url}`);
          file.canOpen = true;
        } else {
          console.error(`❌ 无法访问 (iframe 加载超时或触发错误): ${file.url}`);
          file.canOpen = false;
        }
      } catch (error) {
        console.error(`❌ 探测过程发生意外异常: ${file.url}`, error);
        file.canOpen = false;
      }

      // 关键改动：每检查完一个文件就刷新一次数组引用，触发 Angular 变更检测
      // 这样前端 HTML 页面就能实时看到打勾/打叉的状态变化
      this.files = [...TrueFiles];
    }
  }

  probeUrlViaIframe(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none'; // 隐藏 iframe
      iframe.src = url;
  
      // 设置一个 6 秒超时（金山文档是单页应用，加载稍微需要一点时间，给 6 秒更保险）
      const timeout = setTimeout(() => {
        cleanup();
        resolve(false); 
      }, 6000);
  
      const cleanup = () => {
        clearTimeout(timeout);
        iframe.remove(); // 探测完毕后销毁 DOM，释放内存
      };
  
      iframe.onload = () => {
        cleanup();
        resolve(true); // 页面成功加载
      };
  
      iframe.onerror = () => {
        cleanup();
        resolve(false); // 触发错误
      };
  
      document.body.appendChild(iframe);
    });
  }
}

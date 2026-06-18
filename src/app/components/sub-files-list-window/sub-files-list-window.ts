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
    files: File[] = fileslist;

    ngOnInit() {
        this.checkUrls();
    }
    
    async checkUrls() {
        let TrueFiles: File[] = fileslist;
        console.log('开始检查文件 URL 连通性...');
        for (const file of TrueFiles) {
            // 假设你的 File 接口中包含 url 属性
            if (!file.url) {
                console.warn(`文件 ${file.name || '未知'} 没有 URL 属性`);
                file.canOpen = false;
                continue;
            }
            
            try {
                // 使用 fetch 发送 HEAD 请求（只获取响应头，速度快，省流量）
                const response = await fetch(file.url, { method: 'HEAD' });
                
                if (response.ok) {
                    console.log(`✅ 可访问: [${response.status}] ${file.url}`);
                    file.canOpen = true;
                } else {
                    console.error(`❌ 无法访问: [${response.status}] ${file.url}`);
                    file.canOpen = false;
                }
            } catch (error) {
                // 网络错误或跨域问题 (CORS) 会走到这里
                console.error(`❌ 访问失败 (网络错误/跨域): ${file.url}`, error);
                file.canOpen = false;
            }
        }
        this.files = TrueFiles;
    }
}

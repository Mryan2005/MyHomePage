import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class BackgroundService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    // 背景图片数组
    private readonly backgroundImages: string[] = [
        'assets/images/bg1.png',
        'assets/images/bg2.png',
        'assets/images/bg3.jpg',
        'assets/images/bg4.jpg',
        'assets/images/bg5.png',
        'assets/images/bg6.jpg'
    ];

    getBackgroundImage(): string {
        if (isPlatformBrowser(this.platformId)) {
            const randomIndex = Math.floor(Math.random() * this.backgroundImages.length);
            return this.backgroundImages[randomIndex];
        }
        return this.backgroundImages[0]; // 默认返回第一个背景图片
    }
}
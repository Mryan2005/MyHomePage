import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BackgroundService {
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
        const randomIndex = Math.floor(Math.random() * this.backgroundImages.length);
        return this.backgroundImages[randomIndex];
    }
}
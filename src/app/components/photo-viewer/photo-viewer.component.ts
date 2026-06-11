import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-photo-preview',
  standalone: true,
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoPreviewComponent implements OnInit, OnDestroy {

  @Input()
  imageUrl = '';

  /**
   * 背景音乐地址
   */
  @Input()
  musicUrl?: string;

  /**
   * 音量(0~1)
   */
  @Input()
  volume = 0.5;

  /**
   * 是否循环
   */
  @Input()
  loop = true;

  @Output()
  closed = new EventEmitter<void>();

  private audio?: HTMLAudioElement;

  ngOnInit(): void {

    if (!this.musicUrl) {
      return;
    }

    this.audio = new Audio(this.musicUrl);
    this.audio.loop = this.loop;

    this.audio.play()
      .then(() => {
        this.fadeIn(this.audio!);
      })
      .catch(err => {
        console.warn('音乐播放失败:', err);
      });
  }

  close(): void {

    if (this.audio) {

      this.fadeOut(this.audio, () => {

        this.stopMusic();

        this.closed.emit();
      });

      return;
    }

    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.close();
  }

  ngOnDestroy(): void {
    this.stopMusic();
  }

  /**
   * 音乐淡入
   */
  private fadeIn(audio: HTMLAudioElement): void {

    audio.volume = 0;

    const timer = setInterval(() => {

      if (audio.volume >= this.volume) {

        audio.volume = this.volume;
        clearInterval(timer);

        return;
      }

      audio.volume = Math.min(
        audio.volume + 0.05,
        this.volume
      );

    }, 100);
  }

  /**
   * 音乐淡出
   */
  private fadeOut(
    audio: HTMLAudioElement,
    callback?: () => void
  ): void {

    const timer = setInterval(() => {

      if (audio.volume <= 0.05) {

        audio.volume = 0;

        clearInterval(timer);

        callback?.();

        return;
      }

      audio.volume -= 0.05;

    }, 100);
  }

  /**
   * 停止音乐
   */
  private stopMusic(): void {

    if (!this.audio) {
      return;
    }

    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.src = '';

    this.audio.load();

    this.audio = undefined;
  }
}
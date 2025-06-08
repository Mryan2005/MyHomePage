import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BackgroundService } from './config/background';
import { Footbar } from './components/footbar/footbar';
import { InsideWindow } from './components/inside-window/inside-window';

@Component({
  imports: [Footbar, InsideWindow],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements AfterViewInit {
  constructor(
    public bgService: BackgroundService,
    public elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  protected title = 'myhomeIndex';

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const mainElement = document.querySelector('body') as HTMLElement;
      if (mainElement) {
        mainElement.style.transition = 'background-image 1s ease-in-out';
        mainElement.style.backgroundImage = `url('${this.bgService.getBackgroundImage()}')`;
        mainElement.style.backgroundSize = 'cover';
        mainElement.style.backgroundPosition = 'center';
        mainElement.style.backgroundRepeat = 'no-repeat';
        mainElement.style.backgroundAttachment = 'fixed';
      }
    }
  }
}

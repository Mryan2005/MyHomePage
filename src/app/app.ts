import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
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
    private renderer: Renderer2,
    public bgService: BackgroundService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  protected title = 'myhomeIndex';

  ngAfterViewInit(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   const backgroundImage = this.bgService.getBackgroundImage();
    //   this.renderer.setStyle(document.body, 'transition', 'background-image 1s ease-in-out');
    //   this.renderer.setStyle(document.body, 'background-image', `url('${backgroundImage}')`);
    //   this.renderer.setStyle(document.body, 'background-size', 'cover');
    //   this.renderer.setStyle(document.body, 'background-position', 'center');
    //   this.renderer.setStyle(document.body, 'background-repeat', 'no-repeat');
    //   this.renderer.setStyle(document.body, 'background-attachment', 'fixed');
    // }
  }
}

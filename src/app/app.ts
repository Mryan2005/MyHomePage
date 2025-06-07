import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { InsideWindow } from './components/inside-window/inside-window';
import { BackgroundService } from './config/background';
import { Footbar } from './components/footbar/footbar';

@Component({
  selector: 'app-root',
  imports: [InsideWindow, Footbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
    constructor(
      public bgService: BackgroundService,
      public elementRef: ElementRef
    ) {}

    protected title = 'myhomeIndex';
    
    ngAfterViewInit(): void {
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

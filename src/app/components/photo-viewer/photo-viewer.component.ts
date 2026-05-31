import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener
} from '@angular/core';

@Component({
  selector: 'app-photo-preview',
  standalone: true,
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.scss']
})
export class PhotoPreviewComponent {

  @Input()
  imageUrl = '';

  @Output()
  closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.close();
  }
}
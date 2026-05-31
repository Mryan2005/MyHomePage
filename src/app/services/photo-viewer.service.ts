import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { PhotoPreviewComponent } from '../components/photo-viewer/photo-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class PhotoViewerService {

  constructor(
    private overlay: Overlay
  ) {}

  open(url: string) {

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: true
    });

    const componentRef = overlayRef.attach(
      new ComponentPortal(PhotoPreviewComponent)
    );

    componentRef.instance.imageUrl = url;

    overlayRef.backdropClick()
      .subscribe(() => overlayRef.dispose());

    componentRef.instance.closed
      .subscribe(() => overlayRef.dispose());
  }
}
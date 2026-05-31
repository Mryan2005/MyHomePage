import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoPreviewComponent } from './photo-viewer.component';

describe('PhotoPreviewComponent', () => {

  let component: PhotoPreviewComponent;
  let fixture: ComponentFixture<PhotoPreviewComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [PhotoPreviewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(
      PhotoPreviewComponent
    );

    component = fixture.componentInstance;

    component.imageUrl = 'test.jpg';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display image', () => {

    const img =
      fixture.nativeElement.querySelector('img');

    expect(img.src).toContain('test.jpg');
  });

  it('should emit close event', () => {

    spyOn(component.closed, 'emit');

    component.close();

    expect(
      component.closed.emit
    ).toHaveBeenCalled();
  });

  it('should close on ESC key', () => {

    spyOn(component, 'close');

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape'
      })
    );

    expect(component.close)
      .toHaveBeenCalled();
  });

});
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideWindow } from './inside-window';

describe('InsideWindow', () => {
  let component: InsideWindow;
  let fixture: ComponentFixture<InsideWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsideWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsideWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

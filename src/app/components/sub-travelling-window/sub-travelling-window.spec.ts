import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTravellingWindow } from './sub-travelling-window';

describe('InsideWindow', () => {
  let component: SubTravellingWindow;
  let fixture: ComponentFixture<SubTravellingWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubTravellingWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubTravellingWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIntroduceMyselfWindow } from './sub-introduce-myself-window';

describe('InsideWindow', () => {
  let component: SubIntroduceMyselfWindow;
  let fixture: ComponentFixture<SubIntroduceMyselfWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubIntroduceMyselfWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubIntroduceMyselfWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

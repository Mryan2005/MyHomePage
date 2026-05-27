import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubWorksListWindow } from './sub-works-list-window';

describe('SubWorksListWindow', () => {
  let component: SubWorksListWindow;
  let fixture: ComponentFixture<SubWorksListWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubWorksListWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubWorksListWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

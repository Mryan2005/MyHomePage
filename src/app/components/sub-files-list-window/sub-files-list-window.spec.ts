import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFilesListWindow } from './sub-files-list-window';

describe('SubFilesListWindow', () => {
  let component: SubFilesListWindow;
  let fixture: ComponentFixture<SubFilesListWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubFilesListWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubFilesListWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIssueListComponent} from './sub-issue-list-window';

describe('InsideWindow', () => {
  let component: SubIssueListComponent;
  let fixture: ComponentFixture<SubIssueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubIssueListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkItem } from './link-item';

describe('LinkItem', () => {
  let component: LinkItem;
  let fixture: ComponentFixture<LinkItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

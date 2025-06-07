import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footbar } from './footbar';

describe('Footbar', () => {
  let component: Footbar;
  let fixture: ComponentFixture<Footbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Footbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

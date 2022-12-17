import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewProfileComponent } from './preview-profile.component';

describe('PreviewProfileComponent', () => {
  let component: PreviewProfileComponent;
  let fixture: ComponentFixture<PreviewProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

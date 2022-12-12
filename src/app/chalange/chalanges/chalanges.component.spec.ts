import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalangesComponent } from './chalanges.component';

describe('ChalangesComponent', () => {
  let component: ChalangesComponent;
  let fixture: ComponentFixture<ChalangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChalangesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChalangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

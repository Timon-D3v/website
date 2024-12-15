import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientTextComponent } from './gradient-text.component';

describe('GradientTextComponent', () => {
  let component: GradientTextComponent;
  let fixture: ComponentFixture<GradientTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradientTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradientTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

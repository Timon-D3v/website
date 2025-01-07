import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Media220Component } from './media-220.component';

describe('Media220Component', () => {
  let component: Media220Component;
  let fixture: ComponentFixture<Media220Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Media220Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Media220Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

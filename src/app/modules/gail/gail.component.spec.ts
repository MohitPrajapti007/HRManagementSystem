import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GailComponent } from './gail.component';

describe('GailComponent', () => {
  let component: GailComponent;
  let fixture: ComponentFixture<GailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GailComponent]
    });
    fixture = TestBed.createComponent(GailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

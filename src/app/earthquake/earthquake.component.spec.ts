import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthquakeComponent } from './earthquake.component';

describe('EarthquakeComponent', () => {
  let component: EarthquakeComponent;
  let fixture: ComponentFixture<EarthquakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarthquakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EarthquakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkZoneComponent } from './work-zone.component';

describe('Workzone', () => {
  let component: WorkZoneComponent;
  let fixture: ComponentFixture<WorkZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkZoneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkZoneComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

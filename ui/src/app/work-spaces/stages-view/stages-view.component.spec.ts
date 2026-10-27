import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StagesViewComponent } from './stages-view.component';

describe('StagesView', () => {
  let component: StagesViewComponent;
  let fixture: ComponentFixture<StagesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagesViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StagesViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

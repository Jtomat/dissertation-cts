import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutputBarComponent } from './output-bar.component';

describe('OutputBar', () => {
  let component: OutputBarComponent;
  let fixture: ComponentFixture<OutputBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutputBarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalsViewComponent } from './globals-view.component';

describe('StagesView', () => {
  let component: GlobalsViewComponent;
  let fixture: ComponentFixture<GlobalsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalsViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

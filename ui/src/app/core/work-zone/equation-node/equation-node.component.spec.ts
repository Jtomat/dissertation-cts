import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquationNodeComponent } from './equation-node.component';

describe('EquationNode', () => {
  let component: EquationNodeComponent;
  let fixture: ComponentFixture<EquationNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquationNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EquationNodeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

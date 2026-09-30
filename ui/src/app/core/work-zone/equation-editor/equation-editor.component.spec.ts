import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquationEditorComponent } from './equation-editor.component';

describe('FormulaEditorComponent', () => {
  let component: EquationEditorComponent;
  let fixture: ComponentFixture<EquationEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquationEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EquationEditorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

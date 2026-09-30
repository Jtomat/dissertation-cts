import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerminalPanel } from './terminal-panel';

describe('TerminalPanel', () => {
  let component: TerminalPanel;
  let fixture: ComponentFixture<TerminalPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(TerminalPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

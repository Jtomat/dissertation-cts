import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarPanel } from './navbar-panel';

describe('NavbarPanel', () => {
  let component: NavbarPanel;
  let fixture: ComponentFixture<NavbarPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

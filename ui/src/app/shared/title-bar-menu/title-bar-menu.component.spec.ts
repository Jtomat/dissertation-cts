import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleBarMenuComponent } from './title-bar-menu.component';

describe('Menu', () => {
  let component: TitleBarMenuComponent;
  let fixture: ComponentFixture<TitleBarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleBarMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleBarMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

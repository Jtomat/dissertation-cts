import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  ViewContainerRef,
} from '@angular/core';

import { ContextMenuService } from './context-menu.service';
import { DEFAULT_MENU_ALIGNMENT, MenuAlignment, MenuItem } from './types';

@Directive({
  selector: '[contextMenu]',
  standalone: true,
})
export class ContextMenuHostDirective {
  public readonly context = input<any>(null, {
    alias: 'contextMenu',
  });

  public readonly menuItems = input<MenuItem[]>([]);

  public readonly alignment = input<MenuAlignment>(DEFAULT_MENU_ALIGNMENT);

  private readonly service = inject(ContextMenuService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly vcr = inject(ViewContainerRef);

  @HostListener('contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();

    const boundary = this.host.nativeElement.closest<HTMLElement>('[context-menu-boundary]');

    this.service.createMenu(
      this.vcr,
      this.host.nativeElement,
      event,
      this.context(),
      this.menuItems(),
      this.alignment(),
      boundary,
    );
  }
}
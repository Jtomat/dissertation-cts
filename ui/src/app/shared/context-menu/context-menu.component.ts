import {
  Component,
  ElementRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuService } from './context-menu.service';
import {
  DEFAULT_MENU_ALIGNMENT,
  MenuAlignment,
  MenuPlacement,
  MenuPoint,
  ActionMenuItem,
  GroupMenuItem,
  MenuItem,
} from './types';
import {ProjectApiService} from "@app/services/project-api.service";

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent {
  public readonly items = input<MenuItem[]>([]);
  public readonly context = input<any>(null);

  public readonly alignment = input<MenuAlignment>(
      DEFAULT_MENU_ALIGNMENT,
  );

  public readonly anchorPoint = input<MenuPoint | null>(null);
  public readonly anchorElement = input<HTMLElement | null>(null);
  public readonly boundary = input<HTMLElement | null>(null);

  public readonly placement = input<MenuPlacement>(
      MenuPlacement.Cursor,
  );

  public readonly lastOpen = signal<GroupMenuItem | null>(null);
  public readonly submenuAnchor = signal<HTMLElement | null>(null);

  protected readonly menuService = inject(ContextMenuService);
  protected readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly projectService = inject(ProjectApiService)

  /**
   * Позиционируем подменю после его появления в DOM.
   * Корневое меню позиционируется сервисом при создании.
   */
  private readonly submenuPositioning = effect((onCleanup) => {
    if (this.placement() !== MenuPlacement.Submenu) {
      return;
    }

    const anchor = this.anchorElement();

    if (!anchor) {
      return;
    }

    const alignment = this.alignment();
    const boundary = this.boundary();
    const placement = this.placement();
    const element = this.host.nativeElement;

    const frame = requestAnimationFrame(() => {
      if (!element.isConnected || !anchor.isConnected) {
        return;
      }

      this.menuService.positionMenu(element, {
        anchor,
        alignment,
        boundary,
        placement,
      });
    });

    onCleanup(() => cancelAnimationFrame(frame));
  });

  protected execute(item: MenuItem): void {
    if ('click' in item) {
      item.click(this.context(), item.action, this.projectService);
      this.menuService.close();
    }
  }

  protected isGroupMenuItem(
      item: MenuItem,
  ): GroupMenuItem | null {
    return 'children' in item ? item : null;
  }

  protected openSubMenu(
      item: GroupMenuItem,
      event: MouseEvent,
  ): void {
    event.stopPropagation();

    const button = event.currentTarget;

    if (!(button instanceof HTMLElement)) {
      return;
    }

    // Повторное нажатие на ту же группу закрывает подменю.
    if (this.lastOpen() === item) {
      this.lastOpen.set(null);
      this.submenuAnchor.set(null);
      return;
    }

    this.submenuAnchor.set(button);
    this.lastOpen.set(item);
  }

  protected isOpenedItem(): boolean {
    return this.lastOpen() !== null;
  }

  protected isActive(item: MenuItem): boolean{
    return this.lastOpen()?.action === item.action;
  }

  protected readonly MenuPlacement = MenuPlacement;
}
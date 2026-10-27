
import {
  ComponentRef,
  Injectable,
  ViewContainerRef,
  inject,
} from '@angular/core';

import { ContextMenuComponent } from './context-menu.component';
import {
  DEFAULT_MENU_ALIGNMENT,
  MenuAlignment,
  MenuPlacement,
  MenuPoint,
  MenuPositionOptions,
} from './types';
import { calculateMenuPosition } from './utils';
import { MenuItem } from '@app/shared/context-menu/types';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private menu?: ComponentRef<ContextMenuComponent>;
  private listener?: (event: MouseEvent) => void;
  private animationFrame?: number;

  public createMenu(
      vcr: ViewContainerRef,
      node: HTMLElement,
      event: MouseEvent,
      context: unknown,
      items: MenuItem[],
      alignment: MenuAlignment = DEFAULT_MENU_ALIGNMENT,
      boundary: HTMLElement | null = null,
  ): ComponentRef<ContextMenuComponent> {
    const target = event.target;

    // Контекстное меню уже открыто и событие произошло внутри него.
    if (
        this.menu &&
        target instanceof Node &&
        this.menu.location.nativeElement.contains(target)
    ) {
      return this.menu;
    }

    this.clear();

    const point: MenuPoint = {
      x: event.clientX,
      y: event.clientY,
    };

    const component = vcr.createComponent(ContextMenuComponent);

    component.setInput('items', items);
    component.setInput('context', context);
    component.setInput('alignment', alignment);
    component.setInput('anchorPoint', point);
    component.setInput('boundary', boundary);
    component.setInput('placement', MenuPlacement.Cursor);

    const element = component.location.nativeElement as HTMLElement;

    element.style.visibility = 'hidden';
    node.appendChild(element);

    this.menu = component;

    // Сначала Angular должен отрисовать содержимое,
    // чтобы можно было измерить реальный размер меню.
    component.changeDetectorRef.detectChanges();

    this.animationFrame = requestAnimationFrame(() => {
      if (this.menu !== component) {
        return;
      }

      this.positionMenu(element, {
        point,
        alignment,
        placement: MenuPlacement.Cursor,
        boundary,
      });

      this.installListeners();
    });

    return component;
  }

  public positionMenu(
      menu: HTMLElement,
      options: MenuPositionOptions,
  ): void {
    const {
      point,
      anchor,
      alignment = DEFAULT_MENU_ALIGNMENT,
      placement = MenuPlacement.Cursor,
      boundary,
    } = options;

    const anchorRect =
        anchor?.getBoundingClientRect() ??
        new DOMRect(point?.x ?? 0, point?.y ?? 0, 0, 0);

    const bounds =
        boundary?.getBoundingClientRect() ??
        new DOMRect(0, 0, window.innerWidth, window.innerHeight);

    // Для position: fixed координаты должны быть в viewport.
    menu.style.position = 'fixed';
    menu.style.left = '0px';
    menu.style.top = '0px';
    menu.style.right = 'auto';
    menu.style.bottom = 'auto';
    menu.style.visibility = 'hidden';

    // Если задана ограничивающая область, не позволяем меню
    // быть шире/выше неё.
    menu.style.maxWidth = `${Math.max(0, bounds.width)}px`;
    menu.style.maxHeight = `${Math.max(0, bounds.height)}px`;

    const rect = menu.getBoundingClientRect();

    const position = calculateMenuPosition(
        rect.width,
        rect.height,
        anchorRect,
        bounds,
        alignment,
        placement,
    );

    menu.style.left = `${position.left}px`;
    menu.style.top = `${position.top}px`;
    menu.style.visibility = 'visible';
  }

  public close(): void {
    this.clear();
  }

  private installListeners(): void {
    if (this.listener) {
      return;
    }

    this.listener = (event: MouseEvent) => {
      this.handleDocumentEvent(event);
    };

    document.addEventListener('click', this.listener);
    document.addEventListener('contextmenu', this.listener);
  }

  private handleDocumentEvent(event: MouseEvent): void {
    const root = this.menu?.location.nativeElement as HTMLElement | undefined;

    if (!root) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Node) || !root.contains(target)) {
      this.clear();
    }
  }

  private clear(): void {
    if (this.animationFrame !== undefined) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }

    if (this.listener) {
      document.removeEventListener('click', this.listener);
      document.removeEventListener('contextmenu', this.listener);
      this.listener = undefined;
    }

    const component = this.menu;
    this.menu = undefined;

    component?.destroy();
  }
}
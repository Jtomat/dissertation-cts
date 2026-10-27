import {
  DEFAULT_MENU_ALIGNMENT,
  MenuAlignment,
  MenuAlignmentEdge,
  MenuPlacement, MenuPosition,
} from './types';



function alignAxis(
    anchorStart: number,
    anchorSize: number,
    menuSize: number,
    alignment: MenuAlignmentEdge,
): number {
  switch (alignment) {
    case MenuAlignmentEdge.Start:
      return anchorStart;

    case MenuAlignmentEdge.End:
      return anchorStart + anchorSize - menuSize;

    case MenuAlignmentEdge.Center:
      return anchorStart + (anchorSize - menuSize) / 2;
  }
}

function clamp(
    position: number,
    size: number,
    min: number,
    max: number,
): number {
  const availableSize = Math.max(0, max - min);

  if (size >= availableSize) {
    return min;
  }

  return Math.min(Math.max(position, min), max - size);
}

export function calculateMenuPosition(
    menuWidth: number,
    menuHeight: number,
    anchor: DOMRect,
    bounds: DOMRect,
    alignment: MenuAlignment = DEFAULT_MENU_ALIGNMENT,
    placement: MenuPlacement = MenuPlacement.Cursor,
): MenuPosition {
  let left: number;
  let top: number;

  if (placement === MenuPlacement.Submenu) {
    // По X: Start — справа, End — слева, Center — по центру.
    switch (alignment.x) {
      case MenuAlignmentEdge.Start:
        left = anchor.right;
        break;

      case MenuAlignmentEdge.End:
        left = anchor.left - menuWidth;
        break;

      case MenuAlignmentEdge.Center:
        left = anchor.left + (anchor.width - menuWidth) / 2;
        break;
    }

    // По Y: обычное выравнивание относительно кнопки.
    top = alignAxis(
        anchor.top,
        anchor.height,
        menuHeight,
        alignment.y,
    );

    // Если меню не помещается, пробуем противоположную сторону.
    if (
        alignment.x === MenuAlignmentEdge.Start &&
        left + menuWidth > bounds.right
    ) {
      left = anchor.left - menuWidth;
    } else if (
        alignment.x === MenuAlignmentEdge.End &&
        left < bounds.left
    ) {
      left = anchor.right;
    }
  } else {
    // Корневое меню выравнивается относительно точки курсора.
    left = alignAxis(
        anchor.left,
        anchor.width,
        menuWidth,
        alignment.x,
    );

    top = alignAxis(
        anchor.top,
        anchor.height,
        menuHeight,
        alignment.y,
    );

    // Если выбранное выравнивание выходит за границу,
    // пробуем противоположное.
    if (left + menuWidth > bounds.right) {
      const alternative =
          alignment.x === MenuAlignmentEdge.Start
              ? MenuAlignmentEdge.End
              : alignment.x === MenuAlignmentEdge.End
                  ? MenuAlignmentEdge.Start
                  : MenuAlignmentEdge.Center;

      left = alignAxis(
          anchor.left,
          anchor.width,
          menuWidth,
          alternative,
      );
    }

    if (top + menuHeight > bounds.bottom) {
      const alternative =
          alignment.y === MenuAlignmentEdge.Start
              ? MenuAlignmentEdge.End
              : alignment.y === MenuAlignmentEdge.End
                  ? MenuAlignmentEdge.Start
                  : MenuAlignmentEdge.Center;

      top = alignAxis(
          anchor.top,
          anchor.height,
          menuHeight,
          alternative,
      );
    }
  }

  // Финальная защита от выхода за границы слева, справа,
  // сверху и снизу.
  return {
    left: clamp(left, menuWidth, bounds.left, bounds.right),
    top: clamp(top, menuHeight, bounds.top, bounds.bottom),
  };
}
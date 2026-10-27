import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TreeNodeBase} from '../type';
import { NgcxTreeComponent, NgcxTreeConfig } from '@cluetec/ngcx-tree';
import {TreeNodeComponent} from "@app/work-spaces/stages-view/tree-node/tree-node.component";


@Component({
  selector: 'app-tree-list',
  standalone: true,
  imports: [MatIconModule, NgcxTreeComponent],
  templateUrl: './tree-list.component.html',
  styleUrl: './tree-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListComponent {
  readonly items = model<Array<TreeNodeBase>>([]);
  readonly dragEnabled = input(true);
  readonly sameLevelOnly = input(false);

  protected readonly config: NgcxTreeConfig<TreeNodeBase> = {
    // @ts-ignore
    treeNodeContentComponent: TreeNodeComponent,
    allowSelection: (node) => true,
    // allowDrag: (node) => node.depth > 0 && (node.children?.length ?? 0) === 0,
    allowDrop: (_node, intoNode) => intoNode?.data?.type !== 'item',
  };
}
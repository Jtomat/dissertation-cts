import {
  ChangeDetectionStrategy,
  Component, computed,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit, signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgcxCustomComponent, NgcxTreeComponent, NgcxTreeNodeWrapper } from '@cluetec/ngcx-tree';
import {
  ProcessNodeData,
  TreeGroupIcon,
  TreeNodeBase,
  TreeStatus,
} from '@app/work-spaces/stages-view/type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './tree-node.component.html',
  styleUrl: './tree-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeComponent<T extends ProcessNodeData = any>
  implements NgcxCustomComponent<TreeNodeBase<T>>, OnInit, OnDestroy
{
  @Input() nodeWrapper: NgcxTreeNodeWrapper<TreeNodeBase<T>>;

  readonly customEvent = new EventEmitter<any>();

  readonly tree = inject(NgcxTreeComponent);
  expansion$ : Subscription;
  readonly isExpanded = signal<boolean>(false);
  readonly groupIcon = computed(()=> {
    if (!this.isGroup) {
      return undefined;
    }

    const icon: TreeGroupIcon | undefined = this.node.icon;

    if (!icon) {
      return undefined;
    }

    return typeof icon === 'function' ? icon(this.isExpanded()) : icon;
  });

  readonly TreeStatus = TreeStatus;

  get node(): TreeNodeBase {
    return this.nodeWrapper.data;
  }

  get isGroup(): boolean {
    return this.node.type === 'group';
  }

  get status(): TreeStatus | undefined {
    return this.node.status;
  }

  get postfixIcon(): string | undefined {
    if (this.node.postfixIcon) {
      return this.node.postfixIcon;
    }

    switch (this.status) {
      case TreeStatus.Computed:
        return 'fa-solid fa-circle-check';

      case TreeStatus.Changed:
        return 'fa-solid fa-pen-to-square';

      case TreeStatus.Error:
        return 'fa-solid fa-circle-exclamation';

      case TreeStatus.Processing:
        return 'fa-solid fa-spinner fa-spin';

      default:
        return undefined;
    }
  }

  ngOnDestroy(): void {
    this.expansion$?.unsubscribe()
  }

  ngOnInit(): void {
    this.expansion$ = this.tree.treeControl.expansionModel.changed.subscribe((expanded) => {
      this.isExpanded.set(this.tree.treeControl.isExpanded(this.nodeWrapper));
    })
  }

  // readonly node = input.required<TreeItemNode>();
  // readonly selected = input(false);
  // readonly selectNode = output<string>();
  //
  // private readonly statusIcons: Record<TreeStatus, string> = {
  //   [TreeStatus.Computed]: 'check_circle',
  //   [TreeStatus.Changed]: 'edit',
  //   [TreeStatus.Error]: 'error',
  //   [TreeStatus.Processing]: 'autorenew',
  // };
  //
  // readonly statusIcon = computed(() => {
  //   const status = this.node().status;
  //   return status ? this.statusIcons[status] : null;
  // });
  //
  // readonly rowClass = computed(() => {
  //   const status = this.node().status;
  //
  //   return {
  //     'tree-row-selected': this.selected(),
  //     'status-error': status === TreeStatus.Error,
  //     'status-processing': status === TreeStatus.Processing,
  //     'status-changed': status === TreeStatus.Changed,
  //     'status-computed': status === TreeStatus.Computed,
  //   };
  // });
}
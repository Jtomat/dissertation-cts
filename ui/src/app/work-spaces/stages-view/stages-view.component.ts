import { Component, signal } from '@angular/core';
import { TreeNodeBase } from '@app/work-spaces/stages-view/type';
import { TreeListComponent } from '@app/work-spaces/stages-view/tree-list/tree-list.component';

@Component({
  imports: [TreeListComponent],
  selector: 'app-stages-view',
  styleUrl: './stages-view.component.scss',
  templateUrl: './stages-view.component.html',
})
export class StagesViewComponent {
  readonly tree = signal<Array<TreeNodeBase>>([
    {
      id: 'group-1',
      type: 'group',
      title: 'Stage 1',
      icon: (expanded) => expanded ?  'fa-solid fa-folder-open' : 'fa-solid fa-folder',
      children: [
        {
          id: 'item-2',
          type: 'item',
          title: 'Item 2',
        },
        {
          id: 'item-1',
          type: 'item',
          title: 'Item 1',
        },
      ],
    },
  ]);

  // readonly sameLevelOnly = signal(false);
  //
  // tree = signal<TreeNode[]>([
  //   {
  //     id: 'group-1',
  //     type: 'group',
  //     label: 'Проект',
  //     icon: (expanded) => (expanded ? 'folder_open' : 'folder'),
  //     children: [
  //       {
  //         id: 'item-1',
  //         type: 'item',
  //         label: 'Конфигурация',
  //         icon: 'description',
  //         status: TreeStatus.Computed,
  //       },
  //       {
  //         id: 'item-2',
  //         type: 'item',
  //         label: 'Расчёт',
  //         icon: 'functions',
  //         status: TreeStatus.Processing,
  //       },
  //       {
  //         id: 'group-2',
  //         type: 'group',
  //         label: 'Проект C',
  //         icon: (expanded) => (expanded ? 'folder_open' : 'folder'),
  //         children: [
  //           {
  //             id: 'item-3',
  //             type: 'item',
  //             label: 'Расчёт 2',
  //             icon: 'functions',
  //             status: TreeStatus.Error,
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ]);
}

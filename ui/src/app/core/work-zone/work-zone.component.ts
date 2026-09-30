import { Component } from '@angular/core';
import {EquationNodeComponent} from "@app/core/work-zone/equation-node/equation-node.component";

@Component({
  imports: [EquationNodeComponent],
  selector: 'app-work-zone',
  styleUrl: './work-zone.component.scss',
  templateUrl: './work-zone.component.html',
})
export class WorkZoneComponent {}

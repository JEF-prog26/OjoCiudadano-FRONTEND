import { Component } from '@angular/core';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';

@Component({
  selector: 'app-dashboard-component',
  imports: [
    HeaderPanelComponent
  ],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {

}

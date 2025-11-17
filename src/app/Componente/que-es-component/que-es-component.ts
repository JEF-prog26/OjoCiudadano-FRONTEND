import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../header-component/header-component';

@Component({
  selector: 'app-que-es-component',
  imports: [
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './que-es-component.html',
  styleUrl: './que-es-component.css',
})
export class QueEsComponent {

}

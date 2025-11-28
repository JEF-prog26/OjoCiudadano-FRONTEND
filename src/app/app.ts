import { Component, signal } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HomeComponent} from './Componente/home-component/home-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('OjoCiudadano-FRONTEND');
  public nombre: string = "Ojo Ciudadano";
}

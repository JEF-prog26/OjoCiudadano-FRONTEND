// src/app/home-component/home-component.ts
import { Component, OnInit } from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.html',
  imports: [
    CommonModule,
    RouterLink
  ],
  styleUrls: ['./home-component.css']
})
export class HomeComponent implements OnInit {

  // Variable para controlar el estado del menú
  isMenuOpen: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  // Metodo para alternar el estado del menú
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {

  }
}


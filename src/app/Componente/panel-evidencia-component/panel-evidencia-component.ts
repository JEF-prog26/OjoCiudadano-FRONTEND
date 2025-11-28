import { Component, OnInit } from '@angular/core';

import {RouterLink} from '@angular/router';
import {HeaderPanelComponent} from '../header-panel-component/header-panel-component';

@Component({
  selector: 'app-panel-evidencia', // Nombre del selector
  templateUrl: './panel-evidencia-component.html',
  styleUrls: ['./panel-evidencia-component.css'],
  imports: [RouterLink, HeaderPanelComponent]
})
export class PanelEvidenciaComponent implements OnInit { // <-- CLASE EXPORTADA Y CONFIGURADA

  // --- Propiedades para controlar la visibilidad ---
  // Estas propiedades controlarán las clases CSS en el HTML usando [ngClass] o *ngIf
  showInputs: boolean = false;
  showId: boolean = false;
  showTable: boolean = true; // Mostrar la tabla por defecto

  // AÑADIR: Propiedad para simular los datos de la tabla
  evidenciasData: any[] = [
    { id: 1, nombre: 'Foto Incidente', documentoUr: 'ABC1234', tipo: 'Imagen' },
    { id: 2, nombre: 'Video Prueba', documentoUr: 'DEF5678', tipo: 'Video' },
    { id: 3, nombre: 'Audio Testigo', documentoUr: 'GHI9012', tipo: 'Audio' },
  ];

  constructor() { }

  ngOnInit(): void {
    // Aquí iría la lógica de inicialización si fuera necesaria.
    // El estado inicial ya se maneja en la declaración de las propiedades de arriba.
    console.log('Componente de Panel de Evidencias inicializado.');
  }

  // --- Funciones de Utilidad (Adaptadas de tu JS) ---

  /**
   * Actualiza las propiedades de visibilidad basadas en el modo.
   */
  updateVisibility(showInputs: boolean, showId: boolean, showTable: boolean): void {
    this.showInputs = showInputs;
    this.showId = showId;
    this.showTable = showTable;
  }

  // --- Manejadores de Eventos de los Botones (Adaptados de tu JS) ---

  onRegisterClick(): void {
    console.log('Modo: Registrar Evidencia');
    this.updateVisibility(true, false, false);
  }

  onListClick(): void {
    console.log('Modo: Listar Evidencia');
    this.updateVisibility(false, false, true);
    // Aquí iría la llamada a la API para cargar la lista de evidencias
    // this.loadAllEvidences();
  }

  onSearchClick(): void {
    console.log('Modo: Buscar Evidencia por ID');
    this.updateVisibility(false, true, true);
  }

  onUpdateClick(): void {
    console.log('Modo: Actualizar datos evidencia');
    this.updateVisibility(true, true, true);
  }

  onDeleteClick(): void {
    console.log('Modo: Eliminar evidencia');
    this.updateVisibility(false, true, true);
  }

  // Si tenías más métodos como loadAllEvidences, deben ser métodos de clase aquí.
}


/*document.addEventListener('DOMContentLoaded', () => {
  // --- Referencias a los elementos del DOM ---
  const registerBtn = document.getElementById('register-btn');
  const listBtn = document.getElementById('list-btn');
  const searchBtn = document.getElementById('search-btn');
  const updateBtn = document.getElementById('update-btn');
  const deleteBtn = document.getElementById('delete-btn');

  const inputRow = document.querySelector('.input-row') as HTMLElement;
  const idInputGroup = document.querySelector('.id-input-group') as HTMLElement;
  const evidenceTableContainer = document.querySelector('.evidence-table-container') as HTMLElement;

  // --- Funciones de Utilidad ---

  /**
   * Oculta o muestra elementos usando clases CSS.
   * @param showInputs Muestra los inputs de Nombre, Documento, Tipo.
   * @param showId Muestra el input de IdEvidencia.
   * @param showTable Muestra la tabla.

  const updateVisibility = (showInputs: boolean, showId: boolean, showTable: boolean) => {
    // Manejar la fila de inputs (Nombre, Documento UR, Tipo)
    if (showInputs) {
      inputRow.classList.remove('hidden');
      inputRow.classList.add('visible');
    } else {
      inputRow.classList.add('hidden');
      inputRow.classList.remove('visible');
    }

    // Manejar el input de ID (IdEvidencia)
    if (showId) {
      idInputGroup.classList.remove('hidden');
      idInputGroup.classList.add('visible');
    } else {
      idInputGroup.classList.add('hidden');
      idInputGroup.classList.remove('visible');
    }

    // Manejar el contenedor de la tabla
    if (showTable) {
      evidenceTableContainer.classList.remove('hidden');
      evidenceTableContainer.classList.add('visible-block'); // Usamos visible-block para display: block
    } else {
      evidenceTableContainer.classList.add('hidden');
      evidenceTableContainer.classList.remove('visible-block');
    }
  };

  // --- Manejadores de Eventos de los Botones ---

  registerBtn?.addEventListener('click', () => {
    console.log('Modo: Registrar Evidencia');
    updateVisibility(true, false, false);
  });

  listBtn?.addEventListener('click', () => {
    console.log('Modo: Listar Evidencia');
    updateVisibility(false, false, true);
    // Aquí iría la llamada a la API para cargar la lista de evidencias
    // loadAllEvidences();
  });

  searchBtn?.addEventListener('click', () => {
    console.log('Modo: Buscar Evidencia por ID');
    updateVisibility(false, true, true);
  });

  updateBtn?.addEventListener('click', () => {
    console.log('Modo: Actualizar datos evidencia');
    updateVisibility(true, true, true);
  });

  deleteBtn?.addEventListener('click', () => {
    console.log('Modo: Eliminar evidencia');
    updateVisibility(false, true, true);
  });

  // --- Estado Inicial ---
  // Según el nuevo mockup, inicialmente solo se ve la tabla de listado.
  updateVisibility(false, false, true); // Oculta inputs e ID, muestra la tabla por defecto
});*/

import { Component, OnInit } from '@angular/core';

// Define la interfaz para la estructura de una Evidencia
interface Evidencia {
  id: number;
  nombre: string;
  documentoUrl: string;
  tipo: string;
  fechaEnvio: string;
}

@Component({
  selector: 'app-panel-evidencia',
  // Es importante usar 'standalone: true' en Angular moderno
  standalone: true,
  // Incluye CommonModule para directivas como *ngFor si tu entorno lo requiere,
  // aunque para un componente simple en Angular 17+ puede no ser necesario si no se usa allí.
  templateUrl: './panel-evidencia-component.html',
  styleUrls: ['./panel-evidencia-component.css'],
})
export class PanelEvidenciaComponent implements OnInit {
  // Datos de ejemplo para la tabla
  evidencias: Evidencia[] = [
    { id: 1, nombre: 'Foto Fachada Obra', documentoUrl: 'url/a/doc1', tipo: 'Imagen', fechaEnvio: '2025-11-15' },
    { id: 2, nombre: 'PDF Permisos Municipales', documentoUrl: 'url/a/doc2', tipo: 'PDF', fechaEnvio: '2025-11-16' },
    { id: 3, nombre: 'Video Avance Construcción', documentoUrl: 'url/a/doc3', tipo: 'Video', fechaEnvio: '2025-11-17' },
  ];

  constructor() { }

  ngOnInit(): void {
    // Aquí puedes cargar los datos iniciales de las evidencias desde el servicio
    console.log('Panel de Evidencias inicializado.');
  }

  // Métodos de acción

  /**
   * Muestra la evidencia o abre el enlace del documento.
   * @param evidencia - El objeto de la evidencia a visualizar.
   */
  onVisualizar(evidencia: Evidencia): void {
    console.log(`Visualizar evidencia ID: ${evidencia.id} - URL: ${evidencia.documentoUrl}`);
    // Implementar lógica para abrir el documento en una nueva pestaña o un modal
    window.open(evidencia.documentoUrl, '_blank');
  }

  /**
   * Inicia el proceso de edición de la evidencia.
   * @param evidencia - El objeto de la evidencia a editar.
   */
  onEditar(evidencia: Evidencia): void {
    console.log(`Editar evidencia ID: ${evidencia.id}`);
    // Implementar lógica para abrir un formulario de edición
  }

  /**
   * Elimina la evidencia después de una confirmación.
   * @param evidencia - El objeto de la evidencia a eliminar.
   */
  onEliminar(evidencia: Evidencia): void {
    // Nota: Usamos confirm() solo por simplicidad, en un entorno real usarías un modal custom.
    if (confirm(`¿Estás seguro de que quieres eliminar la evidencia ID ${evidencia.id}?`)) {
      console.log(`Eliminando evidencia ID: ${evidencia.id}`);
      // Implementar lógica del servicio para eliminar la evidencia
      this.evidencias = this.evidencias.filter(e => e.id !== evidencia.id);
    }
  }
}

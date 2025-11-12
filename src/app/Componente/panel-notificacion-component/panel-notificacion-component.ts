// notificacion.ts (o notificacion.js si no usas estricto TS)
// He añadido tipado y manejo de null para corregir los errores del compilador.

document.addEventListener('DOMContentLoaded', () => {
  // 1. Obtener referencias a elementos usando aserciones de tipo para mayor seguridad
  const mainInputs = document.getElementById('main-inputs') as HTMLElement | null;
  const idInputGroup = document.getElementById('id-input-group') as HTMLElement | null;
  const tableContainer = document.getElementById('notification-table-container') as HTMLElement | null;
  const tableBody = document.getElementById('table-body') as HTMLElement | null;

  // Al usar querySelectorAll, asumimos que todos tienen la propiedad 'value'
  // y forzamos el tipo a un array de elementos de input.
  const allInputs = document.querySelectorAll('.data-input, .id-input') as NodeListOf<HTMLInputElement>;

  // Botones (declarados como posibles null, pero se manejan en los addEventListener)
  const registrarBtn = document.getElementById('btn-registrar');
  const listarBtn = document.getElementById('btn-listar');
  const buscarBtn = document.getElementById('btn-buscar');
  const actualizarBtn = document.getElementById('btn-actualizar');
  const eliminarBtn = document.getElementById('btn-eliminar');

  // ... (El MOCK de datos simulados se mantiene igual)
  const NOTIFICACIONES_MOCK = [
    { id: 101, nombre: 'Solicitud Cambio', documentoUr: 'U20204567', fechaEnvio: '2025-10-01' },
    { id: 102, nombre: 'Alerta Incidente', documentoUr: 'U20211234', fechaEnvio: '2025-10-05' },
    { id: 103, nombre: 'Aviso Manteniemto', documentoUr: 'U20229876', fechaEnvio: '2025-11-10' },
  ];


  // --- FUNCIÓN DE UTILIDAD: Control de Visibilidad (Tipado) ---
  function updatePanelVisibility(showInputs: boolean, showId: boolean, showTable: boolean) {
    if (mainInputs) {
      mainInputs.classList.toggle('hidden', !showInputs);
    }
    if (idInputGroup) {
      idInputGroup.classList.toggle('hidden', !showId);
    }
    if (tableContainer) {
      tableContainer.style.display = showTable ? 'block' : 'none';
    }
  }

  // --- FUNCIÓN: Llenar la Tabla (Tipado) ---
  // Usamos 'any' para el tipo de datos ya que es un MOCK
  function renderTable(data: any[]) {
    if (!tableBody) return; // Comprobar si es null

    tableBody.innerHTML = ''; // Limpiar filas existentes

    if (data && data.length > 0) {
      data.forEach((notif: any) => { // Tipamos notif como any
        const row = document.createElement('div');
        row.classList.add('table-row');
        row.innerHTML = `
                    <div style="flex: 0.5;">${notif.id}</div>
                    <div>${notif.nombre}</div>
                    <div>${notif.documentoUr}</div>
                    <div>${notif.fechaEnvio}</div>
                    <div style="flex: 0.5;">
                        <button onclick="window.editNotificacion(${notif.id})" class="action-btn">✏️</button>
                        <button onclick="window.deleteNotificacion(${notif.id})" class="action-btn">🗑️</button>
                    </div>
                `;
        tableBody.appendChild(row);
      });
    } else {
      const row = document.createElement('div');
      row.classList.add('table-row');
      row.innerHTML = `<div style="flex: 4; font-style: italic;">No hay notificaciones para mostrar.</div>`;
      tableBody.appendChild(row);
    }
  }

  // Función para limpiar todos los inputs del formulario
  function clearInputs() {
    allInputs.forEach(input => input.value = ''); // Funciona porque forzamos el tipo a HTMLInputElement
  }

  // 2. Establecer el estado inicial: Listar Notificaciones
  updatePanelVisibility(false, false, true);
  renderTable(NOTIFICACIONES_MOCK);

  // 3. Asignar Event Listeners a los botones (Comprobación de null)

  registrarBtn?.addEventListener('click', () => { // Usamos el encadenamiento opcional (?)
    updatePanelVisibility(true, false, false);
    clearInputs();
  });

  listarBtn?.addEventListener('click', () => {
    updatePanelVisibility(false, false, true);
    clearInputs();
    renderTable(NOTIFICACIONES_MOCK);
  });

  buscarBtn?.addEventListener('click', () => {
    updatePanelVisibility(false, true, true);
    clearInputs();
  });

  actualizarBtn?.addEventListener('click', () => {
    updatePanelVisibility(true, true, false);
    clearInputs();
  });

  eliminarBtn?.addEventListener('click', () => {
    updatePanelVisibility(false, true, true);
    clearInputs();
  });

  // 4. Funciones globales (para los botones de la tabla) - Añadimos a 'window' y tipamos 'id'
  (window as any).editNotificacion = (id: number) => {
    alert('Preparando edición para la Notificación ID: ' + id);
    actualizarBtn?.click(); // Llamada segura al método click
    const idInput = document.getElementById('input-id') as HTMLInputElement;
    if (idInput) {
      idInput.value = id.toString();
    }
  };

  (window as any).deleteNotificacion = (id: number) => {
    if (confirm(`¿Está seguro de eliminar la Notificación con ID: ${id}?`)) {
      alert('Enviando solicitud de eliminación...');
    }
  };
});

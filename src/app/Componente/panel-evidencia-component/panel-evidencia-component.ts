// main.ts

document.addEventListener('DOMContentLoaded', () => {
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
   */
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
});

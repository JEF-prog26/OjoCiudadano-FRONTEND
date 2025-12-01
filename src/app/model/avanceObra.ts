import { ObraPublica } from './obraPublica';

export class AvanceObra {
  idAvanceObra: number;
  fechaReporte: string;       // LocalDate -> string (YYYY-MM-DD)
  porcentajeDeAvance: string; // En Java es String, así que aquí también
  descripcion: string;

  // OJO: Debe llamarse 'obrapublica' (minúsculas) porque así está en la entidad Java
  obrapublica: ObraPublica;
}

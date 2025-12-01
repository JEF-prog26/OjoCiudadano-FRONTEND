import { GobiernoRegional } from './gobiernoRegional';
import { ExpedienteTecnico } from './expedienteTecnico';

export class ObraPublica {
  idObra: number; // OJO: Se llama idObra
  nombreObra: string;
  descripcion: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD
  estado: string;      // Ej: "En Ejecución", "Finalizada"

  gobiernoRegional: GobiernoRegional;
  expedienteTecnico: ExpedienteTecnico;
}

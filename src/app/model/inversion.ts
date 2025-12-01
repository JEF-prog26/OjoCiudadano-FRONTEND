import { ObraPublica } from './obraPublica';

export class Inversion {
  idInversion: number;
  montoTotal: string;
  fuenteFinanciamiento: string;
  fechaAprobacion: string; // YYYY-MM-DD

  // OJO: Debe llamarse igual que la variable en tu entidad Java
  obrapublica: ObraPublica;
}

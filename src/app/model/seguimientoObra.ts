import { User } from './user';
import { ObraPublica } from './obraPublica';

export class SeguimientoObra {
  id: number;
  fechaInicio: string; // LocalDate viaja como string (YYYY-MM-DD)
  activo: boolean = false;  // Boolean (true/false)

  obraPublica: ObraPublica;
  usuario: User;
}

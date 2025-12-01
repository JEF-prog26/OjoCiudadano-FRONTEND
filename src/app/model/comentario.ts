import { User } from './user';
import { ObraPublica } from './obraPublica';

export class Comentario {
  id: number;
  contenido: string;
  fechaComentario: string; // LocalDate viaja como string (YYYY-MM-DD)

  usuario: User;
  obraPublica: ObraPublica;
}

import { User } from './user';
import { ObraPublica } from './obraPublica';

export class Denuncia {
  idDenuncia: number;
  titulo: string;
  descripcion: string;
  estado: boolean = false; // false: Pendiente/Inactiva, true: Resuelta/Activa (según tu lógica)

  // Relaciones
  usuario: User;
  obraPublica: ObraPublica;
}

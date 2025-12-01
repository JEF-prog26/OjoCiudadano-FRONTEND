import { User } from './user';

export class Notificacion {
  id: number;
  mensaje: string;
  fechaEnvio: string; // LocalDate en Java -> string en TS
  leida: boolean;
  usuario: User;      // Relación ManyToOne con tu modelo User
}

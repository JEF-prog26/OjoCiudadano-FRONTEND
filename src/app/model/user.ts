import { Role } from './role';

export class User {
  id: number;
  username: string; // Es el correo
  password?: string;
  nombre: string;
  apellido: string;
  fechaRegistro: string; // LocalDate viaja como string en JSON
  roles: Role[];         // Java Set<> se convierte en Array []
}

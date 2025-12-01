import { Denuncia } from './denuncia';

export class Evidencia {
  id: number;
  tipo: string;       // Ej: "Foto", "Video", "Documento"
  urlArchivo: string; // URL o ruta del archivo
  denuncia: Denuncia;
}

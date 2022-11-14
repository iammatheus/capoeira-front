export interface Evento {
  _id: string;
  local: string;
  dataEvento?: Date;
  titulo: string;
  descricao: string;
  imagemUrl: string;
  telefone: string;
  email: string;
}

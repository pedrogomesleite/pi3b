
export interface Session {
  nome: string;
  qtdlabirintoSolucionados: number;
  labirintoAtualDescricao: string;
  tempo: string;
  pontuacao: string;
}

export interface LeaderBoardPosition {
  index: number;
  nome: string;
  pontuacao: string;
}

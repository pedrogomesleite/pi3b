
export interface Session {
  id: String,
  nome: string;
  labirintos_concluidos: string[],
}

export interface LeaderBoardPosition {
  index: number;
  nome: string;
  pontuacao: string;
}


export interface Session {
  id: string,
  nome: string;
  labirintos_concluidos: string[],
}

export interface LeaderBoardPosition {
  index: number;
  nome: string;
  pontuacao: string;
}

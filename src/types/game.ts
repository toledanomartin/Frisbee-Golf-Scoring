export interface Player {
  id: string;
  name: string;
  scores: number[];
  total: number;
  overPar: number;
}

export interface GameState {
  players: Player[];
  currentHole: number;
  totalHoles: number;
  pars: number[];
}

export interface PlayerStats extends Player {
  position: number;
  averagePerHole: number;
  bestHole: number;
  worstHole: number;
  aces: number;
  eagles: number;
  birdies: number;
  pars: number;
  bogeys: number;
  doubleBogeys: number;
}
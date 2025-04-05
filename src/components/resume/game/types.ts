
// Define shared types across game components

export interface GameObject {
  x: number;
  y: number;
  type: 'experience' | 'education' | 'awards';
  id: string;
  collected: boolean;
  element?: HTMLDivElement | null;
}

export interface GameState {
  isGameActive: boolean;
  isPaused: boolean;
  gameOver: boolean;
  score: number;
  gameProgress: number;
}

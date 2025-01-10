export interface Game {
    id: string;
    players: {
        id: string;
        name: string;
        avatar: string;
        university?: string;
        role?: string;
        isSchoolStudent?: boolean;
    }[];
    paragraph: string[];
    started: boolean;
    progress: { id: string; player: string; progress: number }[];
    results: any[];
}

export interface GameResult {
    id: string;
    playerName: string;
    rawWPM: number;
    correctWPM: number;
    accuracy: number;
  }
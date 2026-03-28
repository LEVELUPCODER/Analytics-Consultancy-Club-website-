export interface PredictionData {
  id: string;
  teamA: string;
  teamB: string;
  venue: string;
  date: string;
  kickoff: string;
  predictedWinner: string;
  confidence: number;
  tossImpact: string;
  keyDrivers: string[];
}

export interface TeamMetadata {
  code: string;
  flagColor: string;
  textColor: string;
}

export interface PredictionKPIs {
  total: number;
  avgConfidence: number;
  highConfidence: number;
  tossSensitive: number;
}

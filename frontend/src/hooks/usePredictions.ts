import { useState, useEffect } from "react";
import { PredictionData } from "../types/ipl";

// Mock data - later swap setTimeout with actual fetch to backend
const UPCOMING_PREDICTIONS: PredictionData[] = [
  {
    "id": "IPL2026-001",
    "teamA": "Punjab Kings",
    "teamB": "Gujarat Titans",
    "venue": "New Chandigarh",
    "date": "2026-03-31",
    "kickoff": "7:30 PM",
    "predictedWinner": "Punjab Kings",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-002",
    "teamA": "Royal Challengers Bengaluru",
    "teamB": "Chennai Super Kings",
    "venue": "Bengaluru",
    "date": "2026-04-05",
    "kickoff": "7:30 PM",
    "predictedWinner": "Royal Challengers Bengaluru",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-003",
    "teamA": "Delhi Capitals",
    "teamB": "Gujarat Titans",
    "venue": "Delhi",
    "date": "2026-04-08",
    "kickoff": "7:30 PM",
    "predictedWinner": "Delhi Capitals",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-004",
    "teamA": "Rajasthan Royals",
    "teamB": "Royal Challengers Bengaluru",
    "venue": "Guwahati",
    "date": "2026-04-10",
    "kickoff": "7:30 PM",
    "predictedWinner": "Rajasthan Royals",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-005",
    "teamA": "Mumbai Indians",
    "teamB": "Kolkata Knight Riders",
    "venue": "Mumbai",
    "date": "2026-03-29",
    "kickoff": "7:30 PM",
    "predictedWinner": "Kolkata Knight Riders",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-006",
    "teamA": "Lucknow Super Giants",
    "teamB": "Delhi Capitals",
    "venue": "Lucknow",
    "date": "2026-04-01",
    "kickoff": "7:30 PM",
    "predictedWinner": "Delhi Capitals",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-007",
    "teamA": "Lucknow Super Giants",
    "teamB": "Gujarat Titans",
    "venue": "Lucknow",
    "date": "2026-04-12",
    "kickoff": "7:30 PM",
    "predictedWinner": "Gujarat Titans",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-008",
    "teamA": "Mumbai Indians",
    "teamB": "Royal Challengers Bengaluru",
    "venue": "Mumbai",
    "date": "2026-04-12",
    "kickoff": "7:30 PM",
    "predictedWinner": "Royal Challengers Bengaluru",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-009",
    "teamA": "Chennai Super Kings",
    "teamB": "Delhi Capitals",
    "venue": "Chennai",
    "date": "2026-04-11",
    "kickoff": "7:30 PM",
    "predictedWinner": "Delhi Capitals",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-010",
    "teamA": "Kolkata Knight Riders",
    "teamB": "Lucknow Super Giants",
    "venue": "Kolkata",
    "date": "2026-04-09",
    "kickoff": "7:30 PM",
    "predictedWinner": "Lucknow Super Giants",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-011",
    "teamA": "Rajasthan Royals",
    "teamB": "Chennai Super Kings",
    "venue": "Guwahati",
    "date": "2026-03-30",
    "kickoff": "7:30 PM",
    "predictedWinner": "Chennai Super Kings",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-012",
    "teamA": "Gujarat Titans",
    "teamB": "Rajasthan Royals",
    "venue": "Ahmedabad",
    "date": "2026-04-04",
    "kickoff": "7:30 PM",
    "predictedWinner": "Rajasthan Royals",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-013",
    "teamA": "Chennai Super Kings",
    "teamB": "Punjab Kings",
    "venue": "Chennai",
    "date": "2026-04-03",
    "kickoff": "7:30 PM",
    "predictedWinner": "Punjab Kings",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-014",
    "teamA": "Rajasthan Royals",
    "teamB": "Mumbai Indians",
    "venue": "Guwahati",
    "date": "2026-04-07",
    "kickoff": "7:30 PM",
    "predictedWinner": "Mumbai Indians",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-015",
    "teamA": "Sunrisers Hyderabad",
    "teamB": "Lucknow Super Giants",
    "venue": "Hyderabad",
    "date": "2026-04-05",
    "kickoff": "7:30 PM",
    "predictedWinner": "Lucknow Super Giants",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-016",
    "teamA": "Punjab Kings",
    "teamB": "Sunrisers Hyderabad",
    "venue": "New Chandigarh",
    "date": "2026-04-11",
    "kickoff": "7:30 PM",
    "predictedWinner": "Sunrisers Hyderabad",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-017",
    "teamA": "Royal Challengers Bengaluru",
    "teamB": "Sunrisers Hyderabad",
    "venue": "Bengaluru",
    "date": "2026-03-28",
    "kickoff": "7:30 PM",
    "predictedWinner": "Sunrisers Hyderabad",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-018",
    "teamA": "Kolkata Knight Riders",
    "teamB": "Sunrisers Hyderabad",
    "venue": "Kolkata",
    "date": "2026-04-02",
    "kickoff": "7:30 PM",
    "predictedWinner": "Sunrisers Hyderabad",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-019",
    "teamA": "Kolkata Knight Riders",
    "teamB": "Punjab Kings",
    "venue": "Kolkata",
    "date": "2026-04-06",
    "kickoff": "7:30 PM",
    "predictedWinner": "Punjab Kings",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  },
  {
    "id": "IPL2026-020",
    "teamA": "Delhi Capitals",
    "teamB": "Mumbai Indians",
    "venue": "Delhi",
    "date": "2026-04-04",
    "kickoff": "7:30 PM",
    "predictedWinner": "Mumbai Indians",
    "confidence": 50,
    "tossImpact": "TBD",
    "keyDrivers": [
      "Pre-match model confidence: 50%",
      "Elo & Form EMA factored"
    ]
  }
];

export function usePredictions() {
  const [data, setData] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate network request - replace with actual fetch later
        // await new Promise(resolve => setTimeout(resolve, 800));
        setData(UPCOMING_PREDICTIONS);
      } catch (err) {
        setError("Failed to fetch prediction data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  score: number;
  accuracy: number;
  totalPredictions: number;
}

export const LeaderBoard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Mock leaderboard data
    setLeaderboard([
      {
        rank: 1,
        address: '0x1234...5678',
        displayName: 'CryptoOracle',
        score: 15420,
        accuracy: 89.5,
        totalPredictions: 245
      },
      {
        rank: 2,
        address: '0x2345...6789',
        displayName: 'BitPredictor',
        score: 12850,
        accuracy: 87.2,
        totalPredictions: 198
      },
      {
        rank: 3,
        address: '0x3456...7890',
        displayName: 'ChainAnalyst',
        score: 11200,
        accuracy: 85.8,
        totalPredictions: 167
      }
    ]);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="h-5 w-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((entry) => (
            <div
              key={entry.address}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div>
                  <div className="font-semibold">{entry.displayName}</div>
                  <div className="text-sm text-gray-500">{formatAddress(entry.address)}</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="font-bold text-lg">{entry.score.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
                <div>
                  <div className="font-semibold">{entry.accuracy.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div>
                  <Badge variant="outline" className="text-xs">
                    {entry.totalPredictions} predictions
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

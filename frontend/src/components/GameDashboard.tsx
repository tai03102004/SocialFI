"use client"
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PredictionCard } from './PredictionCard';
import { QuizComponent } from './QuizComponent';
import { AICoach } from './AICoach';
import { LeaderBoard } from './LeaderBoard';
import { AchievementPanel } from './AchievementPanel';

interface PlayerStats {
  score: number;
  totalPredictions: number;
  correctPredictions: number;
  stakedAmount: number;
  accuracy: number;
}

export const GameDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (address) {
      loadPlayerStats();
      loadCurrentPrice();
    }
  }, [address]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const loadPlayerStats = async () => {
    try {
      // Call contract to get player stats
      // Implementation depends on your contract integration
      console.log('Loading player stats for:', address);
    } catch (error) {
      console.error('Error loading player stats:', error);
    }
  };

  const loadCurrentPrice = async () => {
    try {
      // Fetch current BTC price from API
      const response = await fetch('/api/price/btc');
      const data = await response.json();
      setCurrentPrice(data.price);
    } catch (error) {
      console.error('Error loading price:', error);
    }
  };

  const handlePrediction = async () => {
    if (!prediction || !address) return;
    
    setLoading(true);
    try {
      console.log('Making prediction:', prediction);
      setPrediction('');
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">GameFi Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline">
            BTC: ${currentPrice.toLocaleString()}
          </Badge>
          {playerStats && (
            <Badge variant="secondary">
              Score: {playerStats.score}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      {playerStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{playerStats.score}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{playerStats.accuracy}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {playerStats.correctPredictions}/{playerStats.totalPredictions}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Staked GUI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(playerStats.stakedAmount / 1e18).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="predict" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="predict">Predict</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="coach">AI Coach</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="predict" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Make Prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Predict BTC price in 1 hour
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter price prediction"
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handlePrediction}
                  disabled={loading || !prediction}
                  className="w-full"
                >
                  {loading ? 'Submitting...' : 'Submit Prediction'}
                </Button>
              </CardContent>
            </Card>

            <PredictionCard currentPrice={currentPrice} />
          </div>
        </TabsContent>

        <TabsContent value="quiz">
          <QuizComponent />
        </TabsContent>

        <TabsContent value="coach">
          <AICoach playerStats={playerStats} />
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderBoard />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementPanel playerAddress={address} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

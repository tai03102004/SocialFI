import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';

interface PredictionCardProps {
  currentPrice: number;
}

interface PredictionHistory {
  id: string;
  predictedPrice: number;
  actualPrice?: number;
  timestamp: number;
  status: 'pending' | 'correct' | 'incorrect';
  accuracy?: number;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ currentPrice }) => {
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);

  useEffect(() => {
    loadPredictionHistory();
  }, []);

  const loadPredictionHistory = async () => {
    try {
      // Mock data for demo
      const mockPredictions: PredictionHistory[] = [
        {
          id: '1',
          predictedPrice: 45200,
          actualPrice: 45850,
          timestamp: Date.now() - 3600000,
          status: 'correct',
          accuracy: 98.6
        },
        {
          id: '2',
          predictedPrice: 44800,
          actualPrice: 43200,
          timestamp: Date.now() - 7200000,
          status: 'incorrect',
          accuracy: 96.4
        },
        {
          id: '3',
          predictedPrice: 46500,
          timestamp: Date.now() - 1800000,
          status: 'pending'
        }
      ];
      setPredictions(mockPredictions);
    } catch (error) {
      console.error('Error loading prediction history:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'bg-green-100 text-green-800';
      case 'incorrect': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct': return <TrendingUp className="h-4 w-4" />;
      case 'incorrect': return <TrendingDown className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Recent Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Price Display */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">Current BTC Price</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatPrice(currentPrice)}
          </div>
        </div>

        {/* Prediction History */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-700">Prediction History</h4>
          
          {predictions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No predictions yet</p>
              <p className="text-sm">Make your first prediction above!</p>
            </div>
          ) : (
            predictions.map((prediction) => (
              <div
                key={prediction.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(prediction.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(prediction.status)}
                      {prediction.status}
                    </span>
                  </Badge>
                  
                  <div>
                    <div className="font-medium">
                      {formatPrice(prediction.predictedPrice)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(prediction.timestamp)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {prediction.actualPrice && (
                    <>
                      <div className="text-sm font-medium">
                        {formatPrice(prediction.actualPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {prediction.accuracy}% accuracy
                      </div>
                    </>
                  )}
                  {prediction.status === 'pending' && (
                    <div className="text-xs text-yellow-600">
                      Resolving in {Math.ceil((prediction.timestamp + 3600000 - Date.now()) / 60000)}min
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        {predictions.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Your Stats</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  {predictions.filter(p => p.status === 'correct').length}
                </div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(
                    predictions
                      .filter(p => p.accuracy)
                      .reduce((acc, p) => acc + (p.accuracy || 0), 0) /
                    predictions.filter(p => p.accuracy).length || 0
                  )}%
                </div>
                <div className="text-xs text-gray-500">Avg Accuracy</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

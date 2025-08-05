import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Target, Star, Brain } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress?: number;
  requirement: number;
}

interface AchievementPanelProps {
  playerAddress?: string;
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({ playerAddress }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Mock achievements data
    setAchievements([
      {
        id: 1,
        name: "First Steps",
        description: "Make your first price prediction",
        emoji: "🎯",
        unlocked: true,
        progress: 1,
        requirement: 1
      },
      {
        id: 2,
        name: "Century Predictor",
        description: "Make 100 price predictions",
        emoji: "💯",
        unlocked: false,
        progress: 45,
        requirement: 100
      },
      {
        id: 3,
        name: "Oracle",
        description: "Achieve 80% prediction accuracy",
        emoji: "🔮",
        unlocked: true,
        progress: 85,
        requirement: 80
      },
      {
        id: 4,
        name: "Quiz Master",
        description: "Complete 30 daily quizzes",
        emoji: "🧠",
        unlocked: false,
        progress: 12,
        requirement: 30
      }
    ]);
  }, [playerAddress]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{unlockedCount}/{totalCount}</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{unlockedCount}</div>
                <div className="text-xs text-gray-500">Unlocked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{totalCount - unlockedCount}</div>
                <div className="text-xs text-gray-500">Locked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const progressPercentage = achievement.progress ? (achievement.progress / achievement.requirement) * 100 : 0;
              
              return (
                <div
                  key={achievement.id}
                  className={`relative p-4 border-2 rounded-lg transition-all ${
                    achievement.unlocked 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-gray-50 opacity-75'
                  }`}
                >
                  {/* Unlock indicator */}
                  {achievement.unlocked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="h-3 w-3 text-white" />
                    </div>
                  )}

                  {/* Achievement content */}
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{achievement.emoji}</div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{achievement.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    </div>

                    {/* Progress */}
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.requirement}</span>
                        </div>
                        <Progress value={progressPercentage} className="w-full" />
                      </div>
                    )}

                    {achievement.unlocked && (
                      <Badge variant="default" className="bg-green-500">
                        Unlocked!
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

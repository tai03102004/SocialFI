import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AICoachProps {
  playerStats: any;
}

export const AICoach: React.FC<AICoachProps> = ({ playerStats }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI coach powered by Google Gemini. I can help you analyze markets, improve your trading strategies, and answer questions about crypto. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Mock AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I understand you're asking about "${userMessage.content}". Based on current market conditions and your stats, I'd recommend focusing on technical analysis and risk management. Remember, this is educational content only!`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤖 AI Coach Chat
              <Badge variant="outline">Powered by Gemini</Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 mb-4 space-y-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <p className="text-sm">AI is typing...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about crypto trading..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Ask</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setInput("What's the best strategy for a beginner?")}
            >
              Beginner Strategy
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setInput("Analyze current market conditions")}
            >
              Market Analysis
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setInput("How can I improve my prediction accuracy?")}
            >
              Improve Accuracy
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizState {
  questions: QuizQuestion[];
  currentQuestion: number;
  selectedAnswers: number[];
  showResults: boolean;
  score: number;
  loading: boolean;
}

export const QuizComponent: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    selectedAnswers: [],
    showResults: false,
    score: 0,
    loading: false
  });

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  useEffect(() => {
    loadQuiz();
  }, [difficulty]);

  const loadQuiz = async () => {
    setQuizState(prev => ({ ...prev, loading: true }));
    
    try {
      // Mock quiz data for demo
      const mockQuestions: QuizQuestion[] = [
        {
          question: "What is the main purpose of ZetaChain?",
          options: [
            "To create another cryptocurrency",
            "To enable cross-chain communication and Universal Smart Contracts",
            "To replace Bitcoin",
            "To mine cryptocurrencies faster"
          ],
          correctAnswer: 1,
          explanation: "ZetaChain enables cross-chain communication through Universal Smart Contracts, allowing seamless interaction between different blockchains.",
          difficulty: difficulty
        },
        {
          question: "What does DeFi stand for?",
          options: [
            "Decentralized Finance",
            "Digital Finance",
            "Distributed Finance",
            "Direct Finance"
          ],
          correctAnswer: 0,
          explanation: "DeFi stands for Decentralized Finance, which refers to financial services built on blockchain technology.",
          difficulty: difficulty
        }
      ];
      
      setQuizState({
        questions: mockQuestions,
        currentQuestion: 0,
        selectedAnswers: new Array(mockQuestions.length).fill(-1),
        showResults: false,
        score: 0,
        loading: false
      });
    } catch (error) {
      console.error('Error loading quiz:', error);
      setQuizState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...quizState.selectedAnswers];
    newSelectedAnswers[quizState.currentQuestion] = answerIndex;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: newSelectedAnswers
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }));
    }
  };

  const submitQuiz = async () => {
    const score = quizState.selectedAnswers.reduce((total, answer, index) => {
      return total + (answer === quizState.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    setQuizState(prev => ({
      ...prev,
      score,
      showResults: true
    }));

    // Submit to backend for reward calculation
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          totalQuestions: quizState.questions.length,
          difficulty,
          answers: quizState.selectedAnswers
        })
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (quizState.loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="animate-spin mr-2" />
          <span>Loading quiz questions...</span>
        </CardContent>
      </Card>
    );
  }

  if (quizState.questions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center p-8">
          <p className="mb-4">No quiz questions available.</p>
          <Button onClick={loadQuiz}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const currentQ = quizState.questions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / quizState.questions.length) * 100;
  const currentSelectedAnswer = quizState.selectedAnswers[quizState.currentQuestion];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              🧠 Daily Crypto Quiz
              <Badge className={getDifficultyColor(difficulty)}>
                {difficulty.toUpperCase()}
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty(diff)}
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {quizState.currentQuestion + 1} of {quizState.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Quiz Results */}
      {quizState.showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`text-4xl font-bold ${getScoreColor((quizState.score / quizState.questions.length) * 100)}`}>
              {quizState.score}/{quizState.questions.length}
            </div>
            <div className={`text-xl ${getScoreColor((quizState.score / quizState.questions.length) * 100)}`}>
              {Math.round((quizState.score / quizState.questions.length) * 100)}% Correct
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={loadQuiz}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Quiz
              </Button>
              <Button variant="outline" onClick={() => setQuizState(prev => ({ ...prev, showResults: false, currentQuestion: 0 }))}>
                Review Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Question */}
      {!quizState.showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant={currentSelectedAnswer === index ? 'default' : 'outline'}
                  className="justify-start text-left h-auto p-4 whitespace-normal"
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="font-semibold mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={quizState.currentQuestion === 0}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {quizState.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === quizState.currentQuestion
                        ? 'bg-blue-500'
                        : quizState.selectedAnswers[index] !== -1
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {quizState.currentQuestion === quizState.questions.length - 1 ? (
                <Button
                  onClick={submitQuiz}
                  disabled={quizState.selectedAnswers.includes(-1)}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  disabled={currentSelectedAnswer === -1}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Answer Review */}
      {quizState.showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Answer Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {quizState.questions.map((question, qIndex) => {
              const userAnswer = quizState.selectedAnswers[qIndex];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={qIndex} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    ) : (
                      <XCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">
                        Question {qIndex + 1}: {question.question}
                      </h4>
                      
                      <div className="space-y-1 mb-2">
                        {question.options.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className={`p-2 rounded text-sm ${
                              oIndex === question.correctAnswer
                                ? 'bg-green-100 text-green-800'
                                : oIndex === userAnswer && !isCorrect
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-50'
                            }`}
                          >
                            <span className="font-semibold mr-2">
                              {String.fromCharCode(65 + oIndex)}.
                            </span>
                            {option}
                            {oIndex === question.correctAnswer && (
                              <span className="ml-2 text-green-600">✓ Correct</span>
                            )}
                            {oIndex === userAnswer && !isCorrect && (
                              <span className="ml-2 text-red-600">✗ Your answer</span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

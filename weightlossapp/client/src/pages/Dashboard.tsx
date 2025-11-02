import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserProfile, getStreak, updateStreak, getMealEntries, getWaterEntries, getExerciseEntries } from '@/lib/storage';
import { getDailyInsight, getTodayString } from '@/lib/insights';
import { Flame, Droplets, Footprints, TrendingDown, Quote, Lightbulb, Target, Award, Bot, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function Dashboard() {
  const [profile, setProfile] = useState(getUserProfile());
  const [insight, setInsight] = useState(getDailyInsight());
  const [streak, setStreak] = useState(getStreak());
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    water: 0,
    exercise: 0,
  });
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);

  const askQuestionMutation = trpc.ai.askQuestion.useMutation({
    onSuccess: (data) => {
      setAiAnswer(data.answer);
      setIsAskingAI(false);
      setAiQuestion(''); // Clear the input after successful response
    },
    onError: (error) => {
      toast.error('Failed to get answer. Please try again.');
      setIsAskingAI(false);
    },
  });

  useEffect(() => {
    updateStreak();
    setStreak(getStreak());

    // Calculate today's stats
    const today = getTodayString();
    const meals = getMealEntries().filter((m) => m.date === today);
    const water = getWaterEntries().filter((w) => w.date === today);
    const exercises = getExerciseEntries().filter((e) => e.date === today);

    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalWater = water.reduce((sum, w) => sum + w.amount, 0);
    const totalExercise = exercises.reduce((sum, e) => sum + e.duration, 0);

    setTodayStats({
      calories: totalCalories,
      water: totalWater,
      exercise: totalExercise,
    });
  }, []);

  if (!profile) {
    return null;
  }

  const calorieProgress = (todayStats.calories / profile.dailyCalorieGoal) * 100;
  const waterProgress = (todayStats.water / profile.dailyWaterGoal) * 100;
  const weightLost = profile.currentWeight - (profile.currentWeight - 2); // Placeholder
  const weightToGo = profile.currentWeight - profile.targetWeight;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.name}! 👋</h1>
          <p className="text-green-100 text-lg">
            You're doing great! Keep up the amazing work on your journey.
          </p>
        </div>

        {/* Streak & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-900 flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{streak.count}</div>
              <p className="text-xs text-orange-700 mt-1">days in a row! 🔥</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900 flex items-center">
                <TrendingDown className="mr-2 h-4 w-4" />
                Weight Lost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{weightLost.toFixed(1)}</div>
              <p className="text-xs text-blue-700 mt-1">lbs so far</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900 flex items-center">
                <Target className="mr-2 h-4 w-4" />
                To Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{weightToGo.toFixed(1)}</div>
              <p className="text-xs text-green-700 mt-1">lbs remaining</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900 flex items-center">
                <Footprints className="mr-2 h-4 w-4" />
                Exercise Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{todayStats.exercise}</div>
              <p className="text-xs text-purple-700 mt-1">minutes</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quote of the Day */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Quote className="mr-2 h-5 w-5" />
                Quote of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="italic text-lg text-gray-700 mb-2">
                "{insight.quote}"
              </blockquote>
              <p className="text-sm text-gray-500">— {insight.author}</p>
            </CardContent>
          </Card>

          {/* Daily Tip */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Lightbulb className="mr-2 h-5 w-5" />
                Daily Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{insight.tip}</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Focus */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Target className="mr-2 h-5 w-5" />
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-800">{insight.focus}</p>
          </CardContent>
        </Card>

        {/* AI Weight Loss Coach */}
        <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-700">
              <Bot className="mr-2 h-6 w-6" />
              Ask Your AI Weight Loss Coach
            </CardTitle>
            <CardDescription>
              Get personalized answers to your weight loss questions powered by Grok AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask anything about weight loss, nutrition, or exercise..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isAskingAI && aiQuestion.trim()) {
                    setIsAskingAI(true);
                    setAiAnswer('');
                    askQuestionMutation.mutate({
                      question: aiQuestion,
                      profile: {
                        name: profile.name,
                        currentWeight: profile.currentWeight,
                        targetWeight: profile.targetWeight,
                        height: profile.height,
                        age: profile.age,
                        gender: profile.gender,
                        activityLevel: profile.activityLevel,
                        dailyCalories: profile.dailyCalorieGoal,
                      },
                    });
                  }
                }}
                disabled={isAskingAI}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  if (aiQuestion.trim()) {
                    setIsAskingAI(true);
                    setAiAnswer('');
                    askQuestionMutation.mutate({
                      question: aiQuestion,
                      profile: {
                        name: profile.name,
                        currentWeight: profile.currentWeight,
                        targetWeight: profile.targetWeight,
                        height: profile.height,
                        age: profile.age,
                        gender: profile.gender,
                        activityLevel: profile.activityLevel,
                        dailyCalories: profile.dailyCalorieGoal,
                      },
                    });
                  }
                }}
                disabled={isAskingAI || !aiQuestion.trim()}
                className="gap-2"
              >
                {isAskingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Ask
                  </>
                )}
              </Button>
            </div>
            {aiAnswer && (
              <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <div className="flex items-start gap-3">
                  <Bot className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{aiAnswer}</p>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {['How much water should I drink?', 'Best time to exercise?', 'Healthy snack ideas?'].map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  onClick={() => setAiQuestion(q)}
                  className="text-xs"
                >
                  {q}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calories */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-orange-700">
                  <Flame className="mr-2 h-5 w-5" />
                  Calories
                </span>
                <span className="text-sm font-normal text-gray-600">
                  {todayStats.calories} / {profile.dailyCalorieGoal}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={Math.min(calorieProgress, 100)} className="h-3" />
              <p className="text-xs text-gray-600">
                {profile.dailyCalorieGoal - todayStats.calories > 0
                  ? `${profile.dailyCalorieGoal - todayStats.calories} calories remaining`
                  : 'Goal reached!'}
              </p>
            </CardContent>
          </Card>

          {/* Water */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-blue-700">
                  <Droplets className="mr-2 h-5 w-5" />
                  Water Intake
                </span>
                <span className="text-sm font-normal text-gray-600">
                  {(todayStats.water / 1000).toFixed(1)}L / {(profile.dailyWaterGoal / 1000).toFixed(1)}L
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={Math.min(waterProgress, 100)} className="h-3" />
              <p className="text-xs text-gray-600">
                {profile.dailyWaterGoal - todayStats.water > 0
                  ? `${((profile.dailyWaterGoal - todayStats.water) / 1000).toFixed(1)}L to go`
                  : 'Hydration goal met! 💧'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Log your activities for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Flame className="h-6 w-6 mb-2 text-orange-600" />
                <span className="text-sm">Log Meal</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Droplets className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-sm">Add Water</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <Footprints className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-sm">Log Exercise</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                <TrendingDown className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-sm">Log Weight</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


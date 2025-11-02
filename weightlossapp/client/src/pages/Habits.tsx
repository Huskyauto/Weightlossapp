import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getHabitEntries, saveHabitEntry, getSleepEntries, saveSleepEntry, getMoodEntries, saveMoodEntry } from '@/lib/storage';
import { getTodayString } from '@/lib/insights';
import type { HabitEntry, SleepEntry, MoodEntry } from '@/lib/types';
import { CheckCircle2, Moon, Smile, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const DAILY_HABITS = [
  { id: 'water', label: 'Drink 8 glasses of water', icon: '💧' },
  { id: 'vegetables', label: 'Eat 5 servings of vegetables', icon: '🥗' },
  { id: 'exercise', label: 'Exercise for 30+ minutes', icon: '🏃' },
  { id: 'sleep', label: 'Get 7-8 hours of sleep', icon: '😴' },
  { id: 'meditation', label: 'Meditate for 10 minutes', icon: '🧘' },
  { id: 'meal_prep', label: 'Prep healthy meals', icon: '🍱' },
  { id: 'no_sugar', label: 'Avoid added sugars', icon: '🚫' },
  { id: 'walk', label: 'Take a 10-minute walk', icon: '🚶' },
];

const MOOD_OPTIONS = [
  { value: 'great', label: 'Great', emoji: '😄', color: 'bg-green-100 text-green-700' },
  { value: 'good', label: 'Good', emoji: '😊', color: 'bg-blue-100 text-blue-700' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'bad', label: 'Bad', emoji: '😟', color: 'bg-orange-100 text-orange-700' },
  { value: 'terrible', label: 'Terrible', emoji: '😢', color: 'bg-red-100 text-red-700' },
];

export default function Habits() {
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [todayHabits, setTodayHabits] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    const allEntries = getHabitEntries();
    setHabitEntries(allEntries);
    
    const today = getTodayString();
    const todayCompleted = new Set(
      allEntries
        .filter(e => e.date === today && e.completed)
        .map(e => e.habitType)
    );
    setTodayHabits(todayCompleted);
  };

  const toggleHabit = (habitId: string) => {
    const today = getTodayString();
    const isCompleted = !todayHabits.has(habitId);
    
    const entry: HabitEntry = {
      id: `${habitId}-${today}`,
      date: today,
      habitType: habitId,
      completed: isCompleted,
    };

    saveHabitEntry(entry);
    
    const newHabits = new Set(todayHabits);
    if (isCompleted) {
      newHabits.add(habitId);
      toast.success('Habit completed! 🎉');
    } else {
      newHabits.delete(habitId);
    }
    setTodayHabits(newHabits);
  };

  const completedCount = todayHabits.size;
  const totalHabits = DAILY_HABITS.length;
  const completionPercent = Math.round((completedCount / totalHabits) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-24">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Habits</h1>
          <p className="text-gray-600 mt-1">Build healthy habits one day at a time</p>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Today's Progress
              </span>
              <span className="text-3xl font-bold text-green-600">{completionPercent}%</span>
            </CardTitle>
            <CardDescription>
              {completedCount} of {totalHabits} habits completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Habit Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Daily Checklist
            </CardTitle>
            <CardDescription>Check off your healthy habits as you complete them</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DAILY_HABITS.map((habit) => {
                const isCompleted = todayHabits.has(habit.id);
                return (
                  <div
                    key={habit.id}
                    className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-green-50 border-green-300'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleHabit(habit.id)}
                  >
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => toggleHabit(habit.id)}
                      className="mr-4"
                    />
                    <span className="text-2xl mr-3">{habit.icon}</span>
                    <span
                      className={`text-lg ${
                        isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {habit.label}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="ml-auto h-6 w-6 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Message */}
        {completedCount === totalHabits && (
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Perfect Day!</h3>
                <p className="text-green-100">
                  You've completed all your healthy habits today. Keep up the amazing work!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Streak Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smile className="mr-2 h-5 w-5" />
              Keep Going!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Consistency is key! Try to complete at least 5 habits every day to build lasting healthy behaviors.
              Small daily actions lead to big results over time.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


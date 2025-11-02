import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getExerciseEntries, saveExerciseEntry, getUserProfile } from '@/lib/storage';
import { getTodayString } from '@/lib/insights';
import type { ExerciseEntry } from '@/lib/types';
import { Plus, Flame, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { calculateExerciseCalories } from '@/lib/exercise-calories';

export default function Exercise() {
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    activity: '',
    duration: '',
    intensity: 'medium' as 'low' | 'medium' | 'high',
    caloriesBurned: '',
  });
  const [profile] = useState(getUserProfile());
  const [autoCalories, setAutoCalories] = useState<number | null>(null);

  // Auto-calculate calories when activity, duration, or intensity changes
  useEffect(() => {
    if (newEntry.activity && newEntry.duration && profile) {
      const calories = calculateExerciseCalories(
        newEntry.activity,
        parseInt(newEntry.duration),
        newEntry.intensity,
        profile.currentWeight
      );
      setAutoCalories(calories);
    } else {
      setAutoCalories(null);
    }
  }, [newEntry.activity, newEntry.duration, newEntry.intensity, profile]);

  useEffect(() => {
    loadEntries();
    // Auto-fix entries with 0 calories on first load
    fixZeroCalorieEntries();
  }, []);

  const fixZeroCalorieEntries = () => {
    if (!profile) return;
    
    const allEntries = getExerciseEntries();
    let updated = false;
    
    allEntries.forEach(entry => {
      if (entry.caloriesBurned === 0 && entry.activity && entry.duration) {
        const calories = calculateExerciseCalories(
          entry.activity,
          entry.duration,
          entry.intensity || 'medium',
          profile.currentWeight
        );
        entry.caloriesBurned = calories;
        saveExerciseEntry(entry);
        updated = true;
      }
    });
    
    if (updated) {
      loadEntries();
      toast.success('Updated calorie calculations for past exercises!');
    }
  };

  const loadEntries = () => {
    const allEntries = getExerciseEntries().sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setEntries(allEntries);
  };

  const handleAddEntry = () => {
    if (!newEntry.activity || !newEntry.duration) {
      toast.error('Please enter exercise activity and duration');
      return;
    }

    // Use manual entry if provided, otherwise use auto-calculated calories
    const calories = newEntry.caloriesBurned 
      ? parseInt(newEntry.caloriesBurned) 
      : autoCalories || 0;

    const entry: ExerciseEntry = {
      id: Date.now().toString(),
      date: getTodayString(),
      activity: newEntry.activity,
      duration: parseInt(newEntry.duration),
      intensity: newEntry.intensity,
      caloriesBurned: calories,
    };

    saveExerciseEntry(entry);
    loadEntries();
    setNewEntry({ activity: '', duration: '', intensity: 'medium', caloriesBurned: '' });
    setAutoCalories(null);
    setIsDialogOpen(false);
    toast.success(`Exercise logged! ${calories} calories burned 🔥`);
  };

  const todayEntries = entries.filter(e => e.date === getTodayString());
  const totalMinutesToday = todayEntries.reduce((sum, e) => sum + e.duration, 0);
  const totalCaloriesToday = todayEntries.reduce((sum, e) => sum + (e.caloriesBurned || 0), 0);
  const thisWeekEntries = entries.filter(e => {
    const entryDate = new Date(e.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });
  const weeklyMinutes = thisWeekEntries.reduce((sum, e) => sum + e.duration, 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exercise Tracker</h1>
            <p className="text-gray-600 mt-1">Log your workouts and stay active</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fixZeroCalorieEntries}
              className="gap-2"
            >
              <Flame className="h-4 w-4" />
              Recalculate Calories
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Log Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Your Exercise</DialogTitle>
                <DialogDescription>
                  Record your workout to track your activity
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="activity">Exercise Activity</Label>
                  <Input
                    id="activity"
                    placeholder="e.g., Running, Yoga, Cycling"
                    value={newEntry.activity}
                    onChange={(e) => setNewEntry({ ...newEntry, activity: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 30"
                    value={newEntry.duration}
                    onChange={(e) => setNewEntry({ ...newEntry, duration: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="intensity">Intensity</Label>
                  <Select
                    value={newEntry.intensity}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setNewEntry({ ...newEntry, intensity: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="calories">Calories Burned</Label>
                  {autoCalories !== null && (
                    <p className="text-sm text-green-600 mt-1 mb-2">
                      ✓ Auto-calculated: {autoCalories} calories
                    </p>
                  )}
                  <Input
                    id="calories"
                    type="number"
                    placeholder={autoCalories ? `Auto: ${autoCalories} (or enter custom)` : 'Will auto-calculate'}
                    value={newEntry.caloriesBurned}
                    onChange={(e) => setNewEntry({ ...newEntry, caloriesBurned: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to use auto-calculated value based on your weight
                  </p>
                </div>
                <Button onClick={handleAddEntry} className="w-full">
                  Save Exercise
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900 flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Today's Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{totalMinutesToday}</div>
              <p className="text-xs text-purple-700 mt-1">minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-900 flex items-center">
                <Flame className="mr-2 h-4 w-4" />
                Calories Burned Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{totalCaloriesToday}</div>
              <p className="text-xs text-orange-700 mt-1">calories</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900 flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{weeklyMinutes}</div>
              <p className="text-xs text-green-700 mt-1">minutes total</p>
            </CardContent>
          </Card>
        </div>

        {/* Exercise History */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise History</CardTitle>
            <CardDescription>Your recent workouts</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No exercises logged yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Start logging your workouts to track your activity over time.
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Log Your First Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">{entry.activity}</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                          {entry.intensity}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {entry.duration} min
                        </span>
                        {entry.caloriesBurned && (
                          <span className="flex items-center">
                            <Flame className="h-4 w-4 mr-1" />
                            {entry.caloriesBurned} cal
                          </span>
                        )}
                        <span className="text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


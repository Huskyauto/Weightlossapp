import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getMealEntries, saveMealEntry, getWaterEntries, saveWaterEntry, getUserProfile } from '@/lib/storage';
import { getTodayString } from '@/lib/insights';
import type { MealEntry, WaterEntry } from '@/lib/types';
import { Plus, Utensils, Droplets, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function Nutrition() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [water, setWater] = useState<WaterEntry[]>([]);
  const [profile, setProfile] = useState(getUserProfile());
  const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({
    mealType: 'breakfast' as MealEntry['mealType'],
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const today = getTodayString();
    setMeals(getMealEntries().filter((m) => m.date === today));
    setWater(getWaterEntries().filter((w) => w.date === today));
  };

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.calories) {
      toast.error('Please enter meal name and calories');
      return;
    }

    const entry: MealEntry = {
      id: Date.now().toString(),
      date: getTodayString(),
      mealType: newMeal.mealType,
      name: newMeal.name,
      calories: parseFloat(newMeal.calories),
      protein: newMeal.protein ? parseFloat(newMeal.protein) : undefined,
      carbs: newMeal.carbs ? parseFloat(newMeal.carbs) : undefined,
      fats: newMeal.fats ? parseFloat(newMeal.fats) : undefined,
    };

    saveMealEntry(entry);
    loadData();
    setNewMeal({
      mealType: 'breakfast',
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
    });
    setIsMealDialogOpen(false);
    toast.success('Meal logged successfully!');
  };

  const handleAddWater = (amount: number) => {
    const entry: WaterEntry = {
      id: Date.now().toString(),
      date: getTodayString(),
      amount,
    };
    saveWaterEntry(entry);
    loadData();
    toast.success(`Added ${amount}ml of water!`);
  };

  if (!profile) return null;

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalFats = meals.reduce((sum, m) => sum + (m.fats || 0), 0);
  const totalWater = water.reduce((sum, w) => sum + w.amount, 0);

  const calorieProgress = (totalCalories / profile.dailyCalorieGoal) * 100;
  const waterProgress = (totalWater / profile.dailyWaterGoal) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracker</h1>
            <p className="text-gray-600 mt-1">Track your meals and hydration</p>
          </div>
          <Dialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Log Meal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Log a Meal</DialogTitle>
                <DialogDescription>Record what you ate</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Meal Type</Label>
                  <Select
                    value={newMeal.mealType}
                    onValueChange={(value) =>
                      setNewMeal({ ...newMeal, mealType: value as MealEntry['mealType'] })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name">Meal Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Grilled Chicken Salad"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="calories">Calories *</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="e.g., 350"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      placeholder="e.g., 30"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      placeholder="e.g., 40"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fats">Fats (g)</Label>
                    <Input
                      id="fats"
                      type="number"
                      placeholder="e.g., 15"
                      value={newMeal.fats}
                      onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
                <Button onClick={handleAddMeal} className="w-full">
                  Save Meal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-orange-700">
                  <Flame className="mr-2 h-5 w-5" />
                  Calories Today
                </span>
                <span className="text-sm font-normal text-gray-600">
                  {totalCalories} / {profile.dailyCalorieGoal}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={Math.min(calorieProgress, 100)} className="h-3" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-blue-600 font-medium">Protein</div>
                  <div className="text-lg font-bold text-blue-700">{totalProtein}g</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-600 font-medium">Carbs</div>
                  <div className="text-lg font-bold text-green-700">{totalCarbs}g</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-sm text-yellow-600 font-medium">Fats</div>
                  <div className="text-lg font-bold text-yellow-700">{totalFats}g</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center text-blue-700">
                  <Droplets className="mr-2 h-5 w-5" />
                  Water Intake
                </span>
                <span className="text-sm font-normal text-gray-600">
                  {(totalWater / 1000).toFixed(1)}L / {(profile.dailyWaterGoal / 1000).toFixed(1)}L
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={Math.min(waterProgress, 100)} className="h-3" />
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddWater(250)}
                  className="flex flex-col h-auto py-3"
                >
                  <Droplets className="h-5 w-5 mb-1 text-blue-600" />
                  <span className="text-xs">250ml</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddWater(500)}
                  className="flex flex-col h-auto py-3"
                >
                  <Droplets className="h-6 w-6 mb-1 text-blue-600" />
                  <span className="text-xs">500ml</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddWater(1000)}
                  className="flex flex-col h-auto py-3"
                >
                  <Droplets className="h-7 w-7 mb-1 text-blue-600" />
                  <span className="text-xs">1L</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meals List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2 h-5 w-5" />
              Today's Meals
            </CardTitle>
            <CardDescription>Your food log for today</CardDescription>
          </CardHeader>
          <CardContent>
            {meals.length === 0 ? (
              <div className="text-center py-12">
                <Utensils className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No meals logged yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Start tracking your meals to monitor your nutrition.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 capitalize">
                          {meal.mealType}
                        </span>
                        <span className="font-medium text-gray-900">{meal.name}</span>
                      </div>
                      <div className="mt-2 flex gap-4 text-sm text-gray-600">
                        <span className="font-medium">{meal.calories} cal</span>
                        {meal.protein && <span>P: {meal.protein}g</span>}
                        {meal.carbs && <span>C: {meal.carbs}g</span>}
                        {meal.fats && <span>F: {meal.fats}g</span>}
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


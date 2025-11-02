export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  notes?: string;
}

export interface MealEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface WaterEntry {
  id: string;
  date: string;
  amount: number; // in ml
}

export interface ExerciseEntry {
  id: string;
  date: string;
  activity: string;
  duration: number; // in minutes
  caloriesBurned: number;
  intensity?: 'low' | 'medium' | 'high';
}

export interface HabitEntry {
  id: string;
  date: string;
  habitType: string;
  completed: boolean;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  notes?: string;
}

export interface SleepEntry {
  id: string;
  date: string;
  hours: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface UserProfile {
  name: string;
  currentWeight: number;
  targetWeight: number;
  height: number; // in cm
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  startDate: string;
  dailyCalorieGoal: number;
  dailyWaterGoal: number; // in ml
}

export interface DailyInsight {
  quote: string;
  author: string;
  tip: string;
  focus: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}


import type {
  WeightEntry,
  MealEntry,
  WaterEntry,
  ExerciseEntry,
  HabitEntry,
  MoodEntry,
  SleepEntry,
  UserProfile,
  Achievement,
} from './types';

const STORAGE_KEYS = {
  PROFILE: 'wlc_profile',
  WEIGHT_ENTRIES: 'wlc_weight_entries',
  MEAL_ENTRIES: 'wlc_meal_entries',
  WATER_ENTRIES: 'wlc_water_entries',
  EXERCISE_ENTRIES: 'wlc_exercise_entries',
  HABIT_ENTRIES: 'wlc_habit_entries',
  MOOD_ENTRIES: 'wlc_mood_entries',
  SLEEP_ENTRIES: 'wlc_sleep_entries',
  ACHIEVEMENTS: 'wlc_achievements',
  STREAK: 'wlc_streak',
  ONBOARDING_COMPLETE: 'wlc_onboarding_complete',
} as const;

// Generic storage functions
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Profile
export function getUserProfile(): UserProfile | null {
  return getItem<UserProfile | null>(STORAGE_KEYS.PROFILE, null);
}

export function saveUserProfile(profile: UserProfile): void {
  setItem(STORAGE_KEYS.PROFILE, profile);
}

// Weight entries
export function getWeightEntries(): WeightEntry[] {
  return getItem<WeightEntry[]>(STORAGE_KEYS.WEIGHT_ENTRIES, []);
}

export function saveWeightEntry(entry: WeightEntry): void {
  const entries = getWeightEntries();
  const existingIndex = entries.findIndex((e) => e.id === entry.id);
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.WEIGHT_ENTRIES, entries);
}

export function deleteWeightEntry(id: string): void {
  const entries = getWeightEntries().filter((e) => e.id !== id);
  setItem(STORAGE_KEYS.WEIGHT_ENTRIES, entries);
}

// Meal entries
export function getMealEntries(): MealEntry[] {
  return getItem<MealEntry[]>(STORAGE_KEYS.MEAL_ENTRIES, []);
}

export function saveMealEntry(entry: MealEntry): void {
  const entries = getMealEntries();
  const existingIndex = entries.findIndex((e) => e.id === entry.id);
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.MEAL_ENTRIES, entries);
}

export function deleteMealEntry(id: string): void {
  const entries = getMealEntries().filter((e) => e.id !== id);
  setItem(STORAGE_KEYS.MEAL_ENTRIES, entries);
}

// Water entries
export function getWaterEntries(): WaterEntry[] {
  return getItem<WaterEntry[]>(STORAGE_KEYS.WATER_ENTRIES, []);
}

export function saveWaterEntry(entry: WaterEntry): void {
  const entries = getWaterEntries();
  const existingIndex = entries.findIndex((e) => e.id === entry.id);
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.WATER_ENTRIES, entries);
}

// Exercise entries
export function getExerciseEntries(): ExerciseEntry[] {
  return getItem<ExerciseEntry[]>(STORAGE_KEYS.EXERCISE_ENTRIES, []);
}

export function saveExerciseEntry(entry: ExerciseEntry): void {
  const entries = getExerciseEntries();
  const existingIndex = entries.findIndex((e) => e.id === entry.id);
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.EXERCISE_ENTRIES, entries);
}

export function deleteExerciseEntry(id: string): void {
  const entries = getExerciseEntries().filter((e) => e.id !== id);
  setItem(STORAGE_KEYS.EXERCISE_ENTRIES, entries);
}

// Habit entries
export function getHabitEntries(): HabitEntry[] {
  return getItem<HabitEntry[]>(STORAGE_KEYS.HABIT_ENTRIES, []);
}

export function saveHabitEntry(entry: HabitEntry): void {
  const entries = getHabitEntries();
  const existingIndex = entries.findIndex(
    (e) => e.date === entry.date && e.habitType === entry.habitType
  );
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.HABIT_ENTRIES, entries);
}

// Mood entries
export function getMoodEntries(): MoodEntry[] {
  return getItem<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES, []);
}

export function saveMoodEntry(entry: MoodEntry): void {
  const entries = getMoodEntries();
  const existingIndex = entries.findIndex((e) => e.id === entry.id);
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.MOOD_ENTRIES, entries);
}

// Sleep entries
export function getSleepEntries(): SleepEntry[] {
  return getItem<SleepEntry[]>(STORAGE_KEYS.SLEEP_ENTRIES, []);
}

export function saveSleepEntry(entry: SleepEntry): void {
  const entries = getSleepEntries();
  const existingIndex = entries.findIndex((e) => e.id === entry.id);
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  setItem(STORAGE_KEYS.SLEEP_ENTRIES, entries);
}

// Achievements
export function getAchievements(): Achievement[] {
  return getItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []);
}

export function unlockAchievement(achievement: Achievement): void {
  const achievements = getAchievements();
  const existing = achievements.find((a) => a.id === achievement.id);
  if (!existing) {
    achievements.push({ ...achievement, unlockedAt: new Date().toISOString() });
    setItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  }
}

// Streak
export function getStreak(): { count: number; lastDate: string } {
  return getItem(STORAGE_KEYS.STREAK, { count: 0, lastDate: '' });
}

export function updateStreak(): void {
  const today = new Date().toISOString().split('T')[0];
  const streak = getStreak();
  
  if (streak.lastDate === today) {
    return; // Already logged today
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (streak.lastDate === yesterdayStr) {
    // Continue streak
    setItem(STORAGE_KEYS.STREAK, { count: streak.count + 1, lastDate: today });
  } else {
    // Reset streak
    setItem(STORAGE_KEYS.STREAK, { count: 1, lastDate: today });
  }
}

// Onboarding
export function isOnboardingComplete(): boolean {
  return getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE, false);
}

export function setOnboardingComplete(): void {
  setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
}


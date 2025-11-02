import type { DailyInsight } from './types';

const quotes = [
  {
    quote: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    quote: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    quote: "Your body can stand almost anything. It's your mind you have to convince.",
    author: "Unknown",
  },
  {
    quote: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt",
  },
  {
    quote: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    quote: "Don't wish for it, work for it.",
    author: "Unknown",
  },
  {
    quote: "The body achieves what the mind believes.",
    author: "Unknown",
  },
  {
    quote: "Strive for progress, not perfection.",
    author: "Unknown",
  },
  {
    quote: "You don't have to be extreme, just consistent.",
    author: "Unknown",
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
];

const tips = [
  "Drink a glass of water before each meal to help control portion sizes.",
  "Prepare healthy snacks in advance to avoid reaching for unhealthy options.",
  "Track your food intake honestly - even small bites add up!",
  "Get at least 7-8 hours of sleep - poor sleep can sabotage weight loss.",
  "Take a 10-minute walk after meals to aid digestion and boost metabolism.",
  "Use smaller plates to naturally reduce portion sizes.",
  "Plan your meals for the week to avoid last-minute unhealthy choices.",
  "Eat protein with every meal to stay fuller longer.",
  "Don't skip meals - it can lead to overeating later.",
  "Celebrate non-scale victories like increased energy and better fitting clothes.",
  "Practice mindful eating - put your fork down between bites.",
  "Keep a food journal to identify eating patterns and triggers.",
  "Add vegetables to every meal for fiber and nutrients.",
  "Limit liquid calories from sodas, juices, and fancy coffee drinks.",
  "Find a workout buddy for accountability and motivation.",
];

const focuses = [
  "Focus on adding more vegetables to your meals today.",
  "Today, pay attention to your hunger cues - eat when hungry, stop when satisfied.",
  "Make movement a priority - take the stairs, park farther away, stretch regularly.",
  "Practice gratitude for your body and what it can do.",
  "Today's goal: drink your full water target.",
  "Focus on quality sleep tonight - set a bedtime routine.",
  "Try a new healthy recipe or food today.",
  "Be mindful of emotional eating triggers today.",
  "Celebrate how far you've come on your journey.",
  "Focus on consistency over perfection today.",
  "Plan tomorrow's meals today for success.",
  "Take progress photos or measurements to track non-scale changes.",
  "Practice positive self-talk throughout the day.",
  "Focus on how exercise makes you feel, not just calories burned.",
  "Prep healthy snacks for the week ahead.",
];

export function getDailyInsight(): DailyInsight {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return {
    quote: quotes[dayOfYear % quotes.length].quote,
    author: quotes[dayOfYear % quotes.length].author,
    tip: tips[dayOfYear % tips.length],
    focus: focuses[dayOfYear % focuses.length],
  };
}

export function calculateBMR(
  weight: number, // in lbs
  height: number, // in inches
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  // Mifflin-St Jeor Equation (imperial units)
  // Convert lbs to kg and inches to cm for calculation
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;
  
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

export function calculateTDEE(
  bmr: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * multipliers[activityLevel]);
}

export function calculateDailyCalorieGoal(
  tdee: number,
  targetWeightLoss: number = 1 // lbs per week
): number {
  // 1 lb of fat = ~3500 calories
  const weeklyDeficit = targetWeightLoss * 3500;
  const dailyDeficit = weeklyDeficit / 7;
  return Math.round(tdee - dailyDeficit);
}

export function calculateWaterGoal(weight: number): number {
  // Water goal in liters: weight in lbs * 0.033
  // Returns in liters (converted from oz: weight/2 oz, then to liters)
  return Math.round((weight * 0.5 * 0.0295735) * 100) / 100;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  return dates;
}


/**
 * Exercise calorie calculation utilities
 * Based on MET (Metabolic Equivalent of Task) values
 */

// MET values for common exercises (calories per kg per hour)
// Source: Compendium of Physical Activities
const MET_VALUES: Record<string, { low: number; medium: number; high: number }> = {
  // Cardio
  walking: { low: 3.5, medium: 4.5, high: 5.5 },
  running: { low: 7.0, medium: 9.0, high: 12.0 },
  jogging: { low: 6.0, medium: 7.0, high: 8.0 },
  cycling: { low: 4.0, medium: 8.0, high: 12.0 },
  swimming: { low: 6.0, medium: 8.0, high: 11.0 },
  hiking: { low: 5.0, medium: 6.5, high: 8.0 },
  
  // Sports
  basketball: { low: 6.0, medium: 8.0, high: 10.0 },
  soccer: { low: 7.0, medium: 9.0, high: 11.0 },
  tennis: { low: 5.0, medium: 7.0, high: 9.0 },
  volleyball: { low: 4.0, medium: 6.0, high: 8.0 },
  golf: { low: 3.5, medium: 4.5, high: 5.5 },
  
  // Gym & Fitness
  'weight training': { low: 3.0, medium: 5.0, high: 6.0 },
  'strength training': { low: 3.0, medium: 5.0, high: 6.0 },
  yoga: { low: 2.5, medium: 3.0, high: 4.0 },
  pilates: { low: 3.0, medium: 4.0, high: 5.0 },
  aerobics: { low: 5.0, medium: 7.0, high: 9.0 },
  zumba: { low: 6.0, medium: 8.0, high: 10.0 },
  crossfit: { low: 8.0, medium: 10.0, high: 12.0 },
  hiit: { low: 8.0, medium: 10.0, high: 12.0 },
  
  // Dance
  dancing: { low: 4.5, medium: 6.0, high: 7.5 },
  'ballet': { low: 5.0, medium: 6.5, high: 8.0 },
  
  // Other
  rowing: { low: 4.0, medium: 7.0, high: 10.0 },
  'elliptical': { low: 5.0, medium: 7.0, high: 9.0 },
  'stair climbing': { low: 6.0, medium: 8.0, high: 10.0 },
  'jump rope': { low: 8.0, medium: 10.0, high: 12.0 },
  boxing: { low: 6.0, medium: 9.0, high: 12.0 },
  'martial arts': { low: 6.0, medium: 8.0, high: 10.0 },
};

// Default MET value for unknown activities
const DEFAULT_MET = { low: 3.0, medium: 5.0, high: 7.0 };

/**
 * Calculate calories burned for an exercise
 * Formula: Calories = MET × weight(kg) × duration(hours)
 * 
 * @param activity - Exercise activity name
 * @param duration - Duration in minutes
 * @param intensity - Exercise intensity (low, medium, high)
 * @param weightLbs - User's weight in pounds
 * @returns Estimated calories burned
 */
export function calculateExerciseCalories(
  activity: string,
  duration: number,
  intensity: 'low' | 'medium' | 'high',
  weightLbs: number
): number {
  // Convert weight from lbs to kg
  const weightKg = weightLbs * 0.453592;
  
  // Convert duration from minutes to hours
  const durationHours = duration / 60;
  
  // Find MET value for the activity (case-insensitive)
  const activityLower = activity.toLowerCase().trim();
  let met = DEFAULT_MET[intensity];
  
  // Try exact match first
  if (MET_VALUES[activityLower]) {
    met = MET_VALUES[activityLower][intensity];
  } else {
    // Try partial match (e.g., "running 5k" matches "running")
    for (const [key, value] of Object.entries(MET_VALUES)) {
      if (activityLower.includes(key) || key.includes(activityLower)) {
        met = value[intensity];
        break;
      }
    }
  }
  
  // Calculate calories burned
  const calories = met * weightKg * durationHours;
  
  return Math.round(calories);
}

/**
 * Get suggested activities for autocomplete
 */
export function getSuggestedActivities(): string[] {
  return Object.keys(MET_VALUES).map(key => 
    key.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  );
}


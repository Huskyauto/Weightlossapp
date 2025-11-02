import OpenAI from "openai";

// Grok API is OpenAI-compatible, so we use the OpenAI SDK with Grok's endpoint
const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY || "",
  baseURL: "https://api.x.ai/v1",
});

export interface UserProfile {
  name: string;
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  dailyCalories?: number;
}

export interface WeightEntry {
  weight: number;
  date: Date;
}

export interface MealEntry {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: string;
}

/**
 * Generate personalized daily insight based on user profile and progress
 */
export async function generateDailyInsight(
  profile: UserProfile,
  recentWeightEntries: WeightEntry[] = [],
  todaysMeals: MealEntry[] = []
): Promise<string> {
  const weightLost = recentWeightEntries.length > 0 
    ? profile.currentWeight - recentWeightEntries[recentWeightEntries.length - 1].weight 
    : 0;
  
  const totalCaloriesToday = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  
  const prompt = `You are a supportive weight loss coach. Generate a personalized daily insight for ${profile.name}.

Profile:
- Current weight: ${profile.currentWeight} lbs
- Target weight: ${profile.targetWeight} lbs
- Goal: Lose ${profile.currentWeight - profile.targetWeight} lbs
- Height: ${profile.height} inches
- Age: ${profile.age}
- Gender: ${profile.gender}
- Activity level: ${profile.activityLevel}
- Daily calorie budget: ${profile.dailyCalories || 'not set'}

Progress:
- Weight lost so far: ${weightLost.toFixed(1)} lbs
- Calories consumed today: ${totalCaloriesToday} / ${profile.dailyCalories || 0}
- Meals logged today: ${todaysMeals.length}

Generate a brief (2-3 sentences), encouraging, and actionable daily insight. Focus on:
1. Acknowledging their progress or current status
2. Providing one specific, actionable tip for today
3. Keeping a positive, motivational tone

Do not use markdown formatting. Return plain text only.`;

  try {
    const completion = await grok.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are an encouraging weight loss coach who provides brief, actionable, and positive daily insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content?.trim() || "Stay focused on your goals today! Every healthy choice counts.";
  } catch (error) {
    console.error("Error generating daily insight:", error);
    return "Stay focused on your goals today! Every healthy choice counts.";
  }
}

/**
 * Generate personalized motivational message
 */
export async function generateMotivation(profile: UserProfile, context?: string): Promise<string> {
  const prompt = `Generate a brief motivational message for ${profile.name} who is working to lose ${profile.currentWeight - profile.targetWeight} lbs.${context ? ` Context: ${context}` : ''} Keep it under 2 sentences, positive and encouraging.`;

  try {
    const completion = await grok.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are an encouraging weight loss coach."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    return completion.choices[0]?.message?.content?.trim() || "You've got this! Keep pushing forward.";
  } catch (error) {
    console.error("Error generating motivation:", error);
    return "You've got this! Keep pushing forward.";
  }
}

/**
 * Answer weight loss related questions
 */
export async function answerWeightLossQuestion(question: string, profile?: UserProfile): Promise<string> {
  const profileContext = profile 
    ? `User profile: ${profile.age} year old ${profile.gender}, ${profile.height} inches tall, current weight ${profile.currentWeight} lbs, target ${profile.targetWeight} lbs, ${profile.activityLevel} activity level.`
    : '';

  const prompt = `${profileContext}\n\nQuestion: ${question}\n\nProvide a helpful, evidence-based answer about weight loss. Keep it concise (3-4 sentences) and actionable.`;

  try {
    const completion = await grok.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable weight loss and nutrition expert. Provide evidence-based, safe, and practical advice. Always emphasize sustainable healthy habits over quick fixes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 250,
    });

    return completion.choices[0]?.message?.content?.trim() || "I recommend consulting with a healthcare professional for personalized advice.";
  } catch (error) {
    console.error("Error answering question:", error);
    return "I'm having trouble answering right now. Please try again or consult with a healthcare professional.";
  }
}

/**
 * Generate meal suggestions based on calorie budget and preferences
 */
export async function generateMealSuggestions(
  calorieTarget: number,
  mealType: string,
  dietaryPreferences: string[] = []
): Promise<string> {
  const preferencesText = dietaryPreferences.length > 0 
    ? `Dietary preferences: ${dietaryPreferences.join(', ')}.` 
    : '';

  const prompt = `Suggest 2-3 healthy ${mealType} options that fit within ${calorieTarget} calories. ${preferencesText} For each suggestion, include the meal name and approximate calories. Keep it brief and practical.`;

  try {
    const completion = await grok.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are a nutrition expert who suggests healthy, practical meal ideas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content?.trim() || "Consider a balanced meal with lean protein, vegetables, and whole grains.";
  } catch (error) {
    console.error("Error generating meal suggestions:", error);
    return "Consider a balanced meal with lean protein, vegetables, and whole grains.";
  }
}


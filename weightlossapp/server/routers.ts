import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  generateDailyInsight,
  generateMotivation,
  answerWeightLossQuestion,
  generateMealSuggestions,
  type UserProfile,
  type WeightEntry,
  type MealEntry,
} from "./ai";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  ai: router({
    getDailyInsight: publicProcedure
      .input(
        z.object({
          profile: z.object({
            name: z.string(),
            currentWeight: z.number(),
            targetWeight: z.number(),
            height: z.number(),
            age: z.number(),
            gender: z.string(),
            activityLevel: z.string(),
            dailyCalories: z.number().optional(),
          }),
          recentWeightEntries: z
            .array(
              z.object({
                weight: z.number(),
                date: z.date(),
              })
            )
            .optional(),
          todaysMeals: z
            .array(
              z.object({
                name: z.string(),
                calories: z.number(),
                protein: z.number(),
                carbs: z.number(),
                fats: z.number(),
                mealType: z.string(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const insight = await generateDailyInsight(
          input.profile,
          input.recentWeightEntries || [],
          input.todaysMeals || []
        );
        return { insight };
      }),

    getMotivation: publicProcedure
      .input(
        z.object({
          profile: z.object({
            name: z.string(),
            currentWeight: z.number(),
            targetWeight: z.number(),
            height: z.number(),
            age: z.number(),
            gender: z.string(),
            activityLevel: z.string(),
            dailyCalories: z.number().optional(),
          }),
          context: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const message = await generateMotivation(input.profile, input.context);
        return { message };
      }),

    askQuestion: publicProcedure
      .input(
        z.object({
          question: z.string(),
          profile: z
            .object({
              name: z.string(),
              currentWeight: z.number(),
              targetWeight: z.number(),
              height: z.number(),
              age: z.number(),
              gender: z.string(),
              activityLevel: z.string(),
              dailyCalories: z.number().optional(),
            })
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const answer = await answerWeightLossQuestion(input.question, input.profile);
        return { answer };
      }),

    getMealSuggestions: publicProcedure
      .input(
        z.object({
          calorieTarget: z.number(),
          mealType: z.string(),
          dietaryPreferences: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const suggestions = await generateMealSuggestions(
          input.calorieTarget,
          input.mealType,
          input.dietaryPreferences || []
        );
        return { suggestions };
      }),
  }),
});

export type AppRouter = typeof appRouter;

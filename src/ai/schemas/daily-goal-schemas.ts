/**
 * @fileOverview Zod schemas and TypeScript types for the daily goal generation flow.
 * 
 * - GenerateDailyGoalInput - The input type for the generateDailyGoal function.
 * - GenerateDailyGoalOutput - The return type for the generateDailyGoal function.
 * - GenerateDailyGoalInputSchema - The Zod schema for the input.
 * - GenerateDailyGoalOutputSchema - The Zod schema for the output.
 */

import {z} from 'genkit';

const MeasurementHistoryItemSchema = z.object({
  date: z.string(),
  height: z.number(),
  weight: z.number(),
  arm: z.number(),
  shoulder: z.number(),
  waist: z.number(),
  thigh: z.number(),
});

export const GenerateDailyGoalInputSchema = z.object({
  history: z.array(MeasurementHistoryItemSchema).describe("User's measurement history over the last few entries."),
});
export type GenerateDailyGoalInput = z.infer<typeof GenerateDailyGoalInputSchema>;


export const GenerateDailyGoalOutputSchema = z.object({
  mainFocus: z.string().describe("The main area to focus on for today's workout in a short, punchy sentence. Output in Korean."),
  habitSuggestion: z.string().describe("A small, actionable habit to incorporate today. e.g., '자기 전 5분 복근 운동 추가하기'. Output in Korean."),
  motivationalMessage: z.string().describe("A short, powerful motivational message for today based on the progress trend. Output in Korean."),
});
export type GenerateDailyGoalOutput = z.infer<typeof GenerateDailyGoalOutputSchema>;

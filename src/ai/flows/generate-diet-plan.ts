'use server';

/**
 * @fileOverview AI-powered diet plan generator for students.
 *
 * - generateDietPlan - A function that generates a personalized diet plan based on user input.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function.
 * - GenerateDietPlanOutput - The return type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDietPlanInputSchema = z.object({
  schedule: z
    .string()
    .describe('Typical daily schedule of the student, including school hours and extracurricular activities.'),
  foodPreferences: z
    .string()
    .describe('Dietary preferences, restrictions, and allergies of the student.'),
  targetCalories: z
    .number()
    .describe('The target daily caloric intake for the student.'),
  currentWeight: z.number().describe('The current weight of the student in kilograms.'),
  targetWeight: z.number().describe('The target weight of the student in kilograms.'),
  height: z.number().describe('The height of the student in centimeters.'),
  age: z.number().describe('The age of the student in years.'),
  gender: z.enum(['male', 'female']).describe('The gender of the student.'),
  exerciseLevel: z
    .enum(['sedentary', 'lightly active', 'moderately active', 'very active', 'extra active'])
    .describe('The exercise level of the student.'),
});

export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z
    .string()
    .describe('A detailed diet plan, including meal suggestions, timings, and recipes.'),
});

export type GenerateDietPlanOutput = z.infer<typeof GenerateDietPlanOutputSchema>;

export async function generateDietPlan(input: GenerateDietPlanInput): Promise<GenerateDietPlanOutput> {
  return generateDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDietPlanPrompt',
  input: {schema: GenerateDietPlanInputSchema},
  output: {schema: GenerateDietPlanOutputSchema},
  prompt: `You are a certified nutritionist specializing in creating diet plans for students.

  Based on the student's schedule, dietary preferences, target calories, current weight, target weight, height, age, gender and exercise level, create a personalized diet plan.

  Student Schedule: {{{schedule}}}
  Dietary Preferences/Restrictions: {{{foodPreferences}}}
  Target Calories: {{{targetCalories}}}
  Current Weight (kg): {{{currentWeight}}}
  Target Weight (kg): {{{targetWeight}}}
  Height (cm): {{{height}}}
  Age: {{{age}}}
  Gender: {{{gender}}}
  Exercise Level: {{{exerciseLevel}}}

  Create a diet plan that is easy to follow and takes into consideration the student's busy schedule and nutritional needs. Provide specific meal suggestions, timings, and optionally recipes. Do not include recipes unless explicitly asked for in the dietary preferences.
  The diet plan should be optimized to help the student reach their target weight in a healthy and sustainable manner.
  Output the diet plan in markdown format.
  `,
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: GenerateDietPlanInputSchema,
    outputSchema: GenerateDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

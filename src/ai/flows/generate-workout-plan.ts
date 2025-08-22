'use server';

/**
 * @fileOverview Workout plan generation flow.
 *
 * - generateWorkoutPlan - A function that generates a personalized workout plan.
 * - GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * - GenerateWorkoutPlanOutput - The return type for the generateWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkoutPlanInputSchema = z.object({
  fitnessLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The user fitness level.'),
  availableEquipment: z
    .array(z.enum(['dumbbells', 'bodyweight']))
    .describe('The available equipment for the workout.'),
  timeConstraints: z
    .number()
    .describe('The time constraints for the workout in minutes.'),
});

export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const GenerateWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('The generated workout plan.'),
});

export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are a personal trainer who creates workout plans based on user input.

      The user has the following fitness level: {{{fitnessLevel}}}
      The user has the following equipment available: {{#each availableEquipment}}{{{this}}} {{/each}}
      The user has the following time constraints in minutes: {{{timeConstraints}}}

      Create a workout plan that is tailored to the user's fitness level, available equipment, and time constraints.
      Be sure to include specific exercises, sets, and reps.

      Workout Plan:`,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

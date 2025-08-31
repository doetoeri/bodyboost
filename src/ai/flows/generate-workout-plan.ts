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
  workoutPlan: z.string().describe('The generated workout plan in Korean.'),
  motivationalMessage: z.string().describe('A short, powerful motivational message in Korean.'),
});

export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are a world-class personal trainer specializing in creating highly effective workout routines for teenage boys who want to build an aesthetic physique (wide shoulders, big arms, thick thighs, V-taper back) as quickly as possible using mostly bodyweight exercises. The user is a 9th-grade boy in Korea. All output must be in Korean.

The user has the following fitness level: {{{fitnessLevel}}}
The user has the following equipment available: {{#each availableEquipment}}{{{this}}} {{/each}}
The user wants to work out for {{{timeConstraints}}} minutes.

Create a daily workout plan that is intense, varied, and directly targets the "fashion muscles". The plan should be different every day to keep the muscles guessing and prevent plateaus.
Focus on compound movements but also include isolation exercises for arms and shoulders.
The output should be a clear, actionable list of exercises, sets, reps, and rest times. Use markdown for formatting.

Example for one exercise:
**푸시업**
- 3세트 x 15회 (세트 사이 60초 휴식)

Also, provide a short, powerful, and cool motivational message to inspire the user to crush their workout. Think like a top-tier coach.

Workout Plan (in markdown):
...

Motivational Message:
...
`,
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

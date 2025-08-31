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

const ExerciseSchema = z.object({
  name: z.string().describe('The Korean name of the exercise.'),
  part: z.string().describe('The main muscle group targeted, in Korean (e.g., 어깨, 가슴, 등, 하체, 팔).'),
  sets: z.number().describe('The number of sets.'),
  reps: z.string().describe('The number of reps per set. Can be a range (e.g., "10-12회") or until failure (e.g., "실패 지점까지").'),
  rest: z.number().describe('The rest time in seconds between sets.'),
  description: z.string().describe('A brief, cool, and motivating description of the exercise and tips in Korean.'),
});

const GenerateWorkoutPlanOutputSchema = z.object({
  title: z.string().describe('A cool and motivating title for today\'s workout routine in Korean.'),
  workoutPlan: z.array(ExerciseSchema).describe('The generated workout plan as a list of exercises.'),
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
  prompt: `You are a world-class personal trainer creating workout routines for a 9th-grade Korean boy aiming for an aesthetic physique (wide shoulders, big arms, thick thighs, V-taper back) with limited equipment. All output must be in Korean.

User Profile:
- Fitness Level: {{{fitnessLevel}}}
- Equipment: {{#each availableEquipment}}{{{this}}}{{/each}}
- Time: {{{timeConstraints}}} minutes

**Workout Logic:**
Create a single day's workout based on a weekly split routine appropriate for the user's fitness level. DO NOT create a full week plan, only one day's routine for 'today'. The routine should feel different and challenging each day.

- **Beginner (초급):** Use a 3-day full-body split (e.g., Routine A, B, C). Today's routine should be one of them. Focus on compound movements.
- **Intermediate (중급):** Use a 2-day Upper/Lower body split. Today's routine should be either Upper or Lower.
- **Advanced (고급):** Use a Push/Pull/Legs split. Today's routine should be one of them.

**Instructions:**
1.  **Create a Workout Title:** Give the routine a cool, motivating title.
2.  **Select Exercises:** Choose 4-6 exercises that fit today's split and target "fashion muscles." Prioritize compound movements but include isolation work for arms/shoulders.
3.  **Define Sets, Reps, Rest:** Prescribe specific sets, reps (can be a range like "10-12" or "failure"), and rest in seconds.
4.  **Write Descriptions:** For each exercise, add a short, impactful tip or a "cool" comment.
5.  **Motivational Message:** Provide a powerful, coach-like message to inspire the user.

**Output Format:**
Respond strictly in the JSON format defined by the output schema.
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

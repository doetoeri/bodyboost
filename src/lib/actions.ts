'use server'

import { generateWorkoutPlan, GenerateWorkoutPlanInput, GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan'
import { generateDietPlan, GenerateDietPlanInput, GenerateDietPlanOutput } from '@/ai/flows/generate-diet-plan'

type ActionResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
}

export async function getWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<ActionResult<GenerateWorkoutPlanOutput>> {
  try {
    const result = await generateWorkoutPlan(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to generate workout plan: ${errorMessage}` };
  }
}

export async function getDietPlan(input: GenerateDietPlanInput): Promise<ActionResult<GenerateDietPlanOutput>> {
  try {
    const result = await generateDietPlan(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to generate diet plan: ${errorMessage}` };
  }
}

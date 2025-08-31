'use server'

import { generateWorkoutPlan, GenerateWorkoutPlanInput, GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan'
import { analyzeBodyMeasurement, AnalyzeBodyMeasurementInput, AnalyzeBodyMeasurementOutput } from '@/ai/flows/analyze-body-measurement'

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
    return { success: false, error: `운동 계획 생성에 실패했습니다: ${errorMessage}` };
  }
}

export async function analyzeBodyMeasurement(input: AnalyzeBodyMeasurementInput): Promise<ActionResult<AnalyzeBodyMeasurementOutput>> {
  try {
    const result = await analyzeBodyMeasurement(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `신체 측정 분석에 실패했습니다: ${errorMessage}` };
  }
}

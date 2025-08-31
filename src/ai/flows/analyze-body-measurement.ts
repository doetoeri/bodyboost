'use server';

/**
 * @fileOverview A flow to analyze body measurements for a teenage boy.
 *
 * - analyzeBodyMeasurement - A function that provides analysis and recommendations.
 * - AnalyzeBodyMeasurementInput - The input type for the function.
 * - AnalyzeBodyMeasurementOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBodyMeasurementInputSchema = z.object({
  arm: z.number().describe('Arm circumference in cm.'),
  shoulder: z.number().describe('Shoulder circumference in cm.'),
  thigh: z.number().describe('Thigh circumference in cm.'),
});
export type AnalyzeBodyMeasurementInput = z.infer<typeof AnalyzeBodyMeasurementInputSchema>;

const AnalyzeBodyMeasurementOutputSchema = z.object({
  title: z.string().describe('A catchy title for the analysis in Korean.'),
  analysis: z
    .string()
    .describe('A detailed analysis of the provided body measurements, focusing on balance and strengths. Output in Korean.'),
  recommendation: z
    .string()
    .describe('Specific exercise recommendations to improve based on the analysis. Output in Korean.'),
});
export type AnalyzeBodyMeasurementOutput = z.infer<typeof AnalyzeBodyMeasurementOutputSchema>;

export async function analyzeBodyMeasurement(input: AnalyzeBodyMeasurementInput): Promise<AnalyzeBodyMeasurementOutput> {
  return analyzeBodyMeasurementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBodyMeasurementPrompt',
  input: {schema: AnalyzeBodyMeasurementInputSchema},
  output: {schema: AnalyzeBodyMeasurementOutputSchema},
  prompt: `You are an expert fitness coach for teenagers. A 9th-grade boy from Korea has provided his body measurements. Your task is to analyze them and provide constructive, motivating feedback. All output must be in Korean.

User's Measurements:
- Arm: {{{arm}}} cm
- Shoulder: {{{shoulder}}} cm
- Thigh: {{{thigh}}} cm

Based on these measurements, provide:
1.  **Analysis:** Briefly analyze the current physique. Point out the strengths (e.g., "Your shoulder measurement is great, which is a key to a V-taper look!") and areas for improvement in a positive and encouraging way. Talk about the balance between upper and lower body.
2.  **Recommendation:** Suggest 1-2 key exercise types to focus on to achieve his goal of "fashion muscles" (wide shoulders, big arms, V-taper). For example, if his arms are lagging behind his shoulders, recommend more bicep/tricep isolation work.

Keep the tone cool, motivating, and like a personal coach, not a robot.
`,
});

const analyzeBodyMeasurementFlow = ai.defineFlow(
  {
    name: 'analyzeBodyMeasurementFlow',
    inputSchema: AnalyzeBodyMeasurementInputSchema,
    outputSchema: AnalyzeBodyMeasurementOutputSchema,
  },
  async input => {
    // Clear example data if it's sent
    if (input.arm === 0 && input.shoulder === 0 && input.thigh === 0) {
      return {
        title: "데이터를 입력해주세요!",
        analysis: "AI가 당신의 신체를 분석하고 맞춤 피드백을 드립니다. 오늘의 신체 치수를 입력하고 '분석 요청하기' 버튼을 눌러주세요.",
        recommendation: "팔, 어깨, 허벅지 둘레를 측정해서 입력해보세요. 꾸준한 기록은 성장의 가장 중요한 증거입니다."
      };
    }
    const {output} = await prompt(input);
    return output!;
  }
);

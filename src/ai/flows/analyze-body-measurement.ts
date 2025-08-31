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
  height: z.number().describe('Height in cm.'),
  weight: z.number().describe('Weight in kg.'),
  arm: z.number().describe('Arm circumference in cm.'),
  shoulder: z.number().describe('Shoulder circumference in cm.'),
  waist: z.number().describe('Waist circumference in cm.'),
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
  heightGrowthTip: z
    .string()
    .describe('Tips and simple exercises for height growth, suitable for a teenager. Output in Korean.'),
});
export type AnalyzeBodyMeasurementOutput = z.infer<typeof AnalyzeBodyMeasurementOutputSchema>;

export async function analyzeBodyMeasurement(input: AnalyzeBodyMeasurementInput): Promise<AnalyzeBodyMeasurementOutput> {
  return analyzeBodyMeasurementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBodyMeasurementPrompt',
  input: {schema: AnalyzeBodyMeasurementInputSchema},
  output: {schema: AnalyzeBodyMeasurementOutputSchema},
  prompt: `You are an expert fitness coach and growth specialist for teenagers. A 9th-grade boy from Korea has provided his body measurements. Your task is to analyze them and provide constructive, motivating feedback. All output must be in Korean.

User's Measurements:
- Height: {{{height}}} cm
- Weight: {{{weight}}} kg
- Arm: {{{arm}}} cm
- Shoulder: {{{shoulder}}} cm
- Waist: {{{waist}}} cm
- Thigh: {{{thigh}}} cm

Based on these measurements, provide:
1.  **Analysis:** Analyze the current physique in detail. Consider the user's height and weight for context. Discuss strengths (e.g., "Your shoulder-to-waist ratio is a great starting point for a V-taper look!") and areas for improvement in a positive way. Talk about the balance between upper/lower body and muscularity vs. frame.
2.  **Recommendation:** Suggest 1-2 key exercise types to focus on for his "fashion muscles" goal (wide shoulders, big arms, V-taper). Make them specific to his measurements. For example, if his waist is thick relative to his shoulders, recommend more back-widening exercises like pull-ups.
3.  **Height Growth Tip:** As he is in a critical growth period, provide a practical tip for height growth. This should include one simple stretching exercise (e.g., 'Cobra Stretch' or 'Cat-Cow Stretch' to decompress the spine) and one lifestyle tip (e.g., importance of 8-10 hours of sleep, avoiding foods that hinder growth). Keep it concise and easy to follow.

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
        title: "AI가 당신의 몸을 분석해드려요!",
        analysis: "키, 몸무게, 팔, 어깨, 허리, 허벅지 둘레를 정확히 측정하고 '분석 요청하기' 버튼을 눌러주세요. 당신의 노력을 멋진 결과로 바꿔드릴게요.",
        recommendation: "AI가 당신의 신체 균형을 파악하고, 어떤 운동에 집중해야 '패션 근육'을 더 효과적으로 만들 수 있는지 알려드립니다.",
        heightGrowthTip: "성장기, 정말 중요하죠! AI가 숨겨진 1cm를 찾을 수 있는 키 성장 꿀팁도 함께 알려드릴게요."
      };
    }
    const {output} = await prompt(input);
    return output!;
  }
);

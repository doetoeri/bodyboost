
'use server';

/**
 * @fileOverview Generates a daily goal based on user's progress history.
 * 
 * - generateDailyGoal - A function that generates a personalized daily goal.
 * - GenerateDailyGoalInput - The input type for the generateDailyGoal function.
 * - GenerateDailyGoalOutput - The return type for the generateDailyGoal function.
 */

import {ai} from '@/ai/genkit';
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


export async function generateDailyGoal(input: GenerateDailyGoalInput): Promise<GenerateDailyGoalOutput> {
  return generateDailyGoalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyGoalPrompt',
  input: {schema: GenerateDailyGoalInputSchema},
  output: {schema: GenerateDailyGoalOutputSchema},
  prompt: `You are a personal fitness coach for a 9th-grade Korean boy. Analyze his recent body measurement history to set a specific, motivating goal for today. All output must be in Korean.

User's Measurement History:
{{#each history}}
- {{date}}: 키 {{height}}cm, 몸무게 {{weight}}kg, 팔 {{arm}}cm, 어깨 {{shoulder}}cm, 허리 {{waist}}cm, 허벅지 {{thigh}}cm
{{/each}}

Analysis Task:
1.  **Review Progress Trend:** Look at the changes over the last few entries. Is there good progress in a specific area (e.g., shoulder circumference)? Is another area plateauing (e.g., arm size hasn't changed)? Is the weight going up consistently with muscle gain?
2.  **Set Today's Goal:** Based on the trend, create a goal for today.
    -   **mainFocus:** If a measurement is lagging, make that the focus. For example, if shoulder growth is slowing, suggest focusing on shoulder exercises. If weight is increasing but waist is also getting bigger, suggest focusing on clean eating.
    -   **habitSuggestion:** Suggest one small, easy-to-do action for today. It could be a 5-minute core workout, a specific stretch, or a simple dietary choice like drinking more water.
    -   **motivationalMessage:** Write a short, cool, and encouraging message that acknowledges their progress or pushes them through a plateau. Connect it to their history. For example, "어깨 둘레가 벌써 2cm 늘었어! 이 기세로 오늘도 어깨 부수자!"

Keep the tone encouraging, like a real coach who knows their client's journey.
`,
});


const generateDailyGoalFlow = ai.defineFlow(
  {
    name: 'generateDailyGoalFlow',
    inputSchema: GenerateDailyGoalInputSchema,
    outputSchema: GenerateDailyGoalOutputSchema,
  },
  async input => {
    // If history is empty or has only one record, return a generic motivational message.
    if (input.history.length < 2) {
      return {
        mainFocus: "꾸준함이 최고의 무기!",
        habitSuggestion: "오늘 운동 기록하고, 내일의 변화를 만들어보세요.",
        motivationalMessage: "위대한 여정의 첫걸음을 뗀 것을 환영해요! 첫 기록부터 시작해봐요."
      };
    }
    
    const {output} = await prompt(input);
    return output!;
  }
);

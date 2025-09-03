import { WorkoutPlanForm } from "@/components/workout-plan-form";

export default function WorkoutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-2 mb-6">
        <h1 className="text-4xl font-bold tracking-tight">AI 운동 생성기</h1>
        <p className="text-muted-foreground">
          당신의 목표와 컨디션에 맞춰 AI가 매일 새로운 운동 계획을 짜드립니다. 똑똑하게 운동하고 빠르게 성장하세요!
        </p>
      </div>
      <WorkoutPlanForm />
    </div>
  );
}

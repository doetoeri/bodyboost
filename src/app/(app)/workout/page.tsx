import { WorkoutPlanForm } from "@/components/workout-plan-form";

export default function WorkoutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-1.5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Workout Generator</h1>
        <p className="text-muted-foreground">
          Tell us your goals and preferences, and our AI will create a personalized workout plan for you.
        </p>
      </div>
      <WorkoutPlanForm />
    </div>
  );
}

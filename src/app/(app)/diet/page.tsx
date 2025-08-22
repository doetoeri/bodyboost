import { DietPlanForm } from "@/components/diet-plan-form";

export default function DietPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-1.5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Diet Planner</h1>
        <p className="text-muted-foreground">
          Fill in your details to get a customized diet plan that fits your student lifestyle.
        </p>
      </div>
      <DietPlanForm />
    </div>
  );
}

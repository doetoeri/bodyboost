"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getWorkoutPlan } from "@/lib/actions"

const formSchema = z.object({
  fitnessLevel: z
    .enum(['beginner', 'intermediate', 'advanced'], {
      required_error: "Please select your fitness level.",
    }),
  availableEquipment: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  timeConstraints: z
    .number().min(10, "Must be at least 10 minutes").max(120, "Must be 120 minutes or less"),
});

type FormValues = z.infer<typeof formSchema>

const equipmentItems = [
  { id: "dumbbells", label: "Dumbbells" },
  { id: "bodyweight", label: "Bodyweight" },
]

export function WorkoutPlanForm() {
  const [workoutPlan, setWorkoutPlan] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessLevel: "beginner",
      availableEquipment: ["bodyweight"],
      timeConstraints: 30,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setWorkoutPlan(null)
    const result = await getWorkoutPlan({
      ...values,
      availableEquipment: values.availableEquipment as ("dumbbells" | "bodyweight")[],
    })
    setIsLoading(false)

    if (result.success && result.data?.workoutPlan) {
      setWorkoutPlan(result.data.workoutPlan)
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to generate workout plan. Please try again.",
      })
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fitnessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your fitness level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps in tailoring the intensity of the workout.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableEquipment"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Available Equipment</FormLabel>
                      <FormDescription>
                        Select the equipment you have access to.
                      </FormDescription>
                    </div>
                    {equipmentItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="availableEquipment"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeConstraints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time per Session (minutes)</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Slider
                            min={10}
                            max={120}
                            step={5}
                            defaultValue={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <div className="font-semibold w-12 text-center">{field.value}</div>
                    </div>
                     <FormDescription>
                      How long do you want each workout session to be?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  "Generate Workout Plan"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {workoutPlan && (
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-xl font-semibold">Your Personalized Workout Plan</h3>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                {workoutPlan}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

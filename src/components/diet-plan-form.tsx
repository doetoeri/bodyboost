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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getDietPlan } from "@/lib/actions"

const formSchema = z.object({
  schedule: z.string().min(10, "Please describe your daily schedule."),
  foodPreferences: z.string().min(10, "Please describe your food preferences."),
  targetCalories: z.coerce.number().min(1000).max(5000),
  currentWeight: z.coerce.number().min(30),
  targetWeight: z.coerce.number().min(30),
  height: z.coerce.number().min(100),
  age: z.coerce.number().min(13).max(19),
  gender: z.enum(['male', 'female']),
  exerciseLevel: z.enum(['sedentary', 'lightly active', 'moderately active', 'very active', 'extra active']),
})

type FormValues = z.infer<typeof formSchema>

export function DietPlanForm() {
  const [dietPlan, setDietPlan] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schedule: "School from 8 AM to 4 PM, study from 5 PM to 7 PM, sports practice 7 PM to 8 PM.",
      foodPreferences: "I like chicken and rice, but I am allergic to peanuts.",
      targetCalories: 2200,
      currentWeight: 65,
      targetWeight: 70,
      height: 175,
      age: 16,
      gender: "male",
      exerciseLevel: "moderately active",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setDietPlan(null)
    const result = await getDietPlan(values)
    setIsLoading(false)

    if (result.success && result.data?.dietPlan) {
      setDietPlan(result.data.dietPlan)
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to generate diet plan. Please try again.",
      })
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="age" render={({ field }) => (
                        <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem><FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="height" render={({ field }) => (
                        <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="currentWeight" render={({ field }) => (
                        <FormItem><FormLabel>Current Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="targetWeight" render={({ field }) => (
                        <FormItem><FormLabel>Target Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="targetCalories" render={({ field }) => (
                        <FormItem><FormLabel>Target Daily Calories</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="exerciseLevel" render={({ field }) => (
                    <FormItem><FormLabel>Exercise Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                            <SelectItem value="lightly active">Lightly active (light exercise/sports 1-3 days/week)</SelectItem>
                            <SelectItem value="moderately active">Moderately active (moderate exercise/sports 3-5 days/week)</SelectItem>
                            <SelectItem value="very active">Very active (hard exercise/sports 6-7 days a week)</SelectItem>
                            <SelectItem value="extra active">Extra active (very hard exercise/sports & physical job)</SelectItem>
                        </SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
              <FormField control={form.control} name="schedule" render={({ field }) => (
                <FormItem><FormLabel>Daily Schedule</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormDescription>Describe your typical day (school, study, activities).</FormDescription><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="foodPreferences" render={({ field }) => (
                <FormItem><FormLabel>Food Preferences & Restrictions</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormDescription>List foods you like, dislike, and any allergies.</FormDescription><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  "Generate Diet Plan"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {dietPlan && (
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-xl font-semibold">Your Personalized Diet Plan</h3>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans" dangerouslySetInnerHTML={{ __html: dietPlan.replace(/\n/g, '<br />') }}>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

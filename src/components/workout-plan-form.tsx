"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Sparkles, Target, Weight, Repeat, Clock } from "lucide-react"

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { generateWorkoutPlan } from "@/ai/flows/generate-workout-plan"
import type { GenerateWorkoutPlanOutput } from "@/ai/flows/generate-workout-plan"

const formSchema = z.object({
  fitnessLevel: z
    .enum(['beginner', 'intermediate', 'advanced'], {
      required_error: "운동 수준을 선택해주세요.",
    }),
  availableEquipment: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "최소 하나 이상의 장비를 선택해야 합니다.",
  }),
  timeConstraints: z
    .number().min(10, "최소 10분 이상이어야 합니다.").max(120, "최대 120분까지 가능합니다."),
});

type FormValues = z.infer<typeof formSchema>

const equipmentItems = [
  { id: "dumbbells", label: "덤벨" },
  { id: "bodyweight", label: "맨몸" },
]

export function WorkoutPlanForm() {
  const [result, setResult] = React.useState<GenerateWorkoutPlanOutput | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fitnessLevel: "beginner",
      availableEquipment: ["bodyweight"],
      timeConstraints: 45,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setResult(null)
    try {
        const actionResult = await generateWorkoutPlan({
          ...values,
          availableEquipment: values.availableEquipment as ("dumbbells" | "bodyweight")[],
        })
        setResult(actionResult)
    } catch(error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: `운동 계획 생성에 실패했습니다: ${errorMessage}`,
      })
    } finally {
        setIsLoading(false)
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
                    <FormLabel>운동 수준</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="자신의 운동 수준을 선택하세요." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">초급</SelectItem>
                        <SelectItem value="intermediate">중급</SelectItem>
                        <SelectItem value="advanced">고급</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      AI가 운동 강도를 조절하는 데 사용합니다.
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
                      <FormLabel>사용 가능 장비</FormLabel>
                      <FormDescription>
                        사용할 수 있는 운동 장비를 선택하세요.
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
                    <FormLabel>운동 시간 (분)</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Slider
                            min={10}
                            max={120}
                            step={5}
                            defaultValue={[field.value]}
                            onValue-change={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <div className="font-semibold w-16 text-center text-primary">{field.value} 분</div>
                    </div>
                     <FormDescription>
                      한 번 운동할 때 얼마나 할 수 있나요?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 생성 중...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> AI 운동 계획 생성</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && !result && (
        <Card className="mt-8 shadow-lg border-primary/30 flex items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </Card>
      )}

      {result && (
        <Card className="mt-8 shadow-lg border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">{result.title}</CardTitle>
            <CardDescription>AI가 생성한 당신만을 위한 오늘의 운동 루틴입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-secondary/50 border border-secondary">
               <h4 className="font-semibold mb-2 text-primary">오늘의 동기부여 메시지</h4>
               <p className="font-semibold italic text-foreground/90">"{result.motivationalMessage}"</p>
            </div>
            
            <div className="space-y-4">
              {result.workoutPlan.map((exercise, index) => (
                <Card key={index} className="bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center justify-between">
                      {exercise.name}
                      <Badge variant="secondary">{exercise.part}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-muted-foreground">{exercise.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="bg-secondary/30 p-2 rounded-md">
                          <p className="font-bold text-primary">{exercise.sets} 세트</p>
                           <p className="text-xs text-muted-foreground">Sets</p>
                        </div>
                        <div className="bg-secondary/30 p-2 rounded-md">
                           <p className="font-bold text-primary">{exercise.reps}</p>
                           <p className="text-xs text-muted-foreground">Reps</p>
                        </div>
                        <div className="bg-secondary/30 p-2 rounded-md">
                           <p className="font-bold text-primary">{exercise.rest}초</p>
                           <p className="text-xs text-muted-foreground">Rest</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

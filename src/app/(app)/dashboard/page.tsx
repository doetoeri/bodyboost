"use client"

import * as React from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, LineChart, Target, Loader2 } from "lucide-react"
import { generateWorkoutPlan } from "@/ai/flows/generate-workout-plan"
import type { GenerateWorkoutPlanOutput } from "@/ai/flows/generate-workout-plan"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [workout, setWorkout] = React.useState<GenerateWorkoutPlanOutput | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const { toast } = useToast()

  React.useEffect(() => {
    async function getInitialWorkout() {
      setIsLoading(true)
      try {
        const result = await generateWorkoutPlan({
          fitnessLevel: "beginner",
          availableEquipment: ["bodyweight"],
          timeConstraints: 45,
        })
        setWorkout(result)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "오류 발생",
          description: "오늘의 운동을 불러오는 데 실패했습니다.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    getInitialWorkout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          오늘도 목표를 향해! AI가 추천하는 맞춤 운동으로 몸을 만들어보세요.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>오늘의 운동</CardTitle>
            <CardDescription>
              AI가 당신의 목표에 맞춰 생성한 오늘의 추천 운동입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : workout ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Dumbbell className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{workout.title}</h3>
                    <p className="text-sm text-muted-foreground">45분 - 맨몸 운동</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {workout.workoutPlan.map(ex => ex.name).join(', ')} 등으로 구성된 효과적인 운동입니다.
                </p>
              </div>
            ) : (
               <p className="text-muted-foreground">운동 계획을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full" disabled={isLoading || !workout}>
              <Link href="/workout">운동 시작하기</Link>
            </Button>
          </CardFooter>
        </Card>
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/20 to-background">
             <CardHeader>
              <CardTitle>동기부여 한마디</CardTitle>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : workout ? (
                <blockquote className="text-xl font-semibold leading-snug">
                  "{workout.motivationalMessage}"
                </blockquote>
              ) : (
                <p className="text-sm text-muted-foreground">...</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                신체 변화 기록
              </CardTitle>
              <LineChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">측정할 시간이에요!</p>
              <p className="text-xs text-muted-foreground">눈바디보다 정확한 줄자! 꾸준히 기록하고 변화를 확인하세요.</p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="secondary" className="w-full">
                <Link href="/progress">기록하러 가기</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>핵심 기능 둘러보기</CardTitle>
          <CardDescription>
            AI와 함께 똑똑하게 몸을 키워보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Link href="/workout" className="group rounded-lg border-2 border-primary/50 bg-primary/10 p-4 transition-all hover:bg-primary/20 hover:border-primary">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary">AI 운동 생성</h3>
                  <p className="text-sm text-muted-foreground">매일 새로운 운동으로 자극을 주세요.</p>
                </div>
                <Dumbbell className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
              </div>
          </Link>
          <Link href="/progress" className="group rounded-lg border p-4 transition-colors hover:bg-secondary">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">성장 과정 추적</h3>
                  <p className="text-sm text-muted-foreground">신체 치수와 운동 기록을 관리하세요.</p>
                </div>
                <Target className="h-6 w-6 text-muted-foreground transition-transform group-hover:scale-110" />
              </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

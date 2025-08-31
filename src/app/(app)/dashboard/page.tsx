"use client"

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
import { Dumbbell, LineChart, Target } from "lucide-react"

export default function DashboardPage() {
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
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Dumbbell className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">역삼각형 상체 집중 프로그램</h3>
                  <p className="text-sm text-muted-foreground">45분 - 맨몸 운동</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                어깨는 넓게, 등은 역삼각형으로! 오늘은 상체를 폭발시키는 날입니다. 맨몸으로 할 수 있는 최고의 운동들로 구성했어요. 한계에 도전해보세요!
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full">
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
              <blockquote className="text-xl font-semibold leading-snug">
                "변화는 가장 불편한 곳에서 시작된다. 오늘 흘린 땀이 내일의 근육이 된다!"
              </blockquote>
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

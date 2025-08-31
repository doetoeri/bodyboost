"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, TrendingUp, Trophy, Sparkles } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { analyzeBodyMeasurement } from "@/ai/flows/analyze-body-measurement"
import type { AnalyzeBodyMeasurementOutput } from "@/ai/flows/analyze-body-measurement"


const measurementData = [
  { date: "06-01", arm: 30, shoulder: 110, thigh: 50 },
  { date: "06-08", arm: 30.5, shoulder: 111, thigh: 50.5 },
  { date: "06-15", arm: 31, shoulder: 112, thigh: 51 },
  { date: "06-22", arm: 31.2, shoulder: 112.5, thigh: 51.5 },
  { date: "06-29", arm: 32, shoulder: 114, thigh: 52 },
]

const chartConfig = {
  arm: { label: "팔 둘레 (cm)", color: "hsl(var(--chart-1))" },
  shoulder: { label: "어깨 둘레 (cm)", color: "hsl(var(--chart-2))" },
  thigh: { label: "허벅지 둘레 (cm)", color: "hsl(var(--chart-3))" },
}

const workoutLog = [
  { date: "2024-06-29", workout: "역삼각형 상체 집중", duration: "45분", status: "완료" },
  { date: "2024-06-28", workout: "꿀벅지 하체 조지기", duration: "50분", status: "완료" },
  { date: "2024-06-27", workout: "어깨 깡패 데이", duration: "40분", status: "완료" },
  { date: "2024-06-25", workout: "전신 근력 폭발", duration: "60분", status: "건너뜀" },
  { date: "2024-06-24", workout: "팔뚝 강화", duration: "30분", status: "완료" },
]

const formSchema = z.object({
  arm: z.coerce.number().min(10, "정확한 팔 둘레를 입력해주세요.").max(100),
  shoulder: z.coerce.number().min(50, "정확한 어깨 둘레를 입력해주세요.").max(200),
  thigh: z.coerce.number().min(30, "정확한 허벅지 둘레를 입력해주세요.").max(100),
})

type FormValues = z.infer<typeof formSchema>

export default function ProgressPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [analysis, setAnalysis] = React.useState<AnalyzeBodyMeasurementOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { arm: 0, shoulder: 0, thigh: 0 },
  })
  
  React.useEffect(() => {
    async function getInitialAnalysis() {
        setIsLoading(true);
        try {
            const result = await analyzeBodyMeasurement({ arm: 0, shoulder: 0, thigh: 0 });
            setAnalysis(result);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "오류 발생",
                description: "초기 데이터를 불러오는 데 실패했습니다.",
            });
        } finally {
            setIsLoading(false);
        }
    }
    getInitialAnalysis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setAnalysis(null)
    try {
      const result = await analyzeBodyMeasurement(values)
      setAnalysis(result)
      toast({
        title: "AI 분석 완료!",
        description: "신체 변화에 대한 AI 분석 결과를 확인해보세요.",
      })
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
       toast({
        variant: "destructive",
        title: "오류 발생",
        description: `AI 분석에 실패했습니다: ${errorMessage}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">진행 상황</h1>
        <p className="text-muted-foreground">
          당신의 노력을 숫자로 확인해보세요. 꾸준함이 최고의 무기입니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>신체 둘레 변화</CardTitle>
          <CardDescription>
            지난 몇 주간의 신체 둘레 변화 그래프입니다. 성장을 눈으로 확인하세요!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <LineChart accessibilityLayer data={measurementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line dataKey="arm" type="monotone" stroke="var(--color-arm)" strokeWidth={3} dot={true} name="팔" />
              <Line dataKey="shoulder" type="monotone" stroke="var(--color-shoulder)" strokeWidth={3} dot={true} name="어깨" />
              <Line dataKey="thigh" type="monotone" stroke="var(--color-thigh)" strokeWidth={3} dot={true} name="허벅지" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-6 w-6" />
              <CardTitle>AI 신체 분석</CardTitle>
            </div>
            <CardDescription>현재 신체 치수를 입력하고 AI의 맞춤 분석을 받아보세요.</CardDescription>
          </CardHeader>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                  <FormField control={form.control} name="arm" render={({ field }) => (
                      <FormItem><FormLabel>팔 둘레 (cm)</FormLabel><FormControl><Input type="number" {...field} placeholder="예: 32" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="shoulder" render={({ field }) => (
                      <FormItem><FormLabel>어깨 둘레 (cm)</FormLabel><FormControl><Input type="number" {...field} placeholder="예: 115" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="thigh" render={({ field }) => (
                      <FormItem><FormLabel>허벅지 둘레 (cm)</FormLabel><FormControl><Input type="number" {...field} placeholder="예: 55" /></FormControl><FormMessage /></FormItem>
                  )} />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 분석 중...</>) : "분석 요청하기"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {isLoading && !analysis && (
            <Card className="bg-secondary flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
        )}
        
        {analysis && (
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle>{analysis.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-primary">AI 분석</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{analysis.analysis}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary">AI 추천</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{analysis.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>


      <Card>
        <CardHeader>
          <CardTitle>최근 운동 기록</CardTitle>
          <CardDescription>최근에 완료한 운동 기록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead>운동 종류</TableHead>
                <TableHead>시간</TableHead>
                <TableHead className="text-right">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workoutLog.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{log.date}</TableCell>
                  <TableCell>{log.workout}</TableCell>
                  <TableCell>{log.duration}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={log.status === '완료' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
       <Card className="bg-gradient-to-r from-blue-500/20 via-green-500/10 to-background border-green-500/30">
        <CardHeader className="flex-row items-center gap-4">
          <Trophy className="w-10 h-10 text-green-400" />
          <div>
            <CardTitle>진행도 뱃지</CardTitle>
            <CardDescription>꾸준함의 증표! 획득한 뱃지를 확인해보세요.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Badge className="text-lg p-2 bg-green-500/20 text-green-300 border-green-500/30">🔥 첫 운동 완료</Badge>
          <Badge className="text-lg p-2 bg-blue-500/20 text-blue-300 border-blue-500/30">💪 5일 연속 달성</Badge>
           <Badge className="text-lg p-2 bg-secondary/50 text-muted-foreground border-border">🚀 10회 운동 달성</Badge>
        </CardContent>
      </Card>
    </div>
  )
}

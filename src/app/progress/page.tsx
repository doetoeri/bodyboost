"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Trophy, Sparkles, User, Ruler, Weight, Waves } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
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
import { analyzeBodyMeasurement } from "@/lib/actions"
import type { AnalyzeBodyMeasurementOutput } from "@/ai/flows/analyze-body-measurement"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { analyzeBodyMeasurement as analyzeBodyMeasurementFlow } from "@/ai/flows/analyze-body-measurement"


export type Measurement = {
  date: string;
  arm: number;
  shoulder: number;
  thigh: number;
  height: number;
  weight: number;
  waist: number;
};

const chartConfigCircumference = {
  arm: { label: "팔 둘레 (cm)", color: "hsl(var(--chart-1))" },
  shoulder: { label: "어깨 둘레 (cm)", color: "hsl(var(--chart-2))" },
  thigh: { label: "허벅지 둘레 (cm)", color: "hsl(var(--chart-3))" },
}

const chartConfigWeight = {
  weight: { label: "몸무게 (kg)", color: "hsl(var(--chart-4))" },
}

const formSchema = z.object({
  height: z.coerce.number().min(100, "정확한 키를 입력해주세요.").max(250),
  weight: z.coerce.number().min(30, "정확한 몸무게를 입력해주세요.").max(200),
  arm: z.coerce.number().min(10, "정확한 팔 둘레를 입력해주세요.").max(100),
  shoulder: z.coerce.number().min(50, "정확한 어깨 둘레를 입력해주세요.").max(200),
  waist: z.coerce.number().min(50, "정확한 허리 둘레를 입력해주세요.").max(150),
  thigh: z.coerce.number().min(30, "정확한 허벅지 둘레를 입력해주세요.").max(100),
})

type FormValues = z.infer<typeof formSchema>

export default function ProgressPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [analysis, setAnalysis] = React.useState<AnalyzeBodyMeasurementOutput | null>(null)
  const [measurementData, setMeasurementData] = useLocalStorage<Measurement[]>("measurementData", []);
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { height: 0, weight: 0, arm: 0, shoulder: 0, waist: 0, thigh: 0 },
  })
  
  React.useEffect(() => {
    async function getInitialAnalysis() {
        if (measurementData.length > 0) return; // Don't fetch if there's data
        setIsLoading(true);
        try {
            const result = await analyzeBodyMeasurementFlow({ height: 0, weight: 0, arm: 0, shoulder: 0, waist: 0, thigh: 0 });
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

  React.useEffect(() => {
    // Set default form values from the latest measurement data
    if (measurementData.length > 0) {
      const latestData = measurementData[measurementData.length - 1];
      form.reset(latestData);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementData]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setAnalysis(null)
    const result = await analyzeBodyMeasurement(values)
    setIsLoading(false)

    if (result.success) {
      setAnalysis(result.data)
      const newMeasurement: Measurement = {
        date: new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace(/\./g, ' ').replace(/ /g, '.').slice(0, -1),
        ...values
      };
      setMeasurementData([...measurementData, newMeasurement]);
      toast({
        title: "AI 분석 완료!",
        description: "신체 변화에 대한 AI 분석 결과를 확인해보세요.",
      })
    } else {
       toast({
        variant: "destructive",
        title: "오류 발생",
        description: result.error,
      })
    }
  }

  const isInitialLoading = isLoading && !analysis && measurementData.length === 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">진행 상황</h1>
        <p className="text-muted-foreground">
          당신의 노력을 숫자로 확인해보세요. 꾸준함이 최고의 무기입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>신체 둘레 변화</CardTitle>
            <CardDescription>
              팔, 어깨, 허벅지 둘레 변화 그래프입니다. 성장을 눈으로 확인하세요!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {measurementData.length > 0 ? (
              <ChartContainer config={chartConfigCircumference} className="h-64 w-full">
                <LineChart accessibilityLayer data={measurementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 5', 'dataMax + 5']} hide/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line dataKey="arm" type="monotone" stroke="var(--color-arm)" strokeWidth={3} dot={true} name="팔" />
                  <Line dataKey="shoulder" type="monotone" stroke="var(--color-shoulder)" strokeWidth={3} dot={true} name="어깨" />
                  <Line dataKey="thigh" type="monotone" stroke="var(--color-thigh)" strokeWidth={3} dot={true} name="허벅지" />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-secondary/20">
                <p className="text-muted-foreground">데이터를 추가하여 성장을 추적하세요.</p>
              </div>
            )}
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>몸무게 변화</CardTitle>
            <CardDescription>
              체중 변화 그래프입니다. 근육량 증가를 확인해보세요!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {measurementData.length > 0 ? (
              <ChartContainer config={chartConfigWeight} className="h-64 w-full">
                <LineChart accessibilityLayer data={measurementData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 5', 'dataMax + 5']} hide/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line dataKey="weight" type="monotone" stroke="var(--color-weight)" strokeWidth={3} dot={true} name="몸무게" />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-secondary/20">
                <p className="text-muted-foreground">데이터를 추가하여 성장을 추적하세요.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="height" render={({ field }) => (
                        <FormItem><FormLabel className="flex items-center gap-1"><Ruler className="w-4 h-4"/>키 (cm)</FormLabel><FormControl><Input type="number" {...field} placeholder="예: 175" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="weight" render={({ field }) => (
                        <FormItem><FormLabel className="flex items-center gap-1"><Weight className="w-4 h-4"/>몸무게 (kg)</FormLabel><FormControl><Input type="number" {...field} placeholder="예: 65" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                     <FormField control={form.control} name="arm" render={({ field }) => (
                        <FormItem><FormLabel className="flex items-center gap-1"><User className="w-4 h-4"/>팔 둘레 (cm)</FormLabel><FormControl><Input type="number" {...field} placeholder="예: 32" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="thigh" render={({ field }) => (
                        <FormItem><FormLabel className="flex items-center gap-1"><User className="w-4 h-4"/>허벅지 둘레 (cm)</FormLabel><FormControl><Input type="number" {...field} placeholder="예: 55" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                   <FormField control={form.control} name="shoulder" render={({ field }) => (
                      <FormItem><FormLabel className="flex items-center gap-1"><User className="w-4 h-4 transform scale-x-150"/>어깨 둘레 (cm)</FormLabel><FormControl><Input type="number" {...field} placeholder="예: 115" /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="waist" render={({ field }) => (
                      <FormItem><FormLabel className="flex items-center gap-1"><Waves className="w-4 h-4"/>허리 둘레 (cm)</FormLabel><FormControl><Input type="number" {...field} placeholder="예: 75" /></FormControl><FormMessage /></FormItem>
                  )} />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 분석 중...</>) : "분석 요청 및 기록 추가"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {isInitialLoading && (
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
                <h4 className="font-semibold text-primary">💪 AI 신체 분석</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{analysis.analysis}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary">🏋️‍♀️ AI 운동 추천</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{analysis.recommendation}</p>
              </div>
               {analysis.heightGrowthTip && (
                <div>
                  <h4 className="font-semibold text-accent">🌱 AI 키 성장 솔루션</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{analysis.heightGrowthTip}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

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

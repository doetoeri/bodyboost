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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Dumbbell, UtensilsCrossed, ArrowRight } from "lucide-react"

const chartData = [
  { month: "January", calories: 186 },
  { month: "February", calories: 305 },
  { month: "March", calories: 237 },
  { month: "April", calories: 273 },
  { month: "May", calories: 209 },
  { month: "June", calories: 214 },
]

const chartConfig = {
  calories: {
    label: "Calories",
    color: "hsl(var(--primary))",
  },
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your personalized fitness overview.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>
              Your workout consistency for the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="calories" fill="var(--color-calories)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                Today's Workout
              </CardTitle>
              <Dumbbell className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Full Body Strength</p>
              <p className="text-xs text-muted-foreground">30 min - Dumbbells</p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" className="w-full">
                <Link href="/workout">Start Workout</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">Today's Diet</CardTitle>
              <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Balanced Macros</p>
              <p className="text-xs text-muted-foreground">~2200 kcal</p>
            </CardContent>
            <CardFooter>
              <Button asChild size="sm" variant="secondary" className="w-full">
                <Link href="/diet">View Diet Plan</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Explore Your Plan</CardTitle>
          <CardDescription>
            Ready to get started? Generate your personalized plans now.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Link href="/workout" className="group rounded-lg border p-4 transition-colors hover:bg-secondary">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">Workout Generator</h3>
                  <p className="text-sm text-muted-foreground">Create a custom workout plan.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
          </Link>
          <Link href="/diet" className="group rounded-lg border p-4 transition-colors hover:bg-secondary">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">Diet Planner</h3>
                  <p className="text-sm text-muted-foreground">Generate a nutritious meal plan.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

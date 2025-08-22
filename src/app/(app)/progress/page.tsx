"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis } from "recharts"

const weightData = [
  { date: "2024-01-01", weight: 65.0 },
  { date: "2024-02-01", weight: 65.5 },
  { date: "2024-03-01", weight: 66.2 },
  { date: "2024-04-01", weight: 66.8 },
  { date: "2024-05-01", weight: 67.1 },
  { date: "2024-06-01", weight: 67.8 },
]

const weightChartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--primary))",
  },
}

const workoutLog = [
  { date: "2024-06-10", workout: "Full Body Strength", duration: "30 min", status: "Completed" },
  { date: "2024-06-08", workout: "Upper Body Focus", duration: "45 min", status: "Completed" },
  { date: "2024-06-06", workout: "HIIT Cardio", duration: "20 min", status: "Skipped" },
  { date: "2024-06-05", workout: "Full Body Strength", duration: "30 min", status: "Completed" },
  { date: "2024-06-03", workout: "Lower Body & Core", duration: "40 min", status: "Completed" },
]

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Track Your Progress</h1>
        <p className="text-muted-foreground">
          Monitor your journey, stay motivated, and celebrate your achievements.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
          <CardDescription>
            Your weight changes over the last 6 months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={weightChartConfig} className="h-64 w-full">
            <LineChart
              accessibilityLayer
              data={weightData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleString('default', { month: 'short' })}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="weight"
                type="monotone"
                stroke="var(--color-weight)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workout Log</CardTitle>
          <CardDescription>A record of your recent workouts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Workout</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workoutLog.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{log.date}</TableCell>
                  <TableCell>{log.workout}</TableCell>
                  <TableCell>{log.duration}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={log.status === 'Completed' ? 'default' : 'destructive'} className={`${log.status === 'Completed' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-red-500/20 text-red-700 border-red-500/30'} hover:bg-transparent`}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

import { Dumbbell } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Dumbbell className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold tracking-tight">근육 부스터</span>
    </div>
  )
}

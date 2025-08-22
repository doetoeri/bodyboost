import { Dumbbell } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Dumbbell className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold tracking-tight">BodyBoost</span>
    </div>
  )
}

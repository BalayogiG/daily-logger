export function WeekdayHeader({ labels }: { labels: string[] }) {
  return (
    <div className="grid grid-cols-7 gap-1.5 px-0.5">
      {labels.map((label) => (
        <div key={label} className="text-center text-xs font-medium text-muted-foreground">
          {label}
        </div>
      ))}
    </div>
  )
}

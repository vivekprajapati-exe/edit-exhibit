import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

interface AnimatedProgressBarProps {
  percentage: number
  delay?: number
}

export default function AnimatedProgressBar({ percentage, delay = 0 }: AnimatedProgressBarProps) {
  return (
    <div style={{ animationDelay: `${delay}ms` }} className="animate-progress">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: "#fff",
          trailColor: "transparent",
        })}
      />
    </div>
  )
}

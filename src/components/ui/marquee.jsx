import { cn } from "@/lib/utils"

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem] motion-reduce:overflow-x-auto",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array.from({ length: Math.max(0, Math.floor(repeat)) }).map((_, i) => (
          <div
            key={i}
            // copies after the first only fill the loop: keep them out of the accessibility tree, and drop them when motion is off
            aria-hidden={i > 0 ? true : undefined}
            className={cn("flex shrink-0 justify-around gap-(--gap) motion-reduce:animate-none", {
              "motion-reduce:hidden": i > 0,
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {typeof children === "function" ? children(i) : children}
          </div>
        ))}
    </div>
  )
}

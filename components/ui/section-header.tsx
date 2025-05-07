import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function SectionHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2
        className={cn(
          "text-2xl font-bold tracking-tight text-exp-purple dark:text-exp-lavender font-poppins",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && <p className={cn("mt-1 text-muted-foreground", descriptionClassName)}>{description}</p>}
      <div className="mt-3 h-1 w-20 bg-gradient-to-r from-exp-purple to-exp-pink rounded-full"></div>
    </div>
  )
}

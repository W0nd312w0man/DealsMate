import type React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8", className)}>
      <div>
        <h1
          className={cn(
            "text-3xl font-bold tracking-tight text-exp-purple dark:text-exp-lavender font-poppins",
            titleClassName,
          )}
        >
          {title}
        </h1>
        {description && <p className={cn("text-muted-foreground", descriptionClassName)}>{description}</p>}
      </div>
      {children}
    </div>
  )
}

import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    transactionStatus?: string
    isFilterable?: boolean
  }
>(({ className, transactionStatus, isFilterable, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-exp-lavender/20 bg-card text-card-foreground shadow-sm",
        isFilterable && "transition-all hover:border-exp-lavender hover:shadow-md cursor-pointer",
        transactionStatus && `transaction-status-${transactionStatus}`,
        className,
      )}
      data-transaction-status={transactionStatus}
      data-filterable={isFilterable ? "true" : undefined}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hasFilters?: boolean
  }
>(({ className, hasFilters, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", hasFilters && "pb-2", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight font-poppins text-exp-purple dark:text-exp-lightlavender",
        className,
      )}
      {...props}
    />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    transactionStatus?:
      | "scheduled-closing"
      | "active"
      | "pending"
      | "closed"
      | "expired-escrow"
      | "expired-listing"
      | null
    isScrollable?: boolean
    maxHeight?: string
    isFilterable?: boolean
    condensed?: boolean
  }
>(({ className, transactionStatus, isScrollable, maxHeight, isFilterable, condensed, ...props }, ref) => {
  const statusClasses = transactionStatus
    ? {
        "scheduled-closing": "border-l-4 border-l-blue-500",
        active: "border-l-4 border-l-green-500",
        pending: "border-l-4 border-l-amber-500",
        closed: "border-l-4 border-l-exp-purple",
        "expired-escrow": "border-l-4 border-l-red-500",
        "expired-listing": "border-l-4 border-l-orange-500",
      }[transactionStatus]
    : ""

  return (
    <div
      ref={ref}
      className={cn(
        condensed ? "p-4 pt-0" : "p-6 pt-0",
        statusClasses,
        isScrollable &&
          "overflow-y-auto scrollbar-thin scrollbar-thumb-exp-purple/20 dark:scrollbar-thumb-exp-lavender/20 scrollbar-track-transparent",
        isFilterable && "transition-all duration-300 ease-in-out",
        className,
      )}
      style={maxHeight ? { maxHeight } : undefined}
      data-transaction-status={transactionStatus}
      data-filterable={isFilterable ? "true" : undefined}
      data-condensed={condensed ? "true" : undefined}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

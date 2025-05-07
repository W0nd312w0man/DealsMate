import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface PageNavigationProps {
  prevPage?: {
    url: string
    label: string
  }
  nextPage?: {
    url: string
    label: string
  }
}

export function PageNavigation({ prevPage, nextPage }: PageNavigationProps) {
  return (
    <div className="mt-8 pt-4 border-t">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          {prevPage && (
            <Button
              variant="outline"
              asChild
              className="gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
            >
              <Link href={prevPage.url}>
                <ArrowLeft className="h-4 w-4" />
                {prevPage.label}
              </Link>
            </Button>
          )}

          {nextPage && (
            <Button
              variant="outline"
              asChild
              className="gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-700"
            >
              <Link href={nextPage.url}>
                {nextPage.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

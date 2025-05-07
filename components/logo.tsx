import Link from "next/link"

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export function Logo({ className, size = 40, showText = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-md overflow-hidden"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #6a4c93 0%, #4a3566 100%)",
        }}
      >
        <span className="text-white font-bold" style={{ fontSize: size * 0.5 }}>
          DM
        </span>
      </div>
      {showText && <span className="ml-2 text-lg font-semibold text-exp-purple">DealsMate</span>}
    </Link>
  )
}

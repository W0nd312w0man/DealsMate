import Link from "next/link"

interface LogoSvgProps {
  className?: string
  size?: number
  showText?: boolean
}

export function LogoSvg({ className, size = 40, showText = false }: LogoSvgProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background gradient */}
          <rect width="100" height="100" rx="8" fill="url(#gradient)" />

          {/* DM letters */}
          <path
            d="M25 35H40C47.732 35 54 41.268 54 49V49C54 56.732 47.732 63 40 63H25V35Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M30 40V58H40C45.523 58 50 53.523 50 48V50C50 44.477 45.523 40 40 40H30Z"
            fill="#6a4c93"
            fillOpacity="0.9"
          />
          <path d="M58 35L70 63H76L88 35H82L73 58L64 35H58Z" fill="white" fillOpacity="0.9" />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6a4c93" />
              <stop offset="100%" stopColor="#4a3566" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && <span className="ml-2 text-lg font-semibold text-exp-purple">DealsMate</span>}
    </Link>
  )
}

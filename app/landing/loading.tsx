export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-purple-100/30">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 animate-ping opacity-75"></div>
        <div className="relative inset-2 rounded-full bg-white flex items-center justify-center">
          <span className="font-bold text-purple-600 text-2xl">D</span>
        </div>
      </div>
    </div>
  )
}

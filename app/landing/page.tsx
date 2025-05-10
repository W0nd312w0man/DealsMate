import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, ClipboardCheck, MessageSquare, ChevronRight, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white overflow-hidden">
      {/* Header */}
      <header className="w-full border-b border-white/10 bg-purple-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center py-1">
            <img src="/icon-logo.png" alt="DealsMate.io" className="h-10 sm:h-12 md:h-14 w-auto object-contain" />
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="#features" className="text-sm font-medium text-purple-200 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium text-purple-200 hover:text-white transition-colors">
              Benefits
            </Link>
            <Button asChild size="sm" className="bg-purple-500 hover:bg-purple-400 text-white transition-colors">
              <Link href="/dashboard">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 py-12 md:py-24 lg:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 border-2 border-purple-400/30 rotate-45 animate-float"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 border-2 border-pink-400/30 rotate-12 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 border-2 border-blue-400/30 rotate-30 animate-float animation-delay-4000"></div>

        <div className="container px-4 mx-auto relative z-20">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-8 max-w-2xl">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 font-poppins leading-tight">
                  TRANSFORM YOUR REAL ESTATE WORKFLOW
                </h1>
                <p className="text-xl text-purple-200 leading-relaxed">
                  Dealsmate.io combines AI-powered document management, automated workflows, and compliance tracking
                  into one seamless platform.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <CheckCircle className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">AI-powered document management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <CheckCircle className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Streamlined communication</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <CheckCircle className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Built-in compliance tracking</span>
                </div>
              </div>

              <div className="pt-6">
                <form className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="border-purple-700 focus:ring-purple-400 bg-purple-900/50 text-white placeholder:text-purple-300"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-purple-300 mt-2">Start your free 14-day trial. No credit card required.</p>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px]">
                {/* 3D illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[500px] h-[500px] overflow-hidden">
                    {/* Multi-layered background effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 mix-blend-overlay"></div>

                    {/* Overlay gradient for better integration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-600/10 mix-blend-color-dodge"></div>

                    {/* Floating elements positioned relative to the image */}
                    <div className="absolute top-10 right-20 w-20 h-20 flex items-center justify-center bg-gradient-to-r from-purple-500/70 to-pink-500/70 rounded-lg rotate-12 animate-float z-20 backdrop-blur-sm">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-blue-500/70 to-purple-500/70 rounded-lg rotate-45 animate-float animation-delay-2000 z-20 backdrop-blur-sm"></div>
                    <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-r from-pink-500/70 to-purple-500/70 rounded-lg -rotate-12 animate-float animation-delay-4000 z-20 backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud-like shapes at bottom */}
        <div className="absolute bottom-0 right-0 w-full h-32 bg-white/5 rounded-tl-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-24 bg-white/5 rounded-tl-[70px]"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-purple-950 relative">
        <div className="absolute inset-0 bg-[url('/Interlocking Dimensions.png')] bg-cover bg-center opacity-5"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 font-poppins">Streamline Your Transaction Process</h2>
            <p className="text-purple-300">
              Our comprehensive platform helps you manage every aspect of your real estate transactions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 hover:border-purple-700/50 transition-all group">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">Smart Document Management</h3>
              <p className="text-purple-300 text-center">
                Automatically organize and track all transaction documents in one secure place.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/dashboard"
                  className="text-purple-400 hover:text-purple-300 flex items-center text-sm font-medium"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 hover:border-purple-700/50 transition-all group">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <ClipboardCheck className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">Simplified Compliance</h3>
              <p className="text-purple-300 text-center">
                Stay on top of deadlines and requirements with automated compliance tracking.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/dashboard"
                  className="text-purple-400 hover:text-purple-300 flex items-center text-sm font-medium"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-800/50 hover:border-purple-700/50 transition-all group">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 text-center">Seamless Communication</h3>
              <p className="text-purple-300 text-center">
                Keep all parties informed with integrated messaging and notification tools.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/dashboard"
                  className="text-purple-400 hover:text-purple-300 flex items-center text-sm font-medium"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="benefits" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-purple-800"></div>
        <div className="absolute inset-0 bg-[url('/urban-grid-blueprint.png')] bg-cover bg-center opacity-10"></div>

        {/* Geometric decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-purple-500/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-pink-500/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-purple-500/10 rounded-full"></div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="bg-purple-800/50 backdrop-blur-md rounded-3xl p-10 border border-purple-700/50">
              <h2 className="text-3xl font-bold text-white mb-6 font-poppins text-center">
                Ready to Transform Your Transaction Management?
              </h2>
              <p className="text-purple-200 mb-8 text-lg text-center">
                Join thousands of real estate professionals who have simplified their workflow with Dealsmate.io.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-purple-900/50 border-purple-700/50 text-white placeholder:text-purple-300 focus:ring-purple-500"
                  required
                />
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90">
                  Get Started Free
                </Button>
              </div>
              <p className="text-purple-300 text-xs mt-4 text-center">No credit card required. Free 14-day trial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-950 py-8 border-t border-purple-800/50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-purple-400">
              &copy; {new Date().getFullYear()} Dealsmate.io. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

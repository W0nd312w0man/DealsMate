"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle, ClipboardCheck, MessageSquare, ChevronRight } from "lucide-react"
import { SignInDialog } from "@/components/landing/sign-in-dialog"

export default function LandingPage() {
  const [signInDialogOpen, setSignInDialogOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white overflow-hidden">
      {/* Sign In Dialog */}
      <SignInDialog open={signInDialogOpen} onOpenChange={setSignInDialogOpen} />

      {/* Header */}
      <header className="w-full border-b border-white/10 bg-purple-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="relative h-16 w-auto">
            <img
              src="/logo_font.png"
              alt="Dealsmate.io Logo"
              className="absolute h-32 w-auto object-contain -top-8 left-0"
            />
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="#features" className="text-sm font-medium text-purple-200 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium text-purple-200 hover:text-white transition-colors">
              Benefits
            </Link>
            <Button
              size="sm"
              className="bg-purple-500 hover:bg-purple-400 text-white transition-colors"
              onClick={() => setSignInDialogOpen(true)}
            >
              Sign In
            </Button>
          </div>

          {/* Mobile logo - visible only on small screens */}
          <div className="md:hidden flex items-center">
            <div className="h-8 w-auto">
              <img src="/logo_font.png" alt="Dealsmate.io Logo" className="h-full w-auto object-contain" />
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the landing page content remains unchanged */}
      {/* Hero Section - Redesigned */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 border-2 border-purple-400/30 rotate-45 animate-float"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 border-2 border-pink-400/30 rotate-12 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 border-2 border-blue-400/30 rotate-30 animate-float animation-delay-4000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Content */}
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-300 font-poppins mb-6">
                Your Deal Starts When the Conversation Does
              </h1>

              <p className="text-xl text-purple-200 leading-relaxed mb-8">
                Dealsmate.io turns emails and texts into live, trackable transactions—automatically. No setup. No forms.
                Just results.
              </p>

              {/* Feature bullets */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Auto-create workspaces from client messages</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Smart intake from Gmail and SMS</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Built-in task suggestions and reminders</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Document tracking and compliance alerts</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1 mt-1">
                    <CheckCircle className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Unified communication, timeline, and workflow tools</span>
                </div>
              </div>

              {/* CTA Section */}
              <div className="max-w-md">
                <form className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="border-purple-700 focus:ring-purple-400 bg-purple-900/50 text-white placeholder:text-purple-300"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 whitespace-nowrap"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-purple-300 mt-2">Start your free 14-day trial. No credit card required.</p>
              </div>
            </div>

            {/* Right column - Visual */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main visual element */}
                <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-purple-700/30 shadow-2xl">
                  {/* Dashboard mockup */}
                  <div className="absolute inset-0 bg-purple-900/70 backdrop-blur-sm">
                    {/* Header bar */}
                    <div className="h-12 bg-purple-800/70 border-b border-purple-700/50 flex items-center px-4">
                      <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                      <div className="flex-1"></div>
                    </div>

                    {/* Content area */}
                    <div className="p-4 grid grid-cols-3 gap-4">
                      {/* Left sidebar */}
                      <div className="col-span-1 bg-purple-800/50 rounded-lg p-3 h-[430px]">
                        <div className="h-8 w-24 bg-purple-700/50 rounded-md mb-4"></div>
                        <div className="space-y-3">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-purple-700/70"></div>
                              <div className="h-4 bg-purple-700/70 rounded w-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Main content */}
                      <div className="col-span-2 space-y-4">
                        {/* Top cards */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-purple-800/50 rounded-lg p-3 h-32">
                            <div className="h-5 w-20 bg-purple-700/50 rounded-md mb-3"></div>
                            <div className="h-4 bg-purple-700/70 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-purple-700/70 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-purple-700/70 rounded w-2/3"></div>
                          </div>
                          <div className="bg-purple-800/50 rounded-lg p-3 h-32">
                            <div className="h-5 w-20 bg-purple-700/50 rounded-md mb-3"></div>
                            <div className="h-16 bg-purple-700/30 rounded-lg flex items-center justify-center">
                              <div className="h-10 w-10 rounded-full bg-purple-600/70 animate-pulse"></div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom card */}
                        <div className="bg-purple-800/50 rounded-lg p-3 h-[280px]">
                          <div className="h-5 w-32 bg-purple-700/50 rounded-md mb-4"></div>
                          <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-700/70 flex-shrink-0 mt-1"></div>
                                <div className="flex-1 space-y-2">
                                  <div className="h-4 bg-purple-700/70 rounded w-3/4"></div>
                                  <div className="h-4 bg-purple-700/70 rounded w-1/2"></div>
                                </div>
                                <div className="w-16 h-6 rounded-md bg-purple-600/50 flex-shrink-0"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-lg rotate-12 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/10">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>

                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-lg -rotate-12 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/10">
                  <ClipboardCheck className="h-12 w-12 text-white" />
                </div>

                {/* Notification popup */}
                <div className="absolute top-1/4 -right-10 w-64 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-xl animate-float">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-purple-900">New Transaction Created</div>
                      <div className="text-xs text-purple-700">123 Main St. Purchase Agreement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="rgba(109, 40, 217, 0.2)"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,234.7C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
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

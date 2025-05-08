import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowRight,
  MessageSquare,
  ChevronRight,
  Sparkles,
  FileText,
  Bell,
  Inbox,
  Calendar,
  Layers,
  Grid,
  Menu,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white overflow-hidden">
      {/* Header with Integrated Logo */}
      <header className="w-full border-b border-white/10 bg-purple-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between py-4">
          {/* Logo and Brand Name as a Clickable Link */}
          <Link href="#" className="flex items-center space-x-3 group">
            {/* Futuristic Square Logo */}
            <div className="relative h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg overflow-hidden flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <div className="absolute inset-0.5 bg-purple-950 rounded-md"></div>
              <div className="relative z-10 flex items-center justify-center">
                <Grid className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
              </div>
              <div className="absolute top-0 right-0 h-3 w-3 bg-pink-500 rounded-bl-md"></div>
              <div className="absolute bottom-0 left-0 h-3 w-3 bg-purple-400 rounded-tr-md"></div>
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/20 transition-colors rounded-lg"></div>
            </div>
            <span className="font-bold text-white sm:inline-block font-poppins text-lg group-hover:text-purple-200 transition-colors">
              Dealsmate.io
            </span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="text-purple-200 hover:text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Unchanged */}
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
                  Your Deal Starts When the Conversation Does
                </h1>
                <p className="text-xl text-purple-200 leading-relaxed">
                  Dealsmate.io instantly turns emails and texts into live, trackable transactions. No setup. No forms.
                  Just results.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <MessageSquare className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Auto-create workspaces from client messages</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <Inbox className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Smart intake from Gmail and SMS</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <Calendar className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Built-in task suggestions and reminders</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <FileText className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Document tracking and compliance alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <Layers className="h-5 w-5 text-purple-300" />
                  </div>
                  <span className="text-purple-100">Unified communication, timeline, and workflow tools</span>
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
                {/* Animated illustration showing message to workspace conversion */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[500px] h-[500px] overflow-hidden">
                    {/* Multi-layered background effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 mix-blend-overlay"></div>

                    {/* Overlay gradient for better integration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-600/10 mix-blend-color-dodge"></div>

                    {/* Large Futuristic Logo in Background */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl rotate-12 backdrop-blur-sm">
                      <div className="absolute inset-4 bg-purple-950/80 rounded-xl"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Grid className="h-24 w-24 text-purple-300/40" />
                      </div>
                      <div className="absolute top-0 right-0 h-12 w-12 bg-pink-500/30 rounded-bl-xl"></div>
                      <div className="absolute bottom-0 left-0 h-12 w-12 bg-purple-400/30 rounded-tr-xl"></div>
                    </div>

                    {/* Animated elements showing email/text to workspace conversion */}
                    <div className="absolute top-10 right-20 w-48 h-32 flex flex-col items-center justify-center bg-gradient-to-r from-purple-500/70 to-pink-500/70 rounded-lg rotate-3 animate-float z-20 backdrop-blur-sm p-4">
                      <MessageSquare className="h-8 w-8 text-white mb-2" />
                      <div className="text-xs text-white text-center">Client Message</div>
                    </div>

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-600/70 to-blue-500/70 rounded-xl rotate-6 animate-float animation-delay-2000 z-30 backdrop-blur-sm p-6 flex flex-col items-center justify-center">
                      <Sparkles className="h-12 w-12 text-white mb-3" />
                      <div className="text-sm text-white text-center font-medium">Workspace Created</div>
                      <div className="mt-2 w-full bg-white/20 h-1 rounded-full"></div>
                      <div className="mt-2 w-full bg-white/20 h-1 rounded-full"></div>
                      <div className="mt-2 w-full bg-white/20 h-1 rounded-full"></div>
                    </div>

                    <div className="absolute bottom-20 left-20 w-40 h-32 bg-gradient-to-r from-blue-500/70 to-purple-500/70 rounded-lg -rotate-6 animate-float animation-delay-4000 z-20 backdrop-blur-sm p-4 flex flex-col items-center justify-center">
                      <Bell className="h-8 w-8 text-white mb-2" />
                      <div className="text-xs text-white text-center">Tasks & Reminders</div>
                    </div>
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

      {/* Features Section - Updated Background */}
      <section id="features" className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-[url('/Interlocking Dimensions.png')] bg-cover bg-center opacity-5"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-purple-900 mb-4 font-poppins">Workflows That Start Themselves</h2>
            <p className="text-purple-700">The moment your client reaches out, Dealsmate.io gets to work.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-purple-50 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 hover:border-purple-300 transition-all group shadow-sm hover:shadow-md">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3 text-center">AI-Powered Smart Intake</h3>
              <p className="text-purple-700 text-center">
                New client sends an email or text? We extract the info, set up the workspace, and populate the
                timeline—automatically.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/dashboard"
                  className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-purple-50 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 hover:border-purple-300 transition-all group shadow-sm hover:shadow-md">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3 text-center">Instant Document Intelligence</h3>
              <p className="text-purple-700 text-center">
                Contracts, agreements, and disclosures are sorted, named, and tracked—without lifting a finger.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/dashboard"
                  className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-50 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 hover:border-purple-300 transition-all group shadow-sm hover:shadow-md">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3 text-center">
                Automated Compliance & Follow-Ups
              </h3>
              <p className="text-purple-700 text-center">
                TALOS monitors every deal stage, due date, and document so you never miss a requirement.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/dashboard"
                  className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-purple-50 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 hover:border-purple-300 transition-all group shadow-sm hover:shadow-md">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3 text-center">Unified Communication Hub</h3>
              <p className="text-purple-700 text-center">
                All emails, texts, and notes—organized per transaction, searchable, and fully visible in one place.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/dashboard"
                  className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Updated Background */}
      <section id="benefits" className="py-24 relative overflow-hidden bg-purple-100">
        <div className="absolute inset-0 bg-[url('/urban-grid-blueprint.png')] bg-cover bg-center opacity-5"></div>

        {/* Geometric decorations */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-purple-300/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-pink-300/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-purple-300/10 rounded-full"></div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 border border-purple-200 shadow-lg">
              <h2 className="text-3xl font-bold text-purple-900 mb-6 font-poppins text-center">
                Close More Deals With Less Work
              </h2>
              <p className="text-purple-700 mb-8 text-lg text-center">
                Thousands of real estate professionals use Dealsmate.io to let automation handle the heavy
                lifting—starting from the very first message.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white border-purple-300 text-purple-900 placeholder:text-purple-400 focus:ring-purple-500"
                  required
                />
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90">
                  Get Started Free
                </Button>
              </div>
              <p className="text-purple-500 text-xs mt-4 text-center">No credit card required. Free 14-day trial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Updated Background */}
      <footer className="bg-purple-900 py-8 border-t border-purple-800/50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Futuristic Square Logo (smaller version) */}
              <div className="relative h-6 w-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md overflow-hidden flex items-center justify-center shadow-lg">
                <div className="absolute inset-0.5 bg-purple-950 rounded-sm"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <Grid className="h-3 w-3 text-purple-300" />
                </div>
                <div className="absolute top-0 right-0 h-2 w-2 bg-pink-500 rounded-bl-sm"></div>
                <div className="absolute bottom-0 left-0 h-2 w-2 bg-purple-400 rounded-tr-sm"></div>
              </div>
              <div className="text-sm text-white">
                &copy; {new Date().getFullYear()} Dealsmate.io. All rights reserved.
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-purple-200 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-purple-200 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

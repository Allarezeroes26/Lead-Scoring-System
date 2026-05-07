import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip" 
import { AppSidebar } from "@/components/app-sidebar"
import { EB_Garamond, DM_Mono } from 'next/font/google'
import { ThemeProvider } from '../components/theme-provider'
import "./globals.css"

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmMono.variable} ${ebGaramond.variable}`} suppressHydrationWarning>
      <body className="antialiased h-screen font-mono bg-[#020617] text-slate-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Forced dark for that "Command Center" feel
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            <SidebarProvider>
              <div className="flex h-full w-full overflow-hidden bg-[#020617]">
                <AppSidebar />
                <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
                  {/* Subtle radial glow for depth */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] pointer-events-none" />
                  
                  <header className="flex h-14 items-center border-b border-slate-800/60 px-4 shrink-0 bg-slate-900/50 backdrop-blur-md z-10">
                    <SidebarTrigger className="text-slate-400 hover:text-white transition-colors" />
                    <div className="ml-4 flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Status:</span>
                       <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-bold text-emerald-500 uppercase">Operational</span>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative z-0">
                    <div className="max-w-[1600px] mx-auto">
                      {children}
                    </div>
                  </div>
                </main>
              </div>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
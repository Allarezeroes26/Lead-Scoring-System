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
      <body className="antialiased h-screen font-mono bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" 
          enableSystem={true} 
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            <SidebarProvider>
              {/* Outer Wrapper */}
              <div className="flex h-full w-full overflow-hidden bg-background">
                <AppSidebar />
                
                <main className="flex-1 flex flex-col min-w-0 bg-background relative">
                  
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-muted),transparent)] dark:bg-[radial-gradient(circle_at_50%_-20%,var(--color-primary),transparent)] opacity-40 pointer-events-none" />
                  
                  {/* Header */}
                  <header className="flex h-14 items-center border-b border-border px-4 shrink-0 bg-background/80 backdrop-blur-md z-10">
                    <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
                    
                    <div className="ml-4 flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                         Model Status:
                       </span>
                       <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                         Working
                       </span>
                    </div>
                  </header>

                  <div className="flex-1 overflow-y-auto overflow-x-hidden bg-background p-4 md:p-8 relative z-0 min-w-0">
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
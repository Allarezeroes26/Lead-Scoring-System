import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip" 
import { AppSidebar } from "@/components/app-sidebar"
import { EB_Garamond, DM_Mono } from 'next/font/google'
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
    <html lang="en" className={`${dmMono.variable} ${ebGaramond.variable}`}>
      <body className={`antialiased h-screen font-mono`}>
        <TooltipProvider delayDuration={0}>
          <SidebarProvider>
            <div className="flex h-full w-full">
              <AppSidebar />
              <main className="flex-1 flex flex-col min-w-0">
                <header className="flex h-16 items-center border-b px-4 shrink-0">
                  <SidebarTrigger />
                </header>
                <div className="flex-1 overflow-auto p-6">
                  {children}
                </div>
              </main>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
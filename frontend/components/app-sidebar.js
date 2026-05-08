"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { 
  Settings, Package, Home, Info, 
  Activity, Terminal, UserCircle, Weight
} from "lucide-react"

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarRail, SidebarFooter,
} from "./ui/sidebar"

const data = {
  navMain: [
    { title: "Home", url: "/", icon: Home },
    { title: "Lead Predictor", url: "/scorer", icon: Activity },
    { title: "Batch Predictor", url: "/batch_scorer", icon: Package },
    { title: "Model Details", url: "/about", icon: Info },
    { title: "Weights", url: "/weight", icon: Weight },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    // REMOVED HARDCODED HEX: Using semantic tokens background and border
    <Sidebar collapsible="icon" className="border-r border-border bg-background transition-colors duration-300">
      <SidebarHeader className="h-[72px] justify-center px-4 group-data-[collapsible=icon]:p-0">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Terminal className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-black tracking-tight text-foreground uppercase text-[11px]">Customer_Predictor</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold tracking-tighter">v1.0.0_STABLE</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-data-[collapsible=icon]:hidden">
            Inference Control
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 gap-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
              {data.navMain.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isActive}
                      className={`
                        transition-all duration-200 rounded-lg h-11 w-full
                        group-data-[collapsible=icon]:w-10
                        group-data-[collapsible=icon]:justify-center
                        ${isActive 
                          ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm" 
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}
                      `}
                    >
                      <a href={item.url} className="flex items-center gap-3 px-3 group-data-[collapsible=icon]:px-0">
                        <item.icon className={`size-5 shrink-0 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`} />
                        <span className={`font-bold text-sm tracking-tight group-data-[collapsible=icon]:hidden ${isActive ? "text-foreground" : ""}`}>
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-xl border border-border backdrop-blur-sm group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:justify-center">
          <div className="relative shrink-0">
            <UserCircle className="size-6 text-muted-foreground" />
            <div className="absolute bottom-0 right-0 size-2 bg-emerald-500 rounded-full border-2 border-background" />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-bold text-foreground truncate">Erwin Bacani</span>
            <span className="text-[9px] text-blue-600 dark:text-blue-500 font-mono font-bold uppercase tracking-tighter">System_Admin</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
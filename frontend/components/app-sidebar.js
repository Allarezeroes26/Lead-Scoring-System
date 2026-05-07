"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  Home, 
  Info, 
  Activity,
  Terminal,
  UserCircle
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "./ui/sidebar"

const data = {
  navMain: [
    { title: "Home", url: "/", icon: Home },
    { title: "Lead Predictor", url: "/scorer", icon: Activity }, // Swapped to Activity for statistical feel
    { title: "Batch Predictor", url: "/batch_scorer", icon: Package },
    { title: "Model Details", url: "/about", icon: Info }, // Swapped to Info for the About page
    { title: "Settings", url: "/settings", icon: Settings },
  ],
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Terminal className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-black tracking-tight text-slate-900 uppercase text-xs">PredictionSystem</span>
            <span className="text-[10px] text-slate-500 font-medium italic">v1.0.4-raw</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Inference Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    className="hover:bg-slate-100 transition-all duration-200"
                  >
                    <a href={item.url} className="flex items-center gap-3 py-5">
                      <item.icon className="size-4.5 text-slate-500 group-data-[state=active]:text-blue-600" />
                      <span className="font-semibold text-slate-600 group-data-[state=active]:text-slate-900">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 px-2 py-1 bg-slate-50 rounded-xl border border-slate-200">
          <UserCircle className="size-5 text-slate-400 shrink-0" />
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-[11px] font-bold text-slate-900 truncate">Erwin Bacani</span>
            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">Developer</span>
          </div>
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
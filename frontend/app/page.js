"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Database, TrendingUp, Target, Zap, 
    Activity, ShieldCheck, Terminal, Download, FileSpreadsheet
} from "lucide-react";

export default function Home() {
  const [metrics, setMetrics] = useState({
    total: 0,
    avgScore: 0,
    hotLeads: 0,
    modelHealth: 0,
    chartData: [],
    recentLeads: [],
    distribution: []
  });

  useEffect(() => {
    const singleData = JSON.parse(localStorage.getItem("leadHistory") || "[]");
    const batchHistory = JSON.parse(localStorage.getItem("scoring_history") || "[]");
    const batchData = batchHistory.flatMap(b => b.results || []);
    const combined = [...singleData, ...batchData];
    
    if (combined.length > 0) {
      const total = combined.length;
      const avgRaw = (combined.reduce((acc, curr) => acc + (curr.score || 0), 0) / total);
      const hot = combined.filter(l => l.status?.toLowerCase() === "hot" || (l.score || 0) >= 0.7).length;

      const confidenceSum = combined.reduce((acc, curr) => {
        return acc + Math.abs((curr.score || 0) - 0.5) * 2;
      }, 0);
      const calculatedHealth = ((confidenceSum / total) * 100).toFixed(1);

      const dist = [
        { name: 'LOW', count: combined.filter(l => (l.score || 0) < 0.4).length, color: '#94a3b8' },
        { name: 'MID', count: combined.filter(l => (l.score || 0) >= 0.4 && (l.score || 0) < 0.7).length, color: '#3b82f6' },
        { name: 'HIGH', count: combined.filter(l => (l.score || 0) >= 0.7).length, color: '#f43f5e' },
      ];

      const chart = combined.slice(-15).map((item, i) => ({
        name: i + 1,
        score: Math.round((item.score || 0) * 100)
      }));

      setMetrics({ 
        total, 
        hotLeads: hot, 
        avgScore: (avgRaw * 100).toFixed(1), 
        modelHealth: calculatedHealth,
        chartData: chart, 
        recentLeads: combined.slice(-5).reverse(), 
        distribution: dist 
      });
    }
  }, []);

  return (
      <div className="p-6 lg:p-10 space-y-10 bg-background min-h-screen text-foreground transition-colors duration-300">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-500">Core Dashboard // Scorer_V1</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground">Inference Dashboard</h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Real-Time Scoring Telemetry</p>
          </div>
          <div className="flex items-center gap-4">
            
            {/* UPDATED: Direct link to your test_data.csv in the public folder */}
            <a 
              href="/test_data.csv" 
              download="test_data.csv"
              className="h-12 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl px-4 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download Test Set
            </a>

            <Link href="/scorer">
              <button className="h-12 border border-border bg-background hover:bg-accent text-foreground rounded-xl px-6 font-bold uppercase text-[10px] tracking-widest transition-all">
                Manual Entry
              </button>
            </Link>
            <Link href="/batch_scorer">
              <button className="h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-900/20">
                Execute Batch
              </button>
            </Link>
          </div>
        </div>

        {/* REST OF DASHBOARD REMAINS UNCHANGED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Vectors Analyzed" value={metrics.total} icon={<Database className="w-4 h-4" />} />
          <StatCard title="Mean Propensity" value={`${metrics.avgScore}%`} icon={<TrendingUp className="w-4 h-4" />} />
          <StatCard title="Priority Filter" value={metrics.hotLeads} icon={<Target className="w-4 h-4" />} color="text-rose-500" />
          <StatCard title="Inference Confidence" value={`${metrics.modelHealth}%`} icon={<ShieldCheck className="w-4 h-4" />} color="text-cyan-600 dark:text-cyan-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-border bg-card shadow-2xl min-w-0">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border py-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Inference Variance</CardTitle>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] border-border text-muted-foreground">REALTIME_FEED</Badge>
              </CardHeader>
              <CardContent className="h-[350px] pt-8 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.chartData}>
                    <defs>
                        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border opacity-20" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                          backgroundColor: 'var(--background)', 
                          border: '1px solid var(--border)', 
                          borderRadius: '12px', 
                          fontSize: '10px',
                          color: 'var(--foreground)'
                      }} 
                    />
                    <Area type="stepAfter" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#curveGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-border bg-card">
                  <CardHeader className="py-4 border-b border-border">
                      <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Terminal className="w-3 h-3" /> Distribution Matrix
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[200px] pt-6 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.distribution}>
                        <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={40}>
                          {metrics.distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} opacity={1} />
                          ))}
                        </Bar>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'currentColor'}} className="text-muted-foreground" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
              </Card>

              <Card className="border-none bg-blue-600 text-white p-8 relative overflow-hidden flex flex-col justify-center">
                  <Zap className="absolute top-0 right-0 p-4 w-24 h-24 text-white/10 -mr-6 -mt-6" />
                  <div className="relative z-10 space-y-4">
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.3em]">Module Notes</p>
                    <h3 className="text-2xl font-black tracking-tighter">Logistic Regression</h3>
                    <div className="text-sm leading-relaxed text-blue-900 font-bold bg-white p-3 rounded-lg">
                      Optimized for High-Value conversion detection.
                    </div>
                  </div>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-4">
            <Card className="border-border bg-card h-full flex flex-col shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-border py-5">
                  <div className="flex items-center justify-between">
                      <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Stream</CardTitle>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                  </div>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <div className="divide-y divide-border">
                  {metrics.recentLeads.length > 0 ? metrics.recentLeads.map((lead, i) => (
                    <div key={i} className="p-5 flex items-center justify-between hover:bg-accent/50 transition-all group">
                      <div className="space-y-1">
                          <p className="text-xs font-black text-foreground uppercase tracking-tighter">{lead.job || "Lead_Object"}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">SCORE: {(lead.score || 0).toFixed(4)}</p>
                      </div>
                      <Badge className={`rounded-md font-mono text-[10px] ${lead.score > 0.7 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-muted text-muted-foreground'}`} variant="outline">
                          {Math.round((lead.score || 0) * 100)}%
                      </Badge>
                    </div>
                  )) : (
                    <div className="p-10 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No Recent Data</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  function StatCard({ title, value, icon, color = "text-blue-600 dark:text-blue-500" }) {
    return (
      <Card className="border-border bg-card hover:border-blue-500/50 transition-all group shadow-lg">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</span>
              <div className={`p-2 bg-muted rounded-lg border border-border group-hover:border-blue-500/50 transition-colors ${color}`}>
                  {icon}
              </div>
          </div>
          <div>
              <p className="text-4xl font-black text-foreground tracking-tighter font-mono">{value}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
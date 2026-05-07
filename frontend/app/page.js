"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Database, TrendingUp, Target, Zap, 
    BrainCircuit, ArrowUpRight, Activity,
    ShieldCheck, Terminal, Download
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
        { name: 'LOW', count: combined.filter(l => (l.score || 0) < 0.4).length, color: '#1e293b' },
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

  const downloadFullHistory = () => {
    const singleData = JSON.parse(localStorage.getItem("leadHistory") || "[]");
    const batchHistory = JSON.parse(localStorage.getItem("scoring_history") || "[]");
    const combined = [...singleData, ...batchHistory.flatMap(b => b.results || [])];
    if (combined.length === 0) return;

    const headers = Object.keys(combined[0]).join(",");
    const rows = combined.map(lead => Object.values(lead).map(value => `"${value}"`).join(","));
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LOGIT_EXPORT_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 bg-transparent min-h-screen text-slate-200">
      
      {/* HEADER: ENGINE STATUS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800/60 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Core Dashboard // Scorer_V1</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">Lead Intelligence</h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Aggregated Predictive Telemetry</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/scorer">
            <Button variant="outline" className="h-12 border-slate-800 bg-slate-900/30 backdrop-blur-sm hover:bg-slate-800 text-slate-300 rounded-xl px-6 font-bold uppercase text-[10px] tracking-widest">
              Manual Entry
            </Button>
          </Link>
          <Link href="/batch_scorer">
            <Button className="h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-900/20">
              Execute Batch
            </Button>
          </Link>
        </div>
      </div>

      {/* METRIC GRIDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Vectors Analyzed" value={metrics.total} icon={<Database className="w-4 h-4" />} />
        <StatCard title="Mean Propensity" value={`${metrics.avgScore}%`} icon={<TrendingUp className="w-4 h-4" />} />
        <StatCard title="Priority Filter" value={metrics.hotLeads} icon={<Target className="w-4 h-4" />} color="text-rose-500" />
        <StatCard title="Inference Confidence" value={`${metrics.modelHealth}%`} icon={<ShieldCheck className="w-4 h-4" />} color="text-cyan-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-slate-800/60 bg-slate-900/20 backdrop-blur-md overflow-hidden shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/40 py-4">
              <div className="flex items-center gap-3">
                 <Activity className="w-4 h-4 text-blue-500" />
                 <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inference Variance</CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] border-slate-700 text-slate-500">REALTIME_FEED</Badge>
            </CardHeader>
            <CardContent className="h-[350px] pt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.chartData}>
                  <defs>
                    <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.3} />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }} />
                  <Area type="stepAfter" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#curveGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="border-slate-800/60 bg-slate-900/20 backdrop-blur-sm">
                <CardHeader className="py-4 border-b border-slate-800/40">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> Distribution Matrix
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] pt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.distribution}>
                      <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={40}>
                        {metrics.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                        ))}
                      </Bar>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#475569', fontFamily: 'monospace'}} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
             </Card>

             <Card className="border-none bg-blue-600/90 shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)] text-white p-8 relative overflow-hidden flex flex-col justify-center">
                <Zap className="absolute top-0 right-0 p-4 w-24 h-24 text-white/10 -mr-6 -mt-6" />
                <div className="relative z-10 space-y-4">
                  <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.3em]">Module Notes</p>
                  <h3 className="text-2xl font-black tracking-tighter">Logistic Regression</h3>
                  <p className="text-sm leading-relaxed text-blue-500 font-bold bg-white/95 p-3 rounded-lg">
                    Optimized for High-Value conversion detection based on engagement vectors.
                  </p>
                </div>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4">
          <Card className="border-slate-800/60 bg-slate-900/20 backdrop-blur-md h-full flex flex-col shadow-2xl">
            <CardHeader className="border-b border-slate-800/40 py-5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Stream</CardTitle>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
              <div className="divide-y divide-slate-800/40">
                {metrics.recentLeads.map((lead, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-white/5 transition-all group">
                    <div className="space-y-1">
                        <p className="text-xs font-black text-slate-200 uppercase tracking-tighter group-hover:text-blue-400">{lead.job || "Lead_Object"}</p>
                        <p className="text-[10px] font-mono text-slate-500">SCORE: {(lead.score || 0).toFixed(4)}</p>
                    </div>
                    <Badge className={`rounded-md font-mono text-[10px] ${lead.score > 0.7 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-slate-800/50 text-slate-400 border-slate-700'}`} variant="outline">
                        {Math.round((lead.score || 0) * 100)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t border-slate-800/40">
                <Button onClick={downloadFullHistory} variant="ghost" className="w-full h-12 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest gap-2">
                  <Download className="w-3 h-3" /> Export Telemetry
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-blue-500" }) {
  return (
    <Card className="border-slate-800/60 bg-slate-900/10 backdrop-blur-sm hover:bg-slate-900/30 transition-all group shadow-lg">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
            <div className={`p-2 bg-slate-900/50 rounded-lg border border-slate-800/50 group-hover:border-blue-500/50 transition-colors ${color}`}>
                {icon}
            </div>
        </div>
        <div>
            <p className="text-4xl font-black text-white tracking-tighter font-mono">{value}</p>
            <div className="w-full h-1 bg-slate-800/50 rounded-full mt-3 overflow-hidden">
                <div className={`h-full bg-current opacity-30 ${color}`} style={{width: '65%'}} />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
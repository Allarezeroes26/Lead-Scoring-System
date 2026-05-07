"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Database, TrendingUp, Target, Zap, 
    BrainCircuit, ArrowUpRight, Clock, 
    ChevronRight, Download, Activity 
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
    // 1. Load Data from LocalStorage
    const singleData = JSON.parse(localStorage.getItem("leadHistory") || "[]");
    const batchHistory = JSON.parse(localStorage.getItem("scoring_history") || "[]");
    const batchData = batchHistory.flatMap(b => b.results || []);
    const combined = [...singleData, ...batchData];
    
    if (combined.length > 0) {
      const total = combined.length;
      
      // Calculate Average Propensity
      const avgRaw = (combined.reduce((acc, curr) => acc + (curr.score || 0), 0) / total);
      
      // Calculate Priority (Hot) Leads
      const hot = combined.filter(l => l.status?.toLowerCase() === "hot" || (l.score || 0) >= 0.7).length;

      // DYNAMIC MODEL HEALTH: 
      // Measures how far predictions are from the 0.5 (uncertainty) boundary.
      // Health = 100% means all scores are 0 or 1. 0% means all scores are 0.5.
      const confidenceSum = combined.reduce((acc, curr) => {
        return acc + Math.abs((curr.score || 0) - 0.5) * 2;
      }, 0);
      const calculatedHealth = ((confidenceSum / total) * 100).toFixed(1);

      // Score Distribution for Bar Chart
      const dist = [
        { name: 'Low (<0.4)', count: combined.filter(l => (l.score || 0) < 0.4).length, color: '#94a3b8' },
        { name: 'Mid (0.4-0.7)', count: combined.filter(l => (l.score || 0) >= 0.4 && (l.score || 0) < 0.7).length, color: '#6366f1' },
        { name: 'High (>0.7)', count: combined.filter(l => (l.score || 0) >= 0.7).length, color: '#f43f5e' },
      ];

      // Chart Data (Last 15 scores)
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

    if (combined.length === 0) {
        alert("No lead data found to export.");
        return;
    }

    const rows = combined.map(lead => 
        Object.values(lead).map(value => `"${value}"`).join(",")
    );
    const csvContent = [headers, ...rows].join("\n");

    // Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `model_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none mb-2 px-3 py-1">
            <BrainCircuit className="w-3 h-3 mr-2" /> Logistic Regression v1.0
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Lead Scoring Dashboard</h1>
          <p className="text-slate-500 font-medium">Monitor lead conversion predictions and model performance.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/scorer"><Button variant="outline" className="bg-white border-slate-200">Single Entry</Button></Link>
          <Link href="/batch_scorer"><Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">Batch Scorer</Button></Link>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Analyzed" value={metrics.total} icon={<Database className="text-indigo-600"/>} />
        <StatCard title="Average Conversion Score" value={`${metrics.avgScore}%`} icon={<TrendingUp className="text-emerald-500"/>} />
        <StatCard title="Priority Leads" value={metrics.hotLeads} icon={<Target className="text-amber-500"/>} />
        <StatCard 
            title="Prediction Confidence" 
            value={`${metrics.modelHealth}%`} 
            icon={<Zap className={parseFloat(metrics.modelHealth) < 50 ? "text-amber-500" : "text-indigo-400"}/>} 
            trend={parseFloat(metrics.modelHealth) > 70 ? "Stable" : "Variable"}
            description="Average confidence across recent predictions." 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Probability Curve</CardTitle>
                <CardDescription>Visualizing output variance for recent entries</CardDescription>
              </div>
              <ArrowUpRight className="text-slate-300 w-5 h-5" />
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-none shadow-md">
                <CardHeader><CardTitle className="text-xs font-black uppercase text-slate-400">Score Segmentation</CardTitle></CardHeader>
                <CardContent className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.distribution}>
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {metrics.distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             <Card className="border-none shadow-md bg-indigo-900 text-white p-6 relative overflow-hidden flex flex-col justify-center">
                <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
                <p className="text-xs font-black text-indigo-300 uppercase mb-2">Model Overview</p>
                <p className="text-lg font-bold leading-tight">
                  Model Notes

This project uses a custom logistic regression implementation trained on marketing campaign data. Predictions are based on customer engagement, financial indicators, and prior campaign outcomes.
                </p>
             </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Card className="border-none shadow-md h-full bg-white">
            <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black uppercase text-slate-400">Recent Predictions</CardTitle>
                <Activity className="w-4 h-4 text-indigo-500" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {metrics.recentLeads.map((lead, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                        <p className="text-sm font-black text-slate-700 capitalize">{lead.job || "Lead Record"}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {Math.round((lead.score || 0) * 100)}% Propensity
                        </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${lead.score > 0.7 ? 'bg-rose-500 animate-pulse' : 'bg-slate-200'}`} />
                  </div>
                ))}
                {metrics.recentLeads.length === 0 && (
                    <p className="p-8 text-center text-slate-400 text-xs italic">Waiting for model input...</p>
                )}
              </div>
              <div className="p-4 bg-slate-50/50">
                <Button onClick={downloadFullHistory} variant="ghost" className="w-full text-xs font-black text-slate-500 hover:text-indigo-600 group">
                    <Download className="w-3 h-3 mr-2 group-hover:-translate-y-0.5 transition-transform" /> 
                    Download CSV Archive
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, description }) {
  return (
    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            {trend && <span className="text-[10px] font-black text-emerald-600">{trend}</span>}
          </div>
          {description && <p className="text-[9px] text-slate-400 mt-1 font-medium">{description}</p>}
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      </CardContent>
    </Card>
  );
}
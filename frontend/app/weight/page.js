"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Scale, Info, TrendingUp, AlertCircle, Zap, Loader2, RefreshCw } from "lucide-react";

const WeightsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeights = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/get_weight');
            if (!res.ok) throw new Error("Failed to load model weights");
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeights();
    }, []);

    if (loading) return (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">De-serializing Weights...</p>
        </div>
    );

    if (error) return (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-16 h-16 text-rose-500/20 mb-4" />
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Access Denied</h2>
            <p className="text-slate-500 max-w-xs mt-2 font-medium">{error}</p>
            <button onClick={fetchWeights} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all">
                Retry Handshake
            </button>
        </div>
    );

    const topFeature = data.weights[0];

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-500">
                        <Scale className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Linear Logic Visualization</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-100">Model Weights</h1>
                    <p className="text-slate-400 text-sm max-w-2xl leading-relaxed font-medium">
                        Coefficients extracted from <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-mono">weights.npy</code>. 
                        These represent the pull magnitude of specific features on the sigmoid output.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-1 flex items-center">
                         <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase border-r border-slate-800">Engine State</div>
                         <div className="px-4 py-2 font-mono text-emerald-500 font-bold">OPTIMIZED</div>
                    </div>
                    <button onClick={fetchWeights} className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl transition-all text-slate-400 active:scale-90">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CHART CARD */}
                <Card className="lg:col-span-8 bg-slate-900/40 border-slate-800 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="border-b border-slate-800/50 bg-slate-900/20">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" /> Vector Influence Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="h-[700px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.weights} layout="vertical" margin={{ left: 20, right: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                                    <XAxis type="number" hide domain={['auto', 'auto']} />
                                    <YAxis 
                                        dataKey="feature" 
                                        type="category" 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-dm-mono)' }}
                                        width={140}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#ffffff05' }}
                                        content={({ active, payload }) => {
                                            if (!active || !payload) return null;
                                            const d = payload[0].payload;
                                            return (
                                                <div className="bg-slate-950 border border-slate-800 p-4 shadow-2xl rounded-xl backdrop-blur-xl">
                                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{d.type}</p>
                                                    <p className="text-sm font-bold text-slate-100 mb-2">{d.feature}</p>
                                                    <div className="flex items-center gap-3 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                                                        <div className={`w-2 h-2 rounded-full ${d.weight >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_8px] ${d.weight >= 0 ? 'shadow-emerald-500/50' : 'shadow-rose-500/50'}`} />
                                                        <p className="text-xs font-mono font-bold text-slate-300">COEF: {d.weight.toFixed(6)}</p>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={14}>
                                        {data.weights.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.weight >= 0 ? '#10b981' : '#f43f5e'} 
                                                fillOpacity={0.7}
                                                className="transition-all duration-300 hover:fill-opacity-100"
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* SIDEBAR METRICS */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-slate-900/40 border-slate-800 shadow-xl overflow-hidden">
                        <div className={`h-1 w-full ${topFeature.weight >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Highest Impact Node</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className={`p-6 rounded-2xl relative overflow-hidden group ${topFeature.weight >= 0 ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-rose-500/5 border border-rose-500/20'}`}>
                                <Zap className={`absolute -right-2 -top-2 w-24 h-24 opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 ${topFeature.weight >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className={topFeature.weight >= 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}>
                                        DOMINANT FEATURE
                                    </Badge>
                                </div>
                                <h3 className="text-3xl font-black tracking-tighter text-slate-100 mb-2">{topFeature.feature}</h3>
                                <p className="text-xs leading-relaxed text-slate-400 font-medium">
                                    Statistically the strongest {topFeature.weight >= 0 ? 'positive' : 'negative'} trigger. High values in this field accelerate the probability vector toward the classification threshold.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Model Bias (Intercept)</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-mono font-black text-slate-100 tracking-tighter">{data.bias.toFixed(4)}</span>
                                    <div className="h-8 w-[1px] bg-slate-800" />
                                    <span className="text-[10px] font-bold text-slate-500 leading-tight uppercase">Base probability<br/>offset</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/40 border-slate-800 shadow-xl">
                        <CardHeader className="pb-3 border-b border-slate-800/50 bg-slate-900/20">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Weight Interpretation</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="flex gap-4">
                                <div className="w-1.5 h-12 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                                <div>
                                    <p className="text-xs font-black text-slate-200 uppercase tracking-tight mb-1">Positively Correlated</p>
                                    <p className="text-[11px] text-slate-400 leading-snug font-medium">Increases the log-odds of conversion. Values above 0 push the prediction toward "Hot Lead".</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1.5 h-12 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
                                <div>
                                    <p className="text-xs font-black text-slate-200 uppercase tracking-tight mb-1">Negatively Correlated</p>
                                    <p className="text-[11px] text-slate-400 leading-snug font-medium">Decreases conversion probability. These traits function as "inhibitors" in the model math.</p>
                                </div>
                            </div>
                            
                            <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
                                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                                    <span className="text-blue-400 font-bold uppercase mr-1">Admin Note:</span>
                                    Weights are re-calculated on every page reload to reflect the current <code className="text-slate-300 font-mono">weights.npy</code> state on the server.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default WeightsPage;
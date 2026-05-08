"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4 bg-background">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">De-serializing Weights...</p>
        </div>
    );

    if (error) return (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center p-6 text-center bg-background">
            <AlertCircle className="w-16 h-16 text-rose-500/20 mb-4" />
            <h2 className="text-2xl font-black text-foreground tracking-tight">Access Denied</h2>
            <p className="text-muted-foreground max-w-xs mt-2 font-medium">{error}</p>
            <button onClick={fetchWeights} className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all">
                Retry Handshake
            </button>
        </div>
    );

    const topFeature = data.weights[0];

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-20 px-6 pt-10 bg-background text-foreground transition-colors duration-300">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                        <Scale className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Linear Logic Visualization</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-foreground">Model Weights</h1>
                    <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed font-medium">
                        Coefficients extracted from <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded font-mono">weights.npy</code>. 
                        These represent the pull magnitude of specific features on the sigmoid output.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-muted/50 border border-border rounded-xl p-1 flex items-center">
                         <div className="px-4 py-2 text-[10px] font-black text-muted-foreground uppercase border-r border-border">Engine State</div>
                         <div className="px-4 py-2 font-mono text-emerald-500 font-bold">OPTIMIZED</div>
                    </div>
                    <button onClick={fetchWeights} className="p-3 bg-card border border-border hover:border-primary rounded-xl transition-all text-muted-foreground active:scale-90">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CHART CARD */}
                <Card className="lg:col-span-8 bg-card border-border shadow-2xl">
                    <CardHeader className="border-b border-border bg-muted/20">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" /> Vector Influence Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="h-[900px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.weights} layout="vertical" margin={{ left: 30, right: 40 }}>
                                    {/* FIXED: Using CSS variable for grid lines */}
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                    <XAxis type="number" hide domain={['auto', 'auto']} />
                                    <YAxis 
                                        dataKey="feature" 
                                        type="category" 
                                        axisLine={false}
                                        tickLine={false}
                                        interval={0}
                                        /* FIXED: Explicitly referencing the foreground variable for dark mode support */
                                        tick={{ 
                                            fill: 'currentColor', 
                                            fontSize: 10, 
                                            fontWeight: 800, 
                                            fontFamily: 'monospace' 
                                        }}
                                        className="text-foreground"
                                        width={160}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
                                        content={({ active, payload }) => {
                                            if (!active || !payload) return null;
                                            const d = payload[0].payload;
                                            return (
                                                <div className="bg-popover border border-border p-4 shadow-2xl rounded-xl backdrop-blur-xl">
                                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{d.type}</p>
                                                    <p className="text-sm font-bold text-popover-foreground mb-2">{d.feature}</p>
                                                    <div className="flex items-center gap-3 bg-muted px-3 py-2 rounded-lg border border-border">
                                                        <div className={`w-2 h-2 rounded-full ${d.weight >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_8px] ${d.weight >= 0 ? 'shadow-emerald-500/50' : 'shadow-rose-500/50'}`} />
                                                        <p className="text-xs font-mono font-bold text-foreground">COEF: {d.weight.toFixed(6)}</p>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={12}>
                                        {data.weights.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.weight >= 0 ? '#10b981' : '#f43f5e'} 
                                                fillOpacity={0.8}
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
                    <Card className="bg-card border-border shadow-xl overflow-hidden">
                        <div className={`h-1 w-full ${topFeature.weight >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Highest Impact Node</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className={`p-6 rounded-2xl relative overflow-hidden group ${topFeature.weight >= 0 ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-rose-500/5 border border-rose-500/20'}`}>
                                <Zap className={`absolute -right-2 -top-2 w-24 h-24 opacity-[0.08] rotate-12 transition-transform group-hover:scale-110 ${topFeature.weight >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant="outline" className={topFeature.weight >= 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-rose-500/10 text-rose-500 border-rose-500/30'}>
                                        DOMINANT FEATURE
                                    </Badge>
                                </div>
                                <h3 className="text-3xl font-black tracking-tighter text-foreground mb-2">{topFeature.feature}</h3>
                                <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                                    Statistically the strongest {topFeature.weight >= 0 ? 'positive' : 'negative'} trigger. High values in this field accelerate the probability vector toward the classification threshold.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Model Bias (Intercept)</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-mono font-black text-foreground tracking-tighter">{data.bias.toFixed(4)}</span>
                                    <div className="h-8 w-[1px] bg-border" />
                                    <span className="text-[10px] font-bold text-muted-foreground leading-tight uppercase">Base probability<br/>offset</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-xl">
                        <CardHeader className="pb-3 border-b border-border bg-muted/20">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Weight Interpretation</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="flex gap-4">
                                <div className="w-1.5 h-12 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                                <div>
                                    <p className="text-xs font-black text-foreground uppercase tracking-tight mb-1">Positively Correlated</p>
                                    <p className="text-[11px] text-muted-foreground leading-snug font-medium">Increases the log-odds of conversion. Values above 0 push the prediction toward "Hot Lead".</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1.5 h-12 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
                                <div>
                                    <p className="text-xs font-black text-foreground uppercase tracking-tight mb-1">Negatively Correlated</p>
                                    <p className="text-[11px] text-muted-foreground leading-snug font-medium">Decreases conversion probability. These traits function as "inhibitors" in the model math.</p>
                                </div>
                            </div>
                            
                            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
                                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                                    <span className="text-primary font-bold uppercase mr-1">Admin Note:</span>
                                    Weights are re-calculated on every page reload to reflect the current <code className="text-foreground/70 font-mono">weights.npy</code> state.
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
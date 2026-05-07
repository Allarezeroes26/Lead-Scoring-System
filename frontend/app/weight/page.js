"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Model Math...</p>
        </div>
    );

    if (error) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Connection Error</h2>
            <p className="text-slate-500 max-w-xs mt-2">{error}</p>
            <button onClick={fetchWeights} className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Retry Connection</button>
        </div>
    );

    const topFeature = data.weights[0];

    return (
        <div className="w-full min-h-screen bg-white p-4 lg:p-8 space-y-8">
            {/* HEADER */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Scale className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Logistic Regression Coefficients</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Model Weights</h1>
                    <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
                        These coefficients are pulled directly from <code>weights.npy</code>. They represent how much each attribute pulls a lead toward "Conversion" vs "No Conversion".
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 py-1.5 px-3">
                        Threshold: {data.threshold}
                    </Badge>
                    <button onClick={fetchWeights} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CHART CARD */}
                <Card className="lg:col-span-8 shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-slate-400" /> Feature Weight Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[650px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.weights} layout="vertical" margin={{ left: 40, right: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide domain={['auto', 'auto']} />
                                    <YAxis 
                                        dataKey="feature" 
                                        type="category" 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                        width={120}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }}
                                        content={({ active, payload }) => {
                                            if (!active || !payload) return null;
                                            const d = payload[0].payload;
                                            return (
                                                <div className="bg-white border border-slate-200 p-3 shadow-xl rounded-xl">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{d.type}</p>
                                                    <p className="text-sm font-bold text-slate-900 mb-1">{d.feature}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${d.weight >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                                        <p className="text-xs font-mono font-bold">COEF: {d.weight.toFixed(4)}</p>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={20}>
                                        {data.weights.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.weight >= 0 ? '#10b981' : '#f43f5e'} 
                                                fillOpacity={0.8}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* SIDEBAR */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Key Insight</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className={`p-5 rounded-2xl border ${topFeature.weight >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className={`w-5 h-5 ${topFeature.weight >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
                                    <span className="text-xs font-black uppercase tracking-tight">Top Driver</span>
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-1">{topFeature.feature}</h3>
                                <p className="text-xs leading-relaxed text-slate-600 font-medium">
                                    This feature has the strongest {topFeature.weight >= 0 ? 'positive' : 'negative'} correlation with conversion. This feature currently has the largest influence on the model’s prediction output.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Model Bias</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-mono font-black text-slate-900">{data.bias.toFixed(4)}</span>
                                    <span className="text-xs font-bold text-slate-400 italic">Intercept</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Interpreting Weights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-1 h-auto bg-emerald-500 rounded-full" />
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Positive Weights</p>
                                    <p className="text-[11px] text-slate-500 leading-snug">Presence of these traits (or higher values) increases the likelihood of a conversion.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 h-auto bg-rose-500 rounded-full" />
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Negative Weights</p>
                                    <p className="text-[11px] text-slate-500 leading-snug">Presence of these traits pushes the prediction toward a "Cold" status.</p>
                                </div>
                            </div>
                            <div className="mt-4 p-4 rounded-xl bg-blue-50 flex gap-3">
                                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                                <p className="text-[11px] font-medium text-blue-800 leading-normal">
                                    Note: Weights are normalized and scaled. "Duration" is often the strongest predictor in bank marketing models.
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
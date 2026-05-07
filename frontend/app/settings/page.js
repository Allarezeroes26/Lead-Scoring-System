"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { 
    Settings2, Sliders, Database, Beaker, 
    Save, RefreshCcw, ShieldAlert, Loader2,
    Sun, Moon, Laptop
} from "lucide-react";

const SettingsPage = () => {
    const [threshold, setThreshold] = useState(0.5);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings', { cache: 'no-store' });
                const data = await res.json();
                if (data.threshold !== undefined) setThreshold(data.threshold);
            } catch (err) {
                console.error("Failed to load settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ threshold }),
            });
            if (res.ok) alert(`Engine updated to ${threshold.toFixed(2)}`);
        } catch (err) {
            alert("Connection error.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* HEADER WITH THEME TRIGGER */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-slate-100">
                        <Settings2 className="w-9 h-9 text-blue-500" /> System Config
                    </h1>
                    <p className="text-slate-400 font-medium">
                        Calibrate LogitEngine weights and interface preferences.
                    </p>
                </div>

                {/* THEME TOGGLE GROUP */}
                <div className="flex bg-slate-900/50 border border-slate-800 p-1 rounded-xl backdrop-blur-sm">
                    {[
                        { name: 'light', icon: Sun },
                        { name: 'dark', icon: Moon },
                        { name: 'system', icon: Laptop }
                    ].map((t) => (
                        <Button
                            key={t.name}
                            variant="ghost"
                            size="sm"
                            onClick={() => setTheme(t.name)}
                            className={`rounded-lg px-3 ${theme === t.name ? 'bg-blue-600 text-white hover:bg-blue-500' : 'text-slate-400'}`}
                        >
                            <t.icon className="w-4 h-4" />
                        </Button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                
                {/* INFERENCE CALIBRATION */}
                <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm overflow-hidden shadow-2xl">
                    <CardHeader className="border-b border-slate-800/50 bg-slate-900/20">
                        <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-blue-400" />
                            <CardTitle className="text-slate-100">Inference Calibration</CardTitle>
                        </div>
                        <CardDescription className="text-slate-500">Adjust classification cutoffs.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <Label className="font-bold text-slate-300 text-sm tracking-wide">Sensitivity Threshold</Label>
                                <span className="font-mono text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg text-lg">
                                    {threshold.toFixed(2)}
                                </span>
                            </div>
                            <Slider 
                                value={[threshold]} 
                                onValueChange={(val) => setThreshold(val[0])}
                                max={1} 
                                step={0.01} 
                                className="py-4"
                            />
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                <p className="text-xs text-blue-400/80 leading-relaxed">
                                    <span className="font-bold">Logic:</span> Vectors with a sigmoid output &ge; {threshold.toFixed(2)} are flagged as 
                                    <span className="text-emerald-400 font-bold ml-1">High Intent</span>.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* READ ONLY SPECS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-950/50 border-slate-800 opacity-80">
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                                <Beaker className="w-4 h-4 text-emerald-500" /> Learning Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-mono font-bold text-slate-200">0.0015 &alpha;</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-950/50 border-slate-800 opacity-80">
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                                <Database className="w-4 h-4 text-indigo-400" /> Vector Source
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-mono text-slate-400 truncate">fastapi_bridge_v1.2/prod</div>
                        </CardContent>
                    </Card>
                </div>

                {/* DANGER ZONE - Re-styled for Dark Mode */}
                <div className="group p-6 border border-red-900/30 bg-red-950/10 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:bg-red-950/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-400">Hard Engine Reset</h4>
                            <p className="text-xs text-red-500/50">Reload weight vectors from disk default (.npy).</p>
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        className="border-red-900/50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl px-6 transition-all"
                    >
                        Reset Vectors
                    </Button>
                </div>
            </div>

            {/* FLOATING ACTION BAR */}
            <footer className="sticky bottom-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl flex justify-end gap-4 shadow-2xl shadow-black/50 z-50">
                <Button 
                    variant="ghost" 
                    className="rounded-xl text-slate-400 hover:text-slate-200"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCcw className="w-4 h-4 mr-2" /> Discard
                </Button>
                <Button 
                    disabled={saving}
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-12 font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Sync Engine
                </Button>
            </footer>
        </div>
    );
};

export default SettingsPage;
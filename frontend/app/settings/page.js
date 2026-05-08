"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
    const [resetting, setResetting] = useState(false); // Added state for reset
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

    // Logic for the Reset Button
    const handleReset = async () => {
        if (!confirm("Are you sure you want to reset weights to factory defaults?")) return;
        setResetting(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reset' }), // Sending reset command
            });
            if (res.ok) {
                alert("Vectors reset successfully.");
                window.location.reload();
            }
        } catch (err) {
            alert("Reset failed.");
        } finally {
            setResetting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 bg-background text-foreground transition-colors duration-300">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        <Settings2 className="w-9 h-9 text-primary" /> System Config
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Calibrate LogitEngine weights and interface preferences.
                    </p>
                </div>

                <div className="flex bg-muted border border-border p-1 rounded-xl backdrop-blur-sm">
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
                            className={`rounded-lg px-3 ${theme === t.name ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
                        >
                            <t.icon className="w-4 h-4" />
                        </Button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                <Card className="bg-card border-border backdrop-blur-sm overflow-hidden shadow-xl">
                    <CardHeader className="border-b border-border bg-muted/20">
                        <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-primary" />
                            <CardTitle>Inference Calibration</CardTitle>
                        </div>
                        <CardDescription className="text-muted-foreground">Adjust classification cutoffs.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <Label className="font-bold text-foreground text-sm tracking-wide">Sensitivity Threshold</Label>
                                <span className="font-mono text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg text-lg">
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
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    <span className="font-bold text-foreground">Logic:</span> Vectors with a sigmoid output &ge; {threshold.toFixed(2)} are flagged as 
                                    <span className="text-emerald-500 font-bold ml-1">High Intent</span>.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-card border-border">
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                                <Beaker className="w-4 h-4 text-emerald-500" /> Learning Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-mono font-bold text-foreground">0.0015 &alpha;</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                                <Database className="w-4 h-4 text-indigo-500" /> Vector Source
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-mono text-muted-foreground truncate">fastapi_bridge_v1.2/prod</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="group p-6 border border-destructive/20 bg-destructive/5 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:bg-destructive/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-destructive/10 rounded-2xl text-destructive border border-destructive/20">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-destructive">Hard Engine Reset</h4>
                            <p className="text-xs text-muted-foreground">Reload weight vectors from disk default (.npy).</p>
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        disabled={resetting}
                        onClick={handleReset}
                        className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl px-6 transition-all"
                    >
                        {resetting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Reset Vectors"}
                    </Button>
                </div>
            </div>

            <footer className="sticky bottom-8 bg-card/80 backdrop-blur-xl border border-border p-4 rounded-2xl flex justify-end gap-4 shadow-xl z-50">
                <Button 
                    variant="ghost" 
                    className="rounded-xl text-muted-foreground hover:text-foreground"
                    onClick={() => window.location.reload()}
                >
                    <RefreshCcw className="w-4 h-4 mr-2" /> Discard
                </Button>
                <Button 
                    disabled={saving}
                    onClick={handleSave}
                    className="bg-primary hover:opacity-90 text-primary-foreground rounded-xl px-12 font-bold shadow-lg active:scale-95 transition-all"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Sync Engine
                </Button>
            </footer>
        </div>
    );
};

export default SettingsPage;
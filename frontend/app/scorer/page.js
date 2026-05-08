"use client"

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
    Loader2, User, Banknote, PhoneCall, Lightbulb, 
    RotateCcw, History, ShieldCheck, Activity, Target, ChevronDown
} from "lucide-react";

const initialState = {
    age: "30", job: "management", marital: "married", education: "secondary",
    default: "no", balance: "0", housing: "no", loan: "no",
    contact: "cellular", day: "1", month: "jan", duration: "180",
    campaign: "1", pdays: "-1", previous: "0", poutcome: "unknown",
};

const PredictPage = () => {
    const [form, setForm] = useState(initialState);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [animatedScore, setAnimatedScore] = useState(0);

    // Styling for select fields to ensure they are visible in light mode
    const selectClass = "flex h-11 w-full items-center justify-between rounded-md border border-input bg-muted/40 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer font-mono uppercase font-bold text-foreground";

    useEffect(() => {
        const saved = localStorage.getItem("leadHistory");
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (result) {
            setAnimatedScore(0);
            const target = (result.score || 0) * 100;
            const animate = () => {
                setAnimatedScore(prev => {
                    const next = prev + (target - prev) * 0.1;
                    if (Math.abs(target - next) < 0.1) return target;
                    requestAnimationFrame(animate);
                    return next;
                });
            };
            requestAnimationFrame(animate);
        }
    }, [result]);

    const ui = useMemo(() => {
        const s = result?.status?.toLowerCase();
        if (s === "hot") return { 
            advice: "Priority Lead! Follow up within 2 hours.", 
            color: "text-emerald-600 dark:text-emerald-400", 
            glow: "shadow-emerald-500/10",
            bg: "bg-emerald-500/5", 
            border: "border-emerald-500/20", 
            accent: "bg-emerald-500" 
        };
        if (s === "warm") return { 
            advice: "Interested. Send a personalized offer today.", 
            color: "text-amber-600 dark:text-amber-400", 
            glow: "shadow-amber-500/10",
            bg: "bg-amber-500/5", 
            border: "border-amber-500/20", 
            accent: "bg-amber-500" 
        };
        return { 
            advice: "Low engagement. Add to nurturing drip campaign.", 
            color: "text-primary", 
            glow: "shadow-primary/10",
            bg: "bg-primary/5", 
            border: "border-primary/20", 
            accent: "bg-primary" 
        };
    }, [result]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/predict', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(form) 
            });
            const data = await response.json();
            setResult(data);
            const newHistory = [{ ...data, date: new Date().toLocaleTimeString(), formData: form }, ...history].slice(0, 10);
            setHistory(newHistory);
            localStorage.setItem("leadHistory", JSON.stringify(newHistory));
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-mono transition-colors duration-300">
            <div className="max-w-[1600px] mx-auto space-y-10 pb-20 px-6 pt-10">
                
                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <Activity className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Inference Module</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter">Lead Predictor</h1>
                        <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed font-medium">
                            Real-time behavioral analysis. Enter customer metadata below to calculate conversion probability.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-card border border-border rounded-xl p-1 flex items-center shadow-sm">
                             <div className="px-4 py-2 text-[10px] font-black text-muted-foreground uppercase border-r border-border">System Ready</div>
                             <div className="px-4 py-2 font-mono text-primary font-bold">STABLE_V1</div>
                        </div>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-12 w-12 rounded-xl border-border bg-card hover:bg-accent hover:text-accent-foreground" 
                            onClick={() => { setForm(initialState); setResult(null); }}
                        >
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* INPUT SECTION */}
                    <div className="lg:col-span-7 space-y-8">
                        <Card className="border-border bg-card shadow-xl overflow-hidden">
                            <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-transparent opacity-80" />
                            <form onSubmit={handleSubmit}>
                                <CardContent className="p-8 space-y-10">
                                    
                                    {/* Demographics Group */}
                                    <div className="space-y-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                            <User className="w-4 h-4" /> Demographics & Profile
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Age</Label>
                                                <Input type="number" className="h-11 bg-muted/30 border-input text-foreground font-mono" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} />
                                            </div>
                                            <div className="space-y-2 relative">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Employment</Label>
                                                <div className="relative">
                                                    <select value={form.job} onChange={(e) => setForm({...form, job: e.target.value})} className={selectClass}>
                                                        {["admin", "technician", "services", "management", "retired", "blue-collar", "unemployed", "entrepreneur", "housemaid", "student", "self-employed", "unknown"].map(j => <option key={j} value={j}>{j.toUpperCase()}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 relative">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Marital Status</Label>
                                                <div className="relative">
                                                    <select value={form.marital} onChange={(e) => setForm({...form, marital: e.target.value})} className={selectClass}>
                                                        {["single", "married", "divorced"].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 relative">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Education Level</Label>
                                                <div className="relative">
                                                    <select value={form.education} onChange={(e) => setForm({...form, education: e.target.value})} className={selectClass}>
                                                        {["primary", "secondary", "tertiary", "unknown"].map(ed => <option key={ed} value={ed}>{ed.toUpperCase()}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 relative">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Primary Contact</Label>
                                                <div className="relative">
                                                    <select value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} className={selectClass}>
                                                        {["cellular", "telephone", "unknown"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-border" />

                                    {/* Financials Group */}
                                    <div className="space-y-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                            <Banknote className="w-4 h-4" /> Financial Standing
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Balance</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-3 text-[10px] font-mono text-emerald-600 font-bold">$</span>
                                                    <Input type="number" className="pl-8 h-11 bg-muted/30 border-input text-foreground font-mono" value={form.balance} onChange={(e) => setForm({...form, balance: e.target.value})} />
                                                </div>
                                            </div>
                                            {['housing', 'loan', 'default'].map((field) => (
                                                <div key={field} className="space-y-2 relative">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">{field}</Label>
                                                    <div className="relative">
                                                        <select value={form[field]} onChange={(e) => setForm({...form, [field]: e.target.value})} className={selectClass}>
                                                            <option value="no">NO</option>
                                                            <option value="yes">YES</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator className="bg-border" />

                                    {/* Vector Metrics Group */}
                                    <div className="space-y-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                            <PhoneCall className="w-4 h-4" /> Vector Metrics
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Duration (s)</Label>
                                                <Input type="number" className="h-11 bg-muted/30 border-input text-foreground font-mono" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Campaign</Label>
                                                <Input type="number" className="h-11 bg-muted/30 border-input text-foreground font-mono" value={form.campaign} onChange={(e) => setForm({...form, campaign: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">P-Days</Label>
                                                <Input type="number" className="h-11 bg-muted/30 border-input text-foreground font-mono" value={form.pdays} onChange={(e) => setForm({...form, pdays: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Previous</Label>
                                                <Input type="number" className="h-11 bg-muted/30 border-input text-foreground font-mono" value={form.previous} onChange={(e) => setForm({...form, previous: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2 relative">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Month</Label>
                                                <div className="relative">
                                                    <select value={form.month} onChange={(e) => setForm({...form, month: e.target.value})} className={selectClass}>
                                                        {["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Day</Label>
                                                <Input type="number" className="h-11 bg-muted/30 border-input text-foreground font-mono" min="1" max="31" value={form.day} onChange={(e) => setForm({...form, day: e.target.value})} />
                                            </div>
                                            <div className="space-y-2 relative">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">P-Outcome</Label>
                                                <div className="relative">
                                                    <select value={form.poutcome} onChange={(e) => setForm({...form, poutcome: e.target.value})} className={selectClass}>
                                                        {["failure", "success", "other", "unknown"].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 opacity-50 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-16 font-black bg-primary text-primary-foreground hover:opacity-90 rounded-2xl shadow-lg transition-all text-lg active:scale-[0.99]" disabled={loading}>
                                        {loading ? <><Loader2 className="animate-spin mr-3 w-6 h-6" /> EXECUTING...</> : "CALCULATE PROBABILITY"}
                                    </Button>
                                </CardContent>
                            </form>
                        </Card>

                        {/* HISTORY SECTION */}
                        <Card className="border-border bg-card/50 overflow-hidden">
                            <CardHeader className="py-4 px-6 bg-muted/20 border-b border-border">
                                <CardTitle className="text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em] text-muted-foreground">
                                    <History className="w-4 h-4 text-primary" /> Observation History
                                </CardTitle>
                            </CardHeader>
                            <div className="max-h-[300px] overflow-y-auto">
                                <Table>
                                    <TableBody>
                                        {history.map((item, i) => (
                                            <TableRow key={i} className="border-border hover:bg-muted/10">
                                                <TableCell className="font-mono text-[10px] text-muted-foreground">{item.date}</TableCell>
                                                <TableCell><Badge variant="outline" className="text-[10px] font-mono border-border bg-background text-foreground uppercase">{item.formData?.job}</Badge></TableCell>
                                                <TableCell className="text-xs font-bold">{(item.score * 100).toFixed(0)}% MATCH</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black text-primary" onClick={() => setForm(item.formData)}>RECALL</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>

                    {/* RESULTS SECTION (Probability Vector & Recommendation) */}
                    <div className="lg:col-span-5">
                        {result ? (
                            <div className="lg:sticky lg:top-8 space-y-6 animate-in zoom-in-95 fade-in duration-500">
                                <Card className={`border-border bg-card overflow-hidden shadow-2xl transition-all duration-500 ${ui.glow}`}>
                                    <div className={`h-1.5 w-full ${ui.accent}`} />
                                    <CardContent className="p-10 space-y-12">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                                                <Target className="w-4 h-4 text-primary" /> Probability Vector
                                            </div>
                                            <h2 className={`text-9xl font-black tracking-tighter uppercase ${ui.color}`}>{result.status}</h2>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end px-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confidence</span>
                                                <span className="text-6xl font-mono font-black text-foreground tracking-tighter">{animatedScore.toFixed(1)}%</span>
                                            </div>
                                            <div className="h-4 bg-muted rounded-full border border-border p-1">
                                                <div className={`h-full rounded-full ${ui.accent} transition-all duration-500`} style={{ width: `${animatedScore}%` }} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card border-border shadow-xl relative overflow-hidden">
                                    <div className={`absolute left-0 top-0 w-1 h-full ${ui.accent}`} />
                                    <CardContent className="p-8 flex gap-6">
                                        <div className={`p-4 rounded-2xl border ${ui.border} ${ui.bg} self-start`}>
                                            <Lightbulb className={`w-8 h-8 ${ui.color}`} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className={`font-black text-[10px] uppercase tracking-[0.2em] ${ui.color}`}>System Recommendation</p>
                                            <p className="text-xl font-bold leading-snug text-foreground">"{ui.advice}"</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="lg:sticky lg:top-8 h-[600px] border-2 border-dashed border-border bg-muted/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 transition-all">
                                 <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full" />
                                    <div className="relative w-24 h-24 bg-card rounded-3xl flex items-center justify-center border border-border shadow-sm">
                                        <ShieldCheck className="w-12 h-12 text-muted-foreground/30" />
                                    </div>
                                 </div>
                                <h3 className="text-2xl font-black text-muted-foreground uppercase tracking-tighter">Engine Standby</h3>
                                <p className="mt-4 text-muted-foreground text-[10px] font-mono uppercase tracking-widest leading-relaxed">Awaiting input parameters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictPage;
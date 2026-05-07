"use client"

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
    Loader2, User, Banknote, PhoneCall, Lightbulb, 
    BarChart3, RotateCcw, BrainCircuit, History, Sparkles,
    ShieldCheck, Activity, Target
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
            color: "text-emerald-400", 
            glow: "shadow-emerald-500/20",
            bg: "bg-emerald-500/5", 
            border: "border-emerald-500/20", 
            accent: "bg-emerald-500" 
        };
        if (s === "warm") return { 
            advice: "Interested. Send a personalized offer today.", 
            color: "text-amber-400", 
            glow: "shadow-amber-500/20",
            bg: "bg-amber-500/5", 
            border: "border-amber-500/20", 
            accent: "bg-amber-500" 
        };
        return { 
            advice: "Low engagement. Add to nurturing drip campaign.", 
            color: "text-blue-400", 
            glow: "shadow-blue-500/20",
            bg: "bg-blue-500/5", 
            border: "border-blue-500/20", 
            accent: "bg-blue-600" 
        };
    }, [result]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            ...form,
            age: parseInt(form.age),
            balance: parseFloat(form.balance),
            day: parseInt(form.day),
            duration: parseInt(form.duration),
            campaign: parseInt(form.campaign),
            pdays: parseInt(form.pdays),
            previous: parseInt(form.previous),
            default: form.default === "yes",
            housing: form.housing === "yes",
            loan: form.loan === "yes",
        };

        try {
            const response = await fetch('/api/predict', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });
            const data = await response.json();
            setResult(data);
            const newHistory = [{ ...data, date: new Date().toLocaleTimeString(), formData: form }, ...history].slice(0, 10);
            setHistory(newHistory);
            localStorage.setItem("leadHistory", JSON.stringify(newHistory));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 pb-20 selection:bg-blue-500/30">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-500">
                        <Activity className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Inference Module</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-100">Lead Predictor</h1>
                    <p className="text-slate-400 text-sm max-w-2xl leading-relaxed font-medium">
                        Real-time behavioral analysis. Enter customer metadata below to calculate conversion probability using current model weights.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-1 flex items-center">
                         <div className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase border-r border-slate-800">System Ready</div>
                         <div className="px-4 py-2 font-mono text-blue-500 font-bold">STABLE_V1</div>
                    </div>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-800 bg-slate-900 text-slate-400 hover:text-white" onClick={() => { setForm(initialState); setResult(null); }}>
                        <RotateCcw className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* INPUT SECTION */}
                <div className="lg:col-span-7 space-y-8">
                    <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-2xl overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />
                        <form onSubmit={handleSubmit}>
                            <CardContent className="p-8 space-y-10">
                                {/* Profile Group */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Demographics & Profile
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Age</Label>
                                            <Input type="number" className="h-11 bg-slate-950 border-slate-800 text-slate-100 focus:ring-blue-500/20 font-mono" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Employment</Label>
                                            <select value={form.job} onChange={(e) => setForm({...form, job: e.target.value})} className="flex h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-blue-500/20">
                                                {["admin", "technician", "services", "management", "retired", "blue-collar", "unemployed", "entrepreneur", "housemaid", "student", "self-employed", "unknown"].map(j => <option key={j} value={j} className="bg-slate-950">{j.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Marital Status</Label>
                                            <select value={form.marital} onChange={(e) => setForm({...form, marital: e.target.value})} className="flex h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none">
                                                {["single", "married", "divorced"].map(m => <option key={m} value={m} className="bg-slate-950">{m.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Education Level</Label>
                                            <select value={form.education} onChange={(e) => setForm({...form, education: e.target.value})} className="flex h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none">
                                                {["primary", "secondary", "tertiary", "unknown"].map(ed => <option key={ed} value={ed} className="bg-slate-950">{ed.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Primary Contact</Label>
                                            <select value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} className="flex h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none">
                                                {["cellular", "telephone", "unknown"].map(c => <option key={c} value={c} className="bg-slate-950">{c.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-slate-800/50" />

                                {/* Financials Group */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                                        <Banknote className="w-4 h-4" /> Financial Standing
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Balance</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-[10px] font-mono text-emerald-500/50">$</span>
                                                <Input type="number" className="pl-8 h-11 bg-slate-950 border-slate-800 text-slate-100 font-mono" value={form.balance} onChange={(e) => setForm({...form, balance: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Housing</Label>
                                            <select value={form.housing} onChange={(e) => setForm({...form, housing: e.target.value})} className="flex h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none"><option value="no">NO</option><option value="yes">YES</option></select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Loan</Label>
                                            <select value={form.loan} onChange={(e) => setForm({...form, loan: e.target.value})} className="flex h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none"><option value="no">NO</option><option value="yes">YES</option></select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Default</Label>
                                            <select value={form.default} onChange={(e) => setForm({...form, default: e.target.value})} className="flex h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none"><option value="no">NO</option><option value="yes">YES</option></select>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-slate-800/50" />

                                {/* Campaign Group */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
                                        <PhoneCall className="w-4 h-4" /> Vector Metrics
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-500">Duration (s)</Label><Input type="number" className="h-11 bg-slate-950 border-slate-800 text-slate-100 font-mono" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} /></div>
                                        <div className="space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-500">Campaign</Label><Input type="number" className="h-11 bg-slate-950 border-slate-800 text-slate-100 font-mono" value={form.campaign} onChange={(e) => setForm({...form, campaign: e.target.value})} /></div>
                                        <div className="space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-500">P-Days</Label><Input type="number" className="h-11 bg-slate-950 border-slate-800 text-slate-100 font-mono" value={form.pdays} onChange={(e) => setForm({...form, pdays: e.target.value})} /></div>
                                        <div className="space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-500">Previous</Label><Input type="number" className="h-11 bg-slate-950 border-slate-800 text-slate-100 font-mono" value={form.previous} onChange={(e) => setForm({...form, previous: e.target.value})} /></div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">Month</Label>
                                            <select value={form.month} onChange={(e) => setForm({...form, month: e.target.value})} className="flex h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none">
                                                {["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2"><Label className="text-[10px] uppercase font-bold text-slate-500">Day</Label><Input type="number" className="h-11 bg-slate-950 border-slate-800 text-slate-100 font-mono" min="1" max="31" value={form.day} onChange={(e) => setForm({...form, day: e.target.value})} /></div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-slate-500">P-Outcome</Label>
                                            <select value={form.poutcome} onChange={(e) => setForm({...form, poutcome: e.target.value})} className="h-11 w-full rounded-md border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 outline-none">
                                                {["failure", "success", "other", "unknown"].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-16 font-black bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.99] transition-all text-lg" disabled={loading}>
                                    {loading ? <><Loader2 className="animate-spin mr-3 w-6 h-6" /> EXECUTING INFERENCE...</> : "CALCULATE PROBABILITY"}
                                </Button>
                            </CardContent>
                        </form>
                    </Card>

                    {/* HISTORY SECTION */}
                    <Card className="border-slate-800 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="py-4 px-6 bg-slate-900/50 border-b border-slate-800 flex flex-row items-center justify-between">
                            <CardTitle className="text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em] text-slate-500">
                                <History className="w-4 h-4 text-blue-500" /> Observation History
                            </CardTitle>
                        </CardHeader>
                        <div className="max-h-[300px] overflow-y-auto">
                            <Table>
                                <TableBody>
                                    {history.map((item, i) => (
                                        <TableRow key={i} className="border-slate-800/50 hover:bg-slate-800/30">
                                            <TableCell className="font-mono text-[10px] text-slate-500">{item.date}</TableCell>
                                            <TableCell><Badge variant="outline" className="capitalize text-[10px] font-mono border-slate-700 bg-slate-950 text-slate-300">{item.formData?.job}</Badge></TableCell>
                                            <TableCell className="text-xs font-bold text-slate-300">{(item.score * 100).toFixed(0)}% MATCH</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8 px-4 text-[10px] font-black text-blue-400 hover:bg-blue-500/10" onClick={() => setForm(item.formData)}>
                                                    RECALL
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>

                {/* RESULTS SECTION */}
                <div className="lg:col-span-5">
                    {result ? (
                        <div className="lg:sticky lg:top-8 space-y-6 animate-in zoom-in-95 fade-in duration-500">
                            <Card className={`border-slate-800 ${ui.glow} bg-slate-900/60 backdrop-blur-xl overflow-hidden`}>
                                <div className={`h-1.5 w-full ${ui.accent} shadow-[0_0_15px] ${ui.glow}`} />
                                <CardContent className="p-10 space-y-12">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                                            <Target className="w-4 h-4 text-blue-500" /> Probability Vector
                                        </div>
                                        <h2 className={`text-9xl font-black tracking-tighter ${ui.color} drop-shadow-2xl`}>{result.status}</h2>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end px-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inference Confidence</span>
                                            <span className="text-6xl font-mono font-black text-slate-100 tracking-tighter">{animatedScore.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-4 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-1">
                                            <div 
                                                className={`h-full rounded-full ${ui.accent} transition-all duration-500 shadow-[0_0_10px] ${ui.glow}`} 
                                                style={{ width: `${animatedScore}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Raw Logits</p>
                                            <p className="text-xl font-mono font-black text-slate-300">{(result.score).toFixed(4)}</p>
                                        </div>
                                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Engine State</p>
                                            <p className="text-xl font-mono font-black text-emerald-500">OPTIMIZED</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={`bg-slate-950/80 border-slate-800 shadow-2xl relative overflow-hidden`}>
                                <div className={`absolute left-0 top-0 w-1 h-full ${ui.accent}`} />
                                <CardContent className="p-8 flex gap-6">
                                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl self-start">
                                        <Lightbulb className={`w-8 h-8 ${ui.color}`} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className={`font-black text-[10px] uppercase tracking-[0.2em] ${ui.color}`}>System Recommendation</p>
                                        <p className="text-xl font-bold leading-snug text-slate-100">"{ui.advice}"</p>
                                        <p className="text-xs text-slate-500 font-medium italic">Based on vector-matching with historical conversion traits.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="lg:sticky lg:top-8 h-[700px] border border-slate-800 bg-slate-900/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 group transition-all">
                             <div className="relative mb-8">
                                <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full group-hover:bg-blue-500/30 transition-all" />
                                <div className="relative w-24 h-24 bg-slate-950 rounded-3xl flex items-center justify-center border border-slate-800 shadow-2xl">
                                    <ShieldCheck className="w-12 h-12 text-slate-800 group-hover:text-blue-500 transition-colors" />
                                </div>
                             </div>
                            <h3 className="text-2xl font-black text-slate-500 tracking-tighter uppercase">Engine Standby</h3>
                            <div className="mt-4 flex flex-col items-center gap-2">
                                <div className="flex gap-1">
                                    {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-slate-800 rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                                </div>
                                <p className="text-slate-600 text-[10px] max-w-[240px] font-mono leading-relaxed uppercase tracking-widest">
                                    Awaiting input parameters for sigmoid function activation.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictPage;
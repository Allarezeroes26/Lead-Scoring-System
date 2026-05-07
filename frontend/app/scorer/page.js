"use client"

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Loader2, User, Banknote, PhoneCall, Lightbulb, 
    BarChart3, TrendingUp, History, RotateCcw, 
    BrainCircuit, SearchCheck, ArrowUpRight, CheckCircle2, AlertCircle
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
            const duration = 1000;
            const start = performance.now();
            const animate = (time) => {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                setAnimatedScore(progress * target);
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }, [result]);

    const ui = (() => {
        const s = result?.status?.toLowerCase();
        if (s === "hot") return { advice: "Priority Lead! Follow up within 2 hours.", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", accent: "bg-emerald-600" };
        if (s === "warm") return { advice: "Interested. Send a personalized offer today.", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", accent: "bg-amber-500" };
        return { advice: "Low engagement. Add to nurturing drip campaign.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", accent: "bg-blue-600" };
    })();

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
            // Boolean conversions for Pydantic
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
        <div className="w-full min-h-screen bg-white p-4 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* INPUT SECTION */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-6">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <BrainCircuit className="w-5 h-5 text-blue-600" /> Lead Predictor
                                </CardTitle>
                                <CardDescription>Customer Behavioral Analysis</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setForm(initialState); setResult(null); }}>
                                <RotateCcw className="w-4 h-4 mr-2" /> Reset
                            </Button>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-8">
                                
                                {/* 1. PROFILE */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><User className="w-3 h-3" /> Profile</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1.5"><Label className="text-xs">Age</Label><Input type="number" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} /></div>
                                        <div className="space-y-1.5"><Label className="text-xs">Job</Label>
                                            <select value={form.job} onChange={(e) => setForm({...form, job: e.target.value})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none">
                                                {["admin", "technician", "services", "management", "retired", "blue-collar", "unemployed", "entrepreneur", "housemaid", "student", "self-employed", "unknown"].map(j => <option key={j} value={j}>{j.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5"><Label className="text-xs">Marital</Label>
                                            <select value={form.marital} onChange={(e) => setForm({...form, marital: e.target.value})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none">
                                                {["single", "married", "divorced"].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label className="text-xs">Education</Label>
                                            <select value={form.education} onChange={(e) => setForm({...form, education: e.target.value})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none">
                                                {["primary", "secondary", "tertiary", "unknown"].map(ed => <option key={ed} value={ed}>{ed.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5"><Label className="text-xs">Contact Method</Label>
                                            <select value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none">
                                                {["cellular", "telephone", "unknown"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="opacity-50" />

                                {/* 2. FINANCIAL */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Banknote className="w-3 h-3" /> Financials</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="space-y-1.5"><Label className="text-xs">Balance</Label><Input type="number" value={form.balance} onChange={(e) => setForm({...form, balance: e.target.value})} /></div>
                                        <div className="space-y-1.5"><Label className="text-xs">Housing Loan</Label>
                                            <select value={form.housing} onChange={(e) => setForm({...form, housing: e.target.value})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"><option value="no">No</option><option value="yes">Yes</option></select>
                                        </div>
                                        <div className="space-y-1.5"><Label className="text-xs">Personal Loan</Label>
                                            <select value={form.loan} onChange={(e) => setForm({...form, loan: e.target.value})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"><option value="no">No</option><option value="yes">Yes</option></select>
                                        </div>
                                        <div className="space-y-1.5"><Label className="text-xs">Credit Default</Label>
                                            <select value={form.default} onChange={(e) => setForm({...form, default: e.target.value})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none"><option value="no">No</option><option value="yes">Yes</option></select>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="opacity-50" />

                                {/* 3. CAMPAIGN */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><PhoneCall className="w-3 h-3" /> Campaign Data</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1.5"><Label className="text-xs">Duration (s)</Label><Input type="number" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} /></div>
                                        <div className="space-y-1.5"><Label className="text-xs">Day</Label><Input type="number" min="1" max="31" value={form.day} onChange={(e) => setForm({...form, day: e.target.value})} /></div>
                                        <div className="space-y-1.5"><Label className="text-xs">Month</Label>
                                            <select value={form.month} onChange={(e) => setForm({...form, month: e.target.value})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none">
                                                {["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5"><Label className="text-xs">P-Outcome</Label>
                                            <select value={form.poutcome} onChange={(e) => setForm({...form, poutcome: e.target.value})} className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none">
                                                {["failure", "success", "other", "unknown"].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 font-bold shadow-lg" disabled={loading}>
                                    {loading ? <><Loader2 className="animate-spin mr-2" /> Analyzing...</> : "Generate Prediction"}
                                </Button>
                            </CardContent>
                        </form>
                    </Card>

                    {/* HISTORY SECTION */}
                    <Card className="shadow-sm border-slate-200 overflow-hidden">
                        <CardHeader className="py-3 px-6 bg-slate-50/50 border-b">
                            <CardTitle className="text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest text-slate-500"><History className="w-4 h-4" /> Recent History</CardTitle>
                        </CardHeader>
                        <div className="max-h-[250px] overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10"><TableRow><TableHead className="text-[10px]">Time</TableHead><TableHead className="text-[10px]">Lead</TableHead><TableHead className="text-[10px]">Score</TableHead><TableHead className="text-right text-[10px]">Action</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {history.map((item, i) => (
                                        <TableRow key={i} className="group transition-colors">
                                            <TableCell className="text-[10px] font-mono text-slate-400">{item.date}</TableCell>
                                            <TableCell><Badge variant="outline" className="capitalize text-[10px]">{item.formData?.job}</Badge></TableCell>
                                            <TableCell className="text-xs font-bold">{(item.score * 100).toFixed(0)}%</TableCell>
                                            <TableCell className="text-right"><Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => setForm(item.formData)}>Restore</Button></TableCell>
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
                        <div className="space-y-6 lg:sticky lg:top-8">
                            <Card className="overflow-hidden border-slate-200 shadow-xl relative">
                                <div className={`h-1.5 w-full ${ui.accent}`} />
                                <CardContent className="p-8 space-y-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Lead Type</p>
                                        <h2 className={`text-6xl font-black tracking-tighter ${ui.color}`}>{result.status}</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-slate-900">Probability</span>
                                            <span className="text-4xl font-mono font-black text-slate-900">{animatedScore.toFixed(1)}%</span>
                                        </div>
                                        <Progress value={animatedScore} className="h-3 bg-slate-100" indicatorClassName={ui.accent} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={`${ui.bg} ${ui.border} border shadow-sm`}>
                                <CardContent className="p-6 flex gap-5">
                                    <div className="bg-white p-3 rounded-xl shadow-sm self-start"><Lightbulb className={`w-6 h-6 ${ui.color}`} /></div>
                                    <div className="space-y-1">
                                        <p className={`font-black text-[10px] uppercase tracking-widest ${ui.color}`}>Strategy</p>
                                        <p className="text-sm font-bold leading-relaxed text-slate-900 leading-snug italic">"{ui.advice}"</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="lg:sticky lg:top-8 h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
                            <BarChart3 className="w-10 h-10 text-slate-200 mb-4" />
                            <p className="font-bold text-sm uppercase tracking-widest text-slate-400">Ready for Input</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictPage;
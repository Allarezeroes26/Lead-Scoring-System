"use client"

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Loader2, User, Banknote, PhoneCall, Lightbulb, 
    BarChart3, TrendingUp, History, RotateCcw, 
    Calendar, BrainCircuit, SearchCheck, ArrowUpRight 
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

    const getLeadAdvice = (status) => {
        const s = status?.toLowerCase();
        if (s === "hot") return { advice: "Priority Lead! Follow up within 2 hours.", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
        if (s === "warm") return { advice: "Interested. Send a personalized offer today.", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
        return { advice: "Low engagement. Add to nurturing drip campaign.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    };

    const advice = getLeadAdvice(result?.status);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formattedForm = Object.fromEntries(Object.entries(form).map(([k, v]) => [
            k, ["age", "balance", "day", "duration", "campaign", "pdays", "previous"].includes(k) ? parseInt(v) || 0 : v
        ]));

        try {
            const response = await fetch('/api/predict', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(formattedForm) 
            });
            const data = await response.json();
            setResult(data);

            const newHistory = [{ ...data, date: new Date().toLocaleTimeString(), formData: form }, ...history].slice(0, 5);
            setHistory(newHistory);
            localStorage.setItem("leadHistory", JSON.stringify(newHistory));
        } catch (err) { 
            console.error(err); 
        } finally { 
            setLoading(false); 
        }
    };

    // Logic for "Why" the score happened
    const getFactors = () => {
        const factors = [];
        if (parseInt(form.duration) > 300) factors.push("Long call duration suggests high interest");
        if (form.poutcome === "success") factors.push("Previous successful campaign interaction");
        if (parseInt(form.balance) > 2000) factors.push("Strong financial balance reduces friction");
        if (form.housing === "no") factors.push("No housing loan increases disposable income");
        if (factors.length === 0) factors.push("Standard demographic baseline");
        return factors.slice(0, 3);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: FORM INPUTS */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <BrainCircuit className="w-5 h-5 text-primary" /> ML Lead Analyzer
                                </CardTitle>
                                <CardDescription>Input lead characteristics for propensity modeling.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => { setForm(initialState); setResult(null); }}>
                                <RotateCcw className="w-4 h-4 mr-2" /> Reset
                            </Button>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-5">
                                {/* Section: Demographics */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <User className="w-3 h-3" /> Profile Info
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Age</Label>
                                            <Input className="h-8" type="number" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Job Role</Label>
                                            <select value={form.job} onChange={(e) => setForm({...form, job: e.target.value})} className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs">
                                                {["admin.", "blue-collar", "management", "retired", "technician", "services", "unemployed", "student", "unknown"].map(j => (
                                                    <option key={j} value={j}>{j.replace('.', '').toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Marital Status</Label>
                                            <select value={form.marital} onChange={(e) => setForm({...form, marital: e.target.value})} className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs">
                                                <option value="married">Married</option>
                                                <option value="single">Single</option>
                                                <option value="divorced">Divorced</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Education Level</Label>
                                            <select value={form.education} onChange={(e) => setForm({...form, education: e.target.value})} className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs">
                                                <option value="primary">Primary</option>
                                                <option value="secondary">Secondary</option>
                                                <option value="tertiary">Tertiary</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Section: Financials */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Banknote className="w-3 h-3" /> Financial Risk
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Annual Balance</Label>
                                            <Input className="h-8" type="number" value={form.balance} onChange={(e) => setForm({...form, balance: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Housing Loan</Label>
                                            <select value={form.housing} onChange={(e) => setForm({...form, housing: e.target.value})} className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs">
                                                <option value="no">No</option><option value="yes">Yes</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Personal Loan</Label>
                                            <select value={form.loan} onChange={(e) => setForm({...form, loan: e.target.value})} className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs">
                                                <option value="no">No</option><option value="yes">Yes</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Section: Engagement */}
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <PhoneCall className="w-3 h-3" /> Engagement Data
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Duration (sec)</Label>
                                            <Input className="h-8" type="number" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Month</Label>
                                            <select value={form.month} onChange={(e) => setForm({...form, month: e.target.value})} className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                                                {["jan","may","aug","nov"].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Campaign Contacts</Label>
                                            <Input className="h-8" type="number" value={form.campaign} onChange={(e) => setForm({...form, campaign: e.target.value})} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Prev Outcome</Label>
                                            <select value={form.poutcome} onChange={(e) => setForm({...form, poutcome: e.target.value})} className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                                                <option value="unknown">Unknown</option>
                                                <option value="success">Success</option>
                                                <option value="failure">Failure</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-10 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={loading}>
                                    {loading ? <><Loader2 className="animate-spin mr-2 w-4 h-4" /> Running Models...</> : "Analyze Lead Propensity"}
                                </Button>
                            </CardContent>
                        </form>
                    </Card>

                    {/* HISTORY TABLE */}
                    <Card className="border-slate-200">
                        <CardHeader className="py-3">
                            <CardTitle className="text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest text-slate-500">
                                <History className="w-3 h-3" /> Recent Analyses
                            </CardTitle>
                        </CardHeader>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead className="h-8 text-[10px]">Timestamp</TableHead>
                                    <TableHead className="h-8 text-[10px]">Lead Type</TableHead>
                                    <TableHead className="h-8 text-[10px]">Model Score</TableHead>
                                    <TableHead className="h-8 text-[10px] text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-4 text-slate-400 text-xs italic">No history available</TableCell></TableRow>
                                ) : (
                                    history.map((item, i) => (
                                        <TableRow key={i} className="group">
                                            <TableCell className="text-[10px] font-mono">{item.date}</TableCell>
                                            <TableCell className="capitalize text-[10px] font-medium">{item.formData?.job || 'N/A'}</TableCell>
                                            <TableCell className="text-xs font-bold">{(item.score * 100).toFixed(0)}%</TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 px-2 text-[10px] hover:bg-primary hover:text-white"
                                                    onClick={() => setForm(item.formData)}
                                                >
                                                    <SearchCheck className="w-3 h-3 mr-1" /> Restore
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                {/* RIGHT: RESULTS & EXPLANATION */}
                <div className="lg:col-span-5">
                    {result ? (
                        <div className="space-y-6 lg:sticky lg:top-8 animate-in slide-in-from-bottom-4 duration-500">
                            <Card className="overflow-hidden border-none shadow-2xl bg-white dark:bg-slate-900">
                                <div className={`h-2 w-full ${advice.bg} transition-colors duration-1000`} />
                                <CardContent className="p-8">
                                    <div className="mb-6">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Conversion Status</p>
                                        <h2 className={`text-6xl font-black tracking-tighter ${advice.color}`}>{result.status}</h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-xs font-bold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Success Probability</span>
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                    {animatedScore > 75 && "✓ High likelihood of conversion"}
                                                    {animatedScore > 40 && animatedScore <= 75 && "⚠ Moderate interest detected"}
                                                    {animatedScore <= 40 && "✖ Low engagement probability"}
                                                </p>
                                            </div>
                                            <span className="text-4xl font-mono font-black">{animatedScore.toFixed(1)}%</span>
                                        </div>
                                        <Progress value={animatedScore} className="h-3 rounded-full" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* "The Why" Panel */}
                            <Card className="p-5 border-slate-200 shadow-sm">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                                    <ArrowUpRight className="w-3 h-3" /> Key Influencing Factors
                                </p>
                                <ul className="space-y-2">
                                    {getFactors().map((factor, idx) => (
                                        <li key={idx} className="text-xs flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                            <span className="text-primary mt-0.5">•</span> {factor}
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            {/* Strategy Card */}
                            <Card className={`${advice.bg} ${advice.border} border-2 shadow-sm`}>
                                <CardContent className="p-5 flex gap-4">
                                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm self-start">
                                        <Lightbulb className={`w-5 h-5 ${advice.color}`} />
                                    </div>
                                    <div>
                                        <p className={`font-black text-[10px] uppercase tracking-widest mb-1 ${advice.color}`}>Strategy Insight</p>
                                        <p className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100 italic">
                                            "{advice.advice}"
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="lg:sticky lg:top-8 h-[450px] border-dashed border-2 rounded-2xl flex flex-col items-center justify-center text-slate-300 bg-slate-50/50">
                            <div className="p-6 bg-white rounded-full shadow-inner mb-4">
                                <BarChart3 className="w-12 h-12 opacity-10" />
                            </div>
                            <p className="font-bold text-slate-400 text-sm">System Ready</p>
                            <p className="text-[10px] text-slate-400 max-w-[180px] text-center mt-2 leading-relaxed uppercase tracking-tighter">
                                Fill lead data to generate predictive scoring and strategy insight.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictPage;
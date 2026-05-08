"use client"

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { 
    Loader2, Upload, Database, Download, Eye,
    BarChart3, CheckCircle2, TrendingUp, Info, Layers, Activity
} from "lucide-react";

export default function BatchPage() {
    const [rawData, setRawData] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");
    const [delimiter, setDelimiter] = useState(",");
    const [filter, setFilter] = useState("all");

    const tabClass = (active) => `flex-1 py-2 text-[10px] font-black rounded-md transition-all border ${active ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/50"}`;

    const downloadTemplate = () => {
        const headers = "age,job,marital,education,default,balance,housing,loan,contact,day,month,duration,campaign,pdays,previous,poutcome";
        const blob = new Blob([headers], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'lead_template.csv');
        a.click();
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target.result;
                const rows = text.split(/\r?\n/).filter(row => row.trim() !== "");
                if (rows.length < 2) throw new Error("CSV is empty.");

                const headers = rows[0].split(delimiter).map(h => h.trim().replace(/^["'](.+)["']$/, '$1').toLowerCase());
                
                const json = rows.slice(1).map(row => {
                    const values = row.split(delimiter).map(v => v.trim().replace(/^["'](.+)["']$/, '$1'));
                    const entry = headers.reduce((obj, header, i) => {
                        obj[header] = values[i];
                        return obj;
                    }, {});

                    const getVal = (keys, fallback) => {
                        const foundKey = keys.find(k => entry[k] !== undefined);
                        return entry[foundKey] ?? fallback;
                    };

                    return {
                        age: Number(getVal(['age'], 30)),
                        job: getVal(['job', 'occupation'], "unknown"),
                        marital: getVal(['marital'], 'single'),
                        education: getVal(['education'], "unknown"),
                        default: getVal(['default'], "no"),
                        balance: Number(getVal(['balance'], 0)),
                        housing: getVal(['housing'], "no"),
                        loan: getVal(['loan'], "no"),
                        contact: getVal(['contact'], "unknown"),
                        day: Number(getVal(['day'], 1)),
                        month: getVal(['month'], "may"),
                        duration: Number(getVal(['duration'], 0)),
                        campaign: Number(getVal(['campaign'], 1)),
                        pdays: Number(getVal(['pdays'], -1)),
                        previous: Number(getVal(['previous'], 0)),
                        poutcome: getVal(['poutcome'], "unknown")
                    };
                });

                setRawData(json);
                setResults([]);
                setProgress(0);
            } catch (err) {
                alert("Parsing Error: " + err.message);
            }
        };
        reader.readAsText(file);
    };

    const processBatch = async () => {
        if (rawData.length === 0) return;
        setLoading(true);
        const chunkSize = 250; 
        let allResults = [];

        try {
            for (let i = 0; i < rawData.length; i += chunkSize) {
                const chunk = rawData.slice(i, i + chunkSize);
                const response = await fetch("/api/predict_batch", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(chunk),
                });

                if (!response.ok) throw new Error(`Batch processing failed`);
                
                const predictions = await response.json();
                const mergedChunk = predictions.map((res, index) => ({
                    ...chunk[index],
                    ...res
                }));

                allResults = [...allResults, ...mergedChunk];
                setResults([...allResults]); 
                setProgress(Math.round(((i + chunk.length) / rawData.length) * 100));
            }
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
            const batchRecord = {
                fileName: fileName,
                date: new Date().toLocaleString(),
                results: allResults
            };
            const existingHistory = JSON.parse(localStorage.getItem("scoring_history") || "[]");
            localStorage.setItem("scoring_history", JSON.stringify([...existingHistory, batchRecord]));
        }
    };

    const processedResults = useMemo(() => {
        let list = [...results].sort((a, b) => b.score - a.score);
        if (filter === "hot") return list.filter(r => r.status?.toLowerCase() === "hot");
        if (filter === "warm") return list.filter(r => r.status?.toLowerCase() === "warm");
        return list;
    }, [results, filter]);

    const stats = useMemo(() => {
        if (results.length === 0) return null;
        return {
            total: results.length,
            hot: results.filter(r => r.status?.toLowerCase() === "hot").length,
            warm: results.filter(r => r.status?.toLowerCase() === "warm").length,
            avgProb: results.reduce((acc, curr) => acc + curr.score, 0) / results.length,
            distribution: {
                low: results.filter(r => r.score < 0.4).length,
                mid: results.filter(r => r.score >= 0.4 && r.score < 0.7).length,
                high: results.filter(r => r.score >= 0.7).length,
            }
        };
    }, [results]);

    return (
        <div className="min-h-screen bg-background text-foreground font-mono p-4 md:p-10 transition-colors">
            <div className="max-w-[1600px] mx-auto space-y-10">
                
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <Layers className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Batch Processing Unit</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-foreground">Intelligence Batch</h1>
                        <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed font-medium">
                            High-volume propellant scoring. Upload CSV datasets for multi-threaded neural inference.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* CONTROL PANEL */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="border-border bg-card shadow-xl overflow-hidden">
                            <div className="h-1 w-full bg-gradient-to-r from-primary to-transparent opacity-80" />
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Engine Configuration</CardTitle>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Info className="w-4 h-4" /></Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-card border-border font-mono">
                                            <DialogHeader>
                                                <DialogTitle className="text-foreground uppercase font-black">Data Requirements</DialogTitle>
                                                <DialogDescription className="text-muted-foreground">The engine expects standard lead features (Age, Balance, Duration, etc.)</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <Button onClick={downloadTemplate} className="w-full font-bold h-12" variant="outline">
                                                    <Download className="w-4 h-4 mr-2" /> Download Template
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Delimiter Protocol</label>
                                    <div className="flex gap-2 p-1 bg-muted/30 rounded-lg border border-border">
                                        {[',', ';', '|'].map((d) => (
                                            <button 
                                                key={d} 
                                                className={tabClass(delimiter === d)}
                                                onClick={() => setDelimiter(d)}
                                            >
                                                {d === "," ? "COMMA" : d === ";" ? "SEMI" : "PIPE"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                                    <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                                    <Upload className="w-12 h-12 mx-auto text-muted-foreground group-hover:text-primary mb-4 transition-transform group-hover:-translate-y-1" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{fileName || "Inject Dataset (.csv)"}</p>
                                </div>

                                {/* RESTORED CSV PREVIEW */}
                                {rawData.length > 0 && results.length === 0 && (
                                    <div className="p-4 bg-muted/30 rounded-2xl border-2 border-border animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Validation Preview</p>
                                        </div>
                                        <div className="space-y-2">
                                            {rawData.slice(0, 3).map((row, i) => (
                                                <div key={i} className="text-[11px] font-mono text-muted-foreground p-2 rounded bg-background/50 border border-border/50 flex justify-between items-center">
                                                    <span className="uppercase font-bold">{row.job}</span>
                                                    <div className="flex gap-3">
                                                        <span className="text-primary/70">{row.age}Y</span>
                                                        <span className="text-emerald-600 font-black">${row.balance.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {rawData.length > 0 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        <Separator className="bg-border" />
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-primary uppercase">Neural Progress</span>
                                                <span className="text-3xl font-black text-foreground">{progress}%</span>
                                            </div>
                                            <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border p-0.5">
                                                <div 
                                                    className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(var(--primary),0.3)]" 
                                                    style={{ width: `${progress}%` }} 
                                                />
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={processBatch} 
                                            className="w-full h-16 font-black bg-primary text-primary-foreground hover:opacity-90 rounded-2xl shadow-xl text-lg" 
                                            disabled={loading}
                                        >
                                            {loading ? <><Loader2 className="animate-spin mr-3 w-6 h-6" /> PROCESSING</> : "EXECUTE BATCH"}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {stats && (
                            <Card className="border-border bg-card shadow-xl overflow-hidden relative group">
                                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-transparent" />
                                <CardContent className="pt-8">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-6">Distribution Matrix</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                            <p className="text-[9px] text-emerald-500 font-black mb-1 uppercase tracking-tighter">High</p>
                                            <p className="text-2xl font-black text-foreground">{stats.distribution.high}</p>
                                        </div>
                                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                            <p className="text-[9px] text-amber-500 font-black mb-1 uppercase tracking-tighter">Mid</p>
                                            <p className="text-2xl font-black text-foreground">{stats.distribution.mid}</p>
                                        </div>
                                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                                            <p className="text-[9px] text-primary font-black mb-1 uppercase tracking-tighter">Low</p>
                                            <p className="text-2xl font-black text-foreground">{stats.distribution.low}</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase mb-1">Avg. Probability</p>
                                            <p className="text-4xl font-black text-foreground italic">{(stats.avgProb * 100).toFixed(1)}%</p>
                                        </div>
                                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                            <TrendingUp className="text-primary w-6 h-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="lg:col-span-8">
                        <Card className="h-full border-border bg-card shadow-2xl overflow-hidden flex flex-col">
                            <CardHeader className="border-b border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                        Intelligence Queue
                                        {results.length > 0 && <Badge variant="outline" className="font-mono text-[10px] border-primary text-primary">{results.length}</Badge>}
                                    </CardTitle>
                                    <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Real-time ranked lead prioritization</CardDescription>
                                </div>
                                {results.length > 0 && (
                                    <div className="flex bg-muted/40 p-1 rounded-xl border border-border">
                                        {['all', 'hot', 'warm'].map((f) => (
                                            <button 
                                                key={f} 
                                                onClick={() => setFilter(f)}
                                                className={`px-6 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <div className="max-h-[800px] overflow-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
                                            <TableRow className="border-border">
                                                <TableHead className="font-black text-[10px] uppercase py-5 pl-8 text-muted-foreground tracking-widest">Subject Profile</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase text-center text-muted-foreground tracking-widest">Propensity</TableHead>
                                                <TableHead className="text-right font-black text-[10px] uppercase pr-8 text-muted-foreground tracking-widest">Diagnostic</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {processedResults.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="h-[400px] text-center">
                                                        <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                                                            <Database className="w-16 h-16 text-muted-foreground" />
                                                            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Batch Input</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                processedResults.map((row, i) => (
                                                    <TableRow key={i} className="hover:bg-muted/20 border-border group transition-colors">
                                                        <TableCell className="py-6 pl-8">
                                                            <div className="font-black text-foreground uppercase text-sm tracking-tight">{row.job}</div>
                                                            <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase flex items-center gap-2">
                                                                <Badge variant="outline" className="text-[9px] py-0">{row.age}Y</Badge>
                                                                <span className="text-emerald-600 font-black">${row.balance.toLocaleString()}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-black text-sm text-foreground">{(row.score * 100).toFixed(0)}%</span>
                                                                    <Badge className={`text-[9px] font-black uppercase tracking-tighter ${
                                                                        row.status?.toLowerCase() === "hot" ? "bg-emerald-500 hover:bg-emerald-500" : 
                                                                        row.status?.toLowerCase() === "warm" ? "bg-amber-500 hover:bg-amber-500" : "bg-primary"
                                                                    }`}>
                                                                        {row.status}
                                                                    </Badge>
                                                                </div>
                                                                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden border border-border">
                                                                    <div 
                                                                        className={`h-full ${row.score > 0.7 ? 'bg-emerald-500' : 'bg-primary'}`} 
                                                                        style={{ width: `${row.score * 100}%` }} 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-8">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" size="sm" className="font-black text-[10px] uppercase h-9 rounded-xl border-border hover:bg-primary hover:text-primary-foreground">
                                                                        <Eye className="w-3.5 h-3.5 mr-2" /> Inspect
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-md border-border bg-card font-mono">
                                                                    <DialogHeader>
                                                                        <DialogTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                                                            <Activity className="w-5 h-5 text-primary" /> Lead Insight
                                                                        </DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="space-y-6 mt-4">
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                                                                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Education</p>
                                                                                <p className="text-sm font-black uppercase text-foreground">{row.education}</p>
                                                                            </div>
                                                                            <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                                                                                <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Engagement</p>
                                                                                <p className="text-sm font-black text-foreground">{row.duration}s</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="p-5 bg-primary/5 border-2 border-primary/10 rounded-2xl">
                                                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 italic">Neural Reasoning</p>
                                                                            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                                                                                Lead shows <strong className="text-foreground">{(row.score * 100).toFixed(1)}%</strong> conversion probability based on demographic clustering and behavioral duration metrics.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
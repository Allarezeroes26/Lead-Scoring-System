"use client"

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { 
    Loader2, 
    Upload, 
    Database, 
    Download, 
    Eye,
    BarChart3,
    CheckCircle2,
    TrendingUp,
    Info,
    Layers
} from "lucide-react";

export default function BatchPage() {
    const [rawData, setRawData] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");
    const [delimiter, setDelimiter] = useState(",");
    const [filter, setFilter] = useState("all");

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
        if (filter === "hot") return list.filter(r => r.status === "Hot");
        if (filter === "warm") return list.filter(r => r.status === "Warm");
        return list;
    }, [results, filter]);

    const stats = useMemo(() => {
        if (results.length === 0) return null;
        return {
            total: results.length,
            hot: results.filter(r => r.status === "Hot").length,
            warm: results.filter(r => r.status === "Warm").length,
            avgProb: results.reduce((acc, curr) => acc + curr.score, 0) / results.length,
            distribution: {
                low: results.filter(r => r.score < 0.4).length,
                mid: results.filter(r => r.score >= 0.4 && r.score < 0.7).length,
                high: results.filter(r => r.score >= 0.7).length,
            }
        };
    }, [results]);

    return (
        <div className="min-h-screen p-4 md:p-8 font-sans bg-transparent text-slate-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-slate-800/60 bg-slate-900/20 backdrop-blur-md shadow-2xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-blue-500" /> 
                                    Batch Engine
                                </CardTitle>
                                <CardDescription className="text-slate-500 text-xs">High-volume propensity scoring</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/50"><Info className="w-4 h-4" /></Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-slate-800 text-slate-300">
                                    <DialogHeader><DialogTitle className="text-white">Input Configuration</DialogTitle></DialogHeader>
                                    <div className="text-sm space-y-4">
                                        <p>The engine expects 16 features including <code className="text-blue-400">age</code>, <code className="text-blue-400">balance</code>, and <code className="text-blue-400">duration</code>.</p>
                                        <Button onClick={downloadTemplate} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" variant="outline">
                                            <Download className="w-4 h-4 mr-2" /> Download Template
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Format Settings</label>
                                <div className="flex gap-2 p-1 bg-slate-950/30 rounded-lg border border-slate-800">
                                    {[',', ';', '|'].map((d) => (
                                        <button 
                                            key={d} 
                                            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${delimiter === d ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-500 hover:text-slate-300"}`}
                                            onClick={() => setDelimiter(d)}
                                        >
                                            {d === "," ? "COMMA" : d === ";" ? "SEMI" : "PIPE"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative border border-dashed border-slate-700/50 rounded-xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                                <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                                <Upload className="w-10 h-10 mx-auto text-slate-600 group-hover:text-blue-400 mb-3 transition-transform group-hover:-translate-y-1" />
                                <p className="text-xs font-medium text-slate-400">{fileName || "Select Lead Data (.csv)"}</p>
                            </div>

                            {rawData.length > 0 && results.length === 0 && (
                                <div className="p-4 bg-slate-950/20 rounded-xl border border-slate-800/40 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-tighter">Validation Preview</p>
                                    {rawData.slice(0, 2).map((row, i) => (
                                        <div key={i} className="text-[11px] text-slate-400 truncate border-b border-slate-800 last:border-0 py-2 font-mono flex justify-between">
                                            <span className="capitalize">{row.job}</span>
                                            {/* Removed Euro Sign */}
                                            <span className="text-blue-500">{row.balance.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {rawData.length > 0 && (
                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-bold text-blue-500 uppercase">Analysis Progress</span>
                                        <span className="text-xl font-black text-white">{progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-950/40 rounded-full overflow-hidden border border-slate-800">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500" 
                                            style={{ width: `${progress}%` }} 
                                        />
                                    </div>
                                    <Button 
                                        onClick={processBatch} 
                                        className="w-full py-6 font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 rounded-xl border-t border-blue-400/20" 
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "Run Intelligence Batch"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {stats && (
                        <Card className="bg-slate-900/10 border-slate-800/60 shadow-xl overflow-hidden relative group backdrop-blur-sm">
                            <CardContent className="pt-8 relative z-10">
                                <BarChart3 className="absolute -right-4 -top-4 w-24 h-24 text-blue-500/5 rotate-12" />
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-6">Cohort Distribution</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-950/20 p-3 rounded-xl border border-slate-800">
                                        <p className="text-[9px] text-rose-500 font-bold mb-1 uppercase">High</p>
                                        <p className="text-2xl font-black text-white">{stats.distribution.high}</p>
                                    </div>
                                    <div className="bg-slate-950/20 p-3 rounded-xl border border-slate-800">
                                        <p className="text-[9px] text-amber-500 font-bold mb-1 uppercase">Mid</p>
                                        <p className="text-2xl font-black text-white">{stats.distribution.mid}</p>
                                    </div>
                                    <div className="bg-slate-950/20 p-3 rounded-xl border border-slate-800">
                                        <p className="text-[9px] text-blue-500 font-bold mb-1 uppercase">Low</p>
                                        <p className="text-2xl font-black text-white">{stats.distribution.low}</p>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Portfolio Strength</p>
                                        <p className="text-3xl font-black text-white italic">{(stats.avgProb * 100).toFixed(1)}%</p>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20">
                                        <TrendingUp className="text-blue-500 w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Results Table */}
                <div className="lg:col-span-8">
                    <Card className="h-full border-slate-800/60 shadow-2xl overflow-hidden bg-slate-900/10 backdrop-blur-lg">
                        <CardHeader className="border-b border-slate-800/60 bg-slate-900/10 flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                                    Intelligence Queue
                                    {results.length > 0 && <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-0">{results.length}</Badge>}
                                </CardTitle>
                                <CardDescription className="text-slate-500">ML-ranked lead prioritization</CardDescription>
                            </div>
                            {results.length > 0 && (
                                <div className="flex bg-slate-950/30 p-1 rounded-xl border border-slate-800">
                                    {['all', 'hot', 'warm'].map((f) => (
                                        <button 
                                            key={f} 
                                            onClick={() => setFilter(f)}
                                            className={`px-4 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${filter === f ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-400'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[700px] overflow-auto scrollbar-hide">
                                <Table>
                                    <TableHeader className="bg-[#020617]/80 sticky top-0 z-10 backdrop-blur-xl border-b border-slate-800">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="font-bold text-[10px] uppercase py-5 pl-8 text-slate-500 tracking-widest">Subject Profile</TableHead>
                                            <TableHead className="font-bold text-[10px] uppercase text-slate-500 text-center tracking-widest">Propensity</TableHead>
                                            <TableHead className="text-right font-bold text-[10px] uppercase pr-8 text-slate-500 tracking-widest">Diagnostic</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {processedResults.length === 0 ? (
                                            <TableRow className="hover:bg-transparent border-none">
                                                <TableCell colSpan={3} className="h-[500px] text-center">
                                                    <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                                                        <div className="p-6 bg-slate-950/20 rounded-full border border-slate-800">
                                                            <Database className="w-12 h-12 text-slate-600" />
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-500 italic">No batch data processed</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            processedResults.map((row, i) => (
                                                <TableRow key={i} className="hover:bg-slate-800/20 border-slate-800/40 transition-colors group">
                                                    <TableCell className="py-5 pl-8">
                                                        <div className="font-bold text-slate-100 capitalize text-sm">{row.job}</div>
                                                        <div className="text-[10px] font-medium text-slate-500 mt-1 uppercase flex items-center gap-3">
                                                            <span>Age {row.age}</span>
                                                            <span className="w-1 h-1 bg-slate-800 rounded-full" />
                                                            <span className="text-blue-500 font-bold">{row.balance.toLocaleString()}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col items-center gap-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-mono font-black text-sm text-white">{(row.score * 100).toFixed(0)}%</span>
                                                                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                                                                    row.status === "Hot" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : 
                                                                    row.status === "Warm" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : 
                                                                    "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                                                }`}>
                                                                    {row.status}
                                                                </div>
                                                            </div>
                                                            <div className="w-24 h-1 bg-slate-950/50 rounded-full overflow-hidden border border-slate-800">
                                                                <div 
                                                                    className={`h-full ${row.score > 0.7 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'}`} 
                                                                    style={{ width: `${row.score * 100}%` }} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-8">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="hover:bg-blue-500/10 hover:text-blue-400 text-slate-600 rounded-full">
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-md border-slate-800 bg-slate-900 shadow-3xl text-slate-300">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                                                        Lead Insight
                                                                    </DialogTitle>
                                                                    <DialogDescription className="text-slate-500">AI reasoning for propensity score</DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-6 mt-6">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                                                            <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Education</p>
                                                                            <p className="text-sm font-bold capitalize text-slate-200">{row.education}</p>
                                                                        </div>
                                                                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                                                            <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Engagement</p>
                                                                            <p className="text-sm font-bold text-slate-200">{row.duration}s</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl relative overflow-hidden">
                                                                        <div className="relative z-10">
                                                                            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 italic">Scoring Logic</p>
                                                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                                                Target alignment confirmed with <strong className="text-white">{(row.score * 100).toFixed(1)}%</strong> confidence. 
                                                                                Primary conversion drivers identified as {row.duration > 180 ? 'prolonged engagement' : 'liquidity profile'} and demographic relevance.
                                                                            </p>
                                                                        </div>
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
    );
}
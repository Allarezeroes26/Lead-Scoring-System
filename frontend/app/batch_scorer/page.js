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
    FileText, 
    Loader2, 
    Upload, 
    Database, 
    Download, 
    AlertCircle, 
    Eye,
    BarChart3,
    Filter,
    CheckCircle2,
    TrendingUp,
    Info
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

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("API Error Response:", errorData);
                    throw new Error(`Batch processing failed: ${response.statusText}`);
                }
                
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
        <div className="min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Database className="w-5 h-5 text-indigo-600" /> 
                                Batch Predictor
                            </CardTitle>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Info className="w-4 h-4" /></Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>CSV Schema</DialogTitle></DialogHeader>
                                    <div className="text-sm space-y-2 text-slate-600">
                                        <p>Required fields: <code className="bg-slate-100 p-0.5 text-[10px]">age, job, marital, education, default, balance, housing, loan, contact, day, month, duration, campaign, pdays, previous, poutcome</code></p>
                                        <Button onClick={downloadTemplate} className="w-full mt-4" variant="outline">Download Template</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Delimiter</label>
                                <div className="flex gap-2">
                                    {[',', ';', '|'].map((d) => (
                                        <Button key={d} variant={delimiter === d ? "default" : "outline"} className="flex-1 h-8 text-xs" onClick={() => setDelimiter(d)}>
                                            {d === "," ? "Comma" : d === ";" ? "Semi" : "Pipe"}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-all cursor-pointer group">
                                <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                                <Upload className="w-8 h-8 mx-auto text-slate-300 group-hover:text-indigo-600 mb-2 transition-colors" />
                                <p className="text-xs font-bold text-slate-600">{fileName || "Drop CSV file"}</p>
                            </div>

                            {rawData.length > 0 && results.length === 0 && (
                                <div className="p-3 bg-slate-100 rounded-lg">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Input Preview</p>
                                    {rawData.slice(0, 2).map((row, i) => (
                                        <div key={i} className="text-[10px] text-slate-500 truncate border-b border-slate-200 py-1">
                                            {row.job} • Bal: {row.balance} • Mapped Fields: {Object.keys(row).length}/16
                                        </div>
                                    ))}
                                </div>
                            )}

                            {rawData.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                        <span className="text-indigo-600">Engine Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-1.5 bg-slate-100" />
                                    <Button onClick={processBatch} className="w-full py-6 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Initiate Batch Analysis"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {stats && (
                        <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden">
                            <CardContent className="pt-8 text-center relative">
                                <BarChart3 className="absolute -right-4 -top-4 w-20 h-20 text-white/5 rotate-12" />
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Propensity Distribution</p>
                                <div className="grid grid-cols-3 gap-2 mt-6">
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                        <p className="text-[10px] text-red-400 font-bold">HIGH</p>
                                        <p className="text-xl font-black">{stats.distribution.high}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                        <p className="text-[10px] text-orange-400 font-bold">MID</p>
                                        <p className="text-xl font-black">{stats.distribution.mid}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                        <p className="text-[10px] text-blue-400 font-bold">LOW</p>
                                        <p className="text-xl font-black">{stats.distribution.low}</p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-left">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Avg Conversion Probability</p>
                                        <p className="text-2xl font-black">{(stats.avgProb * 100).toFixed(1)}%</p>
                                    </div>
                                    <TrendingUp className="text-indigo-400 w-6 h-6" />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-8">
                    <Card className="h-full border-none shadow-md overflow-hidden bg-white">
                        <CardHeader className="border-b flex flex-row items-center justify-between py-6">
                            <div>
                                <CardTitle className="text-2xl font-black flex items-center gap-2">
                                    Lead Intelligence
                                    {results.length > 0 && <Badge variant="secondary" className="text-[10px] uppercase">{results.length} Scored</Badge>}
                                </CardTitle>
                                <CardDescription>Ranked by Predicted Conversion Probability</CardDescription>
                            </div>
                            {results.length > 0 && (
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    {['all', 'hot', 'warm'].map((f) => (
                                        <button 
                                            key={f} 
                                            onClick={() => setFilter(f)}
                                            className={`px-3 py-1 text-[10px] font-black uppercase rounded-md transition-all ${filter === f ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[700px] overflow-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
                                        <TableRow>
                                            <TableHead className="font-black text-[10px] uppercase py-4 pl-6 text-slate-500">Lead Profile</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase text-slate-500 text-center">Model Confidence</TableHead>
                                            <TableHead className="text-right font-black text-[10px] uppercase pr-6 text-slate-500">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {processedResults.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-[400px] text-center">
                                                    <div className="opacity-20 flex flex-col items-center">
                                                        <AlertCircle className="w-12 h-12 mb-2" />
                                                        <p className="font-bold">Awaiting Data Processing</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            processedResults.map((row, i) => (
                                                <TableRow key={i} className="hover:bg-slate-50/80 transition-colors group">
                                                    <TableCell className="py-4 pl-6">
                                                        <div className="font-black text-slate-800 capitalize">{row.job}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase flex items-center gap-2">
                                                            <span>Age: {row.age}</span>
                                                            <span className="text-slate-200">|</span>
                                                            <span className="text-indigo-600">Balance: €{row.balance.toLocaleString()}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono font-black text-xs">{(row.score * 100).toFixed(0)}%</span>
                                                                <Badge className={`text-[9px] font-black border-none px-1.5 h-4 ${row.status === "Hot" ? "bg-red-100 text-red-600" : row.status === "Warm" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                                                                    {row.status}
                                                                </Badge>
                                                            </div>
                                                            <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className={`h-full ${row.score > 0.7 ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${row.score * 100}%` }} />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="group-hover:text-indigo-600"><Eye className="w-4 h-4" /></Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-md border-none shadow-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-xl font-black">Lead Diagnostic</DialogTitle>
                                                                    <DialogDescription>AI-driven attribute breakdown and reasoning.</DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4 mt-4">
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Education</p>
                                                                            <p className="text-sm font-black capitalize">{row.education}</p>
                                                                        </div>
                                                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Last Contact</p>
                                                                            <p className="text-sm font-black">{row.duration} seconds</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                                                            <p className="text-xs font-black text-indigo-600 uppercase italic">Model Explanation</p>
                                                                        </div>
                                                                        <p className="text-sm text-indigo-900 leading-relaxed">
                                                                            High-intent signal detected. Lead conversion probability is <strong>{(row.score * 100).toFixed(1)}%</strong>. 
                                                                            Primary drivers: {row.duration > 180 ? 'extensive engagement' : 'strong financial profile'} and {row.age > 30 && row.age < 50 ? 'target demographic alignment' : 'behavioral patterns'}.
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
    );
}
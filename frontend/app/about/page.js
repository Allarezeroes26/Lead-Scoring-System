"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    BrainCircuit, CheckCircle2, 
    ArrowRight, Microscope, Activity,
    Target, BarChart3, AlertTriangle, Scale,
    Fingerprint, Terminal
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const AboutPage = () => {
    return (
        <div className="w-full min-h-screen bg-transparent text-slate-200 pb-20 font-sans">
            {/* HERO SECTION - Original Text with New Design */}
            <section className="pt-24 pb-20 px-6 border-b border-slate-800/40">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <div className="flex justify-center">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5 px-4 py-1 text-[10px] uppercase font-black tracking-widest">
                            Statistical Lead Scoring Engine
                        </Badge>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight">
                        Customer Conversion <span className="text-blue-500">Prediction System</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                        A fullstack machine learning system that predicts customer conversion using an interpretable logistic regression model built from scratch.
                    </p>
                    <p className="text-lg italic text-slate-500 max-w-2xl mx-auto font-medium">
                        "Built without scikit-learn — every prediction, weight update, and sigmoid function is implemented manually using NumPy."
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* LEFT COLUMN: NARRATIVE CONTENT */}
                    <div className="lg:col-span-8 space-y-24">
                        
                        {/* PROJECT OVERVIEW & OBJECTIVE */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
                                    <Microscope className="w-4 h-4" /> Model Overview
                                </h2>
                                <div className="text-slate-400 space-y-4 text-sm leading-relaxed border-l border-slate-800 pl-6">
                                    <p>This system replaces "black-box" approaches with an <strong>interpretable Logistic Regression model</strong>. By analyzing historical engagement, the system calculates a weighted probability of conversion.</p>
                                    <p>The core logic was implemented manually using <strong>NumPy</strong> to handle matrix multiplications and gradient updates without high-level abstractions.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Model Objective
                                </h2>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">The primary goal is to provide transparency in lead scoring by visualizing exactly which variables move the needle.</p>
                                <ul className="space-y-4">
                                    {["Rank leads by probability", "Optimize outreach resources", "Audit model coefficients", "Explainable predictions"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300 group">
                                            <div className="p-1 bg-emerald-500/10 rounded border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* MODEL PIPELINE VISUALIZER */}
                        <section className="space-y-10">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-center text-slate-500 italic">Model Pipeline</h3>
                                <p className="text-slate-600 text-[10px] text-center uppercase tracking-widest">Data Input → Statistical Inference → Probability Output</p>
                            </div>
                            <div className="p-1 border border-slate-800/60 rounded-[2.5rem] bg-slate-900/10 backdrop-blur-sm">
                                <div className="p-10 bg-gradient-to-br from-slate-900/40 to-transparent rounded-[2.4rem] relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex-1 w-full text-center p-6 border border-slate-800/80 rounded-2xl bg-slate-950/40 shadow-inner">
                                            <p className="text-white font-black text-xs mb-2 tracking-widest uppercase">Next.js UI</p>
                                            <code className="text-[10px] text-blue-500 font-mono">/api/predict</code>
                                        </div>
                                        <ArrowRight className="rotate-90 md:rotate-0 text-slate-700 w-5 h-5" />
                                        <div className="flex-1 w-full text-center p-6 border border-blue-500/20 rounded-2xl bg-blue-500/5 shadow-xl shadow-blue-500/5">
                                            <p className="text-white font-black text-xs mb-2 tracking-widest uppercase">FastAPI Engine</p>
                                            <code className="text-[10px] text-blue-400 font-mono">NumPy Vectors</code>
                                        </div>
                                        <ArrowRight className="rotate-90 md:rotate-0 text-slate-700 w-5 h-5" />
                                        <div className="flex-1 w-full text-center p-6 border border-emerald-500/20 rounded-2xl bg-emerald-500/5">
                                            <p className="text-white font-black text-xs mb-2 tracking-widest uppercase">Logit Model</p>
                                            <code className="text-[10px] text-emerald-400 font-mono">Sigmoid Layer</code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* MATHEMATICAL IMPLEMENTATION */}
                        <section className="bg-slate-900/10 backdrop-blur-xl rounded-[3rem] p-12 space-y-10 border border-slate-800/40 shadow-2xl">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-4 text-white">
                                    <BrainCircuit className="w-8 h-8 text-blue-500" /> Logistic Regression Mechanics
                                </h2>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                                    This project uses a <strong>custom implementation</strong> of logistic regression. Prediction confidence is calculated by measuring how far probabilities are from the uncertainty boundary of 0.5.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { val: "0.50", label: "Boundary Uncertainty" },
                                    { val: "0.95", label: "Strong Positive Sign" },
                                    { val: "0.02", label: "Strong Negative Sign" }
                                ].map((ex, i) => (
                                    <div key={i} className="bg-slate-950/40 p-6 rounded-3xl border border-slate-800/50 text-center group hover:border-blue-500/30 transition-all">
                                        <p className="text-[9px] font-black text-slate-500 group-hover:text-blue-500 uppercase mb-2 tracking-[0.2em] transition-colors">{ex.label}</p>
                                        <p className="text-4xl font-black text-white italic">{ex.val}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* LIMITATIONS SECTION */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-500/5 rounded-2xl border border-rose-500/10"><AlertTriangle className="w-5 h-5 text-rose-500" /></div>
                                <h2 className="text-xl font-black tracking-tight text-white uppercase">Model Constraints</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { title: "Imbalance Sensitivity", icon: <Scale className="w-4 h-4 text-rose-500" />, desc: "Sensitive to imbalanced datasets; requires tuning over raw accuracy." },
                                    { title: "Linear Boundary", icon: <BarChart3 className="w-4 h-4 text-rose-500" />, desc: "Limited to linear decision boundaries; unable to model non-linear interactions." },
                                    { title: "Feature Scaling", icon: <Activity className="w-4 h-4 text-rose-500" />, desc: "Requires normalization/standardization for gradient descent stability." }
                                ].map((limit, i) => (
                                    <div key={i} className="space-y-4 group">
                                        <div className="flex items-center gap-3">
                                            {limit.icon}
                                            <h4 className="font-black text-[11px] uppercase text-slate-200 tracking-widest">{limit.title}</h4>
                                        </div>
                                        <div className="h-[1px] w-full bg-slate-800 group-hover:bg-rose-500/30 transition-colors"></div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{limit.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: DEVELOPER & TECH */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* DEVELOPER CARD */}
                        <Card className="bg-slate-900/20 backdrop-blur-2xl text-white border border-slate-800/60 shadow-2xl overflow-hidden relative group">
                            <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <Fingerprint className="w-32 h-32" />
                            </div>
                            <CardContent className="p-10 space-y-8 relative z-10">
                                <div>
                                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Developer</p>
                                    <h2 className="text-4xl font-black tracking-tighter">Erwin Bacani</h2>
                                </div>
                                <Separator className="bg-slate-800/60" />
                                <div className="space-y-4">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Project Goal</p>
                                    <p className="text-xs text-slate-400 leading-relaxed font-medium italic border-l-2 border-blue-500/40 pl-4">
                                        "This project was built to strengthen my understanding of machine learning fundamentals, statistical prediction systems, and fullstack architecture."
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <a href="#" className="p-3 bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-all rounded-xl">
                                        <FaGithub className="w-4 h-4" />
                                    </a>
                                    <a href="#" className="p-3 bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-all rounded-xl">
                                        <FaLinkedin className="w-4 h-4" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        {/* TECH STACK CARD */}
                        <Card className="bg-slate-900/10 backdrop-blur-md border-slate-800/60 shadow-xl overflow-hidden text-slate-200">
                            <CardHeader className="bg-slate-950/20 border-b border-slate-800/60">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Terminal className="w-4 h-4 text-blue-500" /> Architecture Stack
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase mb-4 tracking-widest">Frontend</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Next.js', 'React', 'Tailwind', 'shadcn/ui', 'Recharts'].map(t => (
                                            <Badge key={t} variant="secondary" className="bg-slate-950/50 border-slate-800 text-[9px] px-2 py-0.5 rounded uppercase font-black text-slate-400">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Separator className="bg-slate-800/60" />
                                <div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase mb-4 tracking-widest">Backend & Math</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['FastAPI', 'Python', 'NumPy', 'REST API'].map(t => (
                                            <Badge key={t} variant="secondary" className="bg-blue-500/5 text-blue-400 border-blue-500/20 text-[9px] px-2 py-0.5 rounded uppercase font-black">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
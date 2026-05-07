"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    BrainCircuit, Cpu, Layers, Zap, CheckCircle2, 
    ArrowRight, Code2, Terminal, Microscope, Activity,
    Target, FileSpreadsheet, BarChart3, ShieldCheck, 
    Construction, UserCircle, Database, AlertTriangle, Scale,
    Globe
} from "lucide-react";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const AboutPage = () => {
    return (
        <div className="w-full min-h-screen bg-white text-slate-900 pb-20">
            {/* HERO SECTION */}
            <section className="pt-24 pb-16 px-6 border-b border-slate-100 bg-slate-50/50">
                <div className="max-w-5xl mx-auto text-center space-y-6">
                    <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50 px-3 py-1">
                        Statistical Lead Scoring Engine
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
                        Customer Conversion <span className="text-blue-600">Prediction System</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                        A fullstack machine learning system that predicts customer conversion using an interpretable logistic regression model built from scratch.
                    </p>
                    <p className="text-lg italic text-slate-400 max-w-2xl mx-auto font-medium">
                        "Built without scikit-learn — every prediction, weight update, and sigmoid function is implemented manually using NumPy."
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* LEFT COLUMN: NARRATIVE CONTENT */}
                    <div className="lg:col-span-8 space-y-24">
                        
                        {/* PROJECT OVERVIEW & OBJECTIVE */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Microscope className="w-6 h-6 text-blue-600" /> Model Overview
                                </h2>
                                <div className="text-slate-600 space-y-4 leading-relaxed">
                                    <p>This system replaces "black-box" approaches with an <strong>interpretable Logistic Regression model</strong>. By analyzing historical engagement, the system calculates a weighted probability of conversion.</p>
                                    <p>The core logic was implemented manually using <strong>NumPy</strong> to handle matrix multiplications and gradient updates without high-level abstractions.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Target className="w-6 h-6 text-red-500" /> Model Objective
                                </h2>
                                <p className="text-slate-600 leading-relaxed">The primary goal is to provide transparency in lead scoring by visualizing exactly which variables move the needle.</p>
                                <ul className="grid grid-cols-1 gap-2">
                                    {["Rank leads by probability", "Optimize outreach resources", "Audit model coefficients", "Explainable predictions"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* MODEL PIPELINE VISUALIZER */}
                        <section className="space-y-8">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Model Pipeline</h3>
                                <p className="text-slate-500 text-sm italic">Data Input → Statistical Inference → Probability Output</p>
                            </div>
                            <div className="p-10 bg-slate-900 rounded-[2rem] text-slate-300 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex-1 text-center p-4 border border-slate-700 rounded-2xl bg-slate-800/50">
                                        <p className="text-white font-bold mb-1">Next.js UI</p>
                                        <code className="text-[10px] text-blue-400">/api/predict</code>
                                    </div>
                                    <ArrowRight className="rotate-90 md:rotate-0 text-slate-700 w-8 h-8" />
                                    <div className="flex-1 text-center p-4 border border-blue-900 rounded-2xl bg-blue-950/30">
                                        <p className="text-white font-bold mb-1">FastAPI Engine</p>
                                        <code className="text-[10px] text-blue-400">NumPy Vectors</code>
                                    </div>
                                    <ArrowRight className="rotate-90 md:rotate-0 text-slate-700 w-8 h-8" />
                                    <div className="flex-1 text-center p-4 border border-emerald-900 rounded-2xl bg-emerald-950/30">
                                        <p className="text-white font-bold mb-1">Logit Model</p>
                                        <code className="text-[10px] text-emerald-400">Sigmoid Layer</code>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* MATHEMATICAL IMPLEMENTATION */}
                        <section className="bg-slate-50 rounded-[2.5rem] p-10 space-y-8 border border-slate-100">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <BrainCircuit className="w-7 h-7 text-blue-600" /> Logistic Regression Mechanics
                                </h2>
                                <p className="text-slate-600 leading-relaxed">This project uses a <strong>custom implementation</strong> of logistic regression. Prediction confidence is calculated by measuring how far probabilities are from the uncertainty boundary of 0.5.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { val: "0.50", label: "Boundary Uncertainty" },
                                    { val: "0.95", label: "Strong Positive Sign" },
                                    { val: "0.02", label: "Strong Negative Sign" }
                                ].map((ex, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                                        <p className="text-[11px] font-black text-blue-600 uppercase mb-1 tracking-widest">{ex.label}</p>
                                        <p className="text-3xl font-black text-slate-900">{ex.val}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* LIMITATIONS SECTION */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
                                <h2 className="text-2xl font-bold tracking-tight">Model Constraints</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { 
                                        title: "Imbalance Sensitivity", 
                                        desc: "Sensitive to imbalanced datasets; requires tuning over raw accuracy.",
                                        icon: <Scale className="w-4 h-4" />
                                    },
                                    { 
                                        title: "Linear Boundary", 
                                        desc: "Limited to linear decision boundaries; unable to model non-linear interactions.",
                                        icon: <BarChart3 className="w-4 h-4" />
                                    },
                                    { 
                                        title: "Feature Scaling", 
                                        desc: "Requires normalization/standardization for gradient descent stability.",
                                        icon: <Activity className="w-4 h-4" />
                                    }
                                ].map((limit, i) => (
                                    <div key={i} className="p-6 border border-slate-200 rounded-2xl space-y-3 shadow-sm bg-white">
                                        <div className="text-red-500">{limit.icon}</div>
                                        <h4 className="font-bold text-sm text-slate-900">{limit.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{limit.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: DEVELOPER & TECH */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* DEVELOPER CARD */}
                        <Card className="bg-slate-900 text-white border-none shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <UserCircle className="w-24 h-24" />
                            </div>
                            <CardContent className="p-8 space-y-6 relative z-10">
                                <div>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Developer</p>
                                    <h2 className="text-3xl font-black mt-2">Erwin Bacani</h2>
                                </div>
                                <Separator className="bg-slate-800" />
                                <div className="space-y-4">
                                    <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-bold tracking-tighter">Project Goal</p>
                                    <p className="text-xs text-slate-300 leading-relaxed italic">
                                        "This project was built to strengthen my understanding of machine learning fundamentals, statistical prediction systems, and fullstack architecture."
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* TECH STACK CARD */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-blue-600" /> Architecture Stack
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Frontend</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Next.js', 'React', 'Tailwind', 'shadcn/ui', 'Recharts'].map(t => (
                                            <Badge key={t} variant="secondary" className="bg-white border-slate-200 text-[10px] uppercase font-bold text-slate-600">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Backend & Math</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['FastAPI', 'Python', 'NumPy', 'REST API'].map(t => (
                                            <Badge key={t} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 text-[10px] uppercase font-bold">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CONNECT */}
                        <div className="flex justify-center gap-4 pt-4">
                            <a href="#" className="p-3 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-full transition-all duration-300">
                                <FaGithub className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-full transition-all duration-300">
                                <FaLinkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-3 bg-slate-100 hover:bg-orange-500 hover:text-white rounded-full transition-all duration-300">
                                <Globe className="w-5 h-5" />
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
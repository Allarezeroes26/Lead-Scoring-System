"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    BrainCircuit, CheckCircle2, 
    ArrowRight, Microscope, Activity,
    Target, BarChart3, AlertTriangle, Scale,
    Fingerprint, Terminal,
    Globe
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const AboutPage = () => {
    return (
        /* Root container now uses semantic theme variables */
        <div className="w-full min-h-screen bg-background text-foreground pb-20 font-sans transition-colors duration-300">
            
            {/* HERO SECTION - Removed hardcoded white/slate */}
            <section className="pt-24 pb-20 px-6 border-b border-border bg-background">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <div className="flex justify-center">
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 py-1 text-[10px] uppercase font-black tracking-widest">
                            Statistical Lead Scoring Engine
                        </Badge>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-tight">
                        Customer Conversion <span className="text-primary">Prediction System</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                        A fullstack machine learning system that estimates customer conversion likelihood using an interpretable logistic regression model built from scratch.
                    </p>
                    <p className="text-lg italic text-muted-foreground/60 max-w-2xl mx-auto font-medium">
                        "No scikit-learn used — all predictions, gradient updates, and the sigmoid function are implemented manually with NumPy."
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-24">
                        
                        {/* MODEL OVERVIEW & OBJECTIVE */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                                    <Microscope className="w-4 h-4" /> Model Overview
                                </h2>
                                <div className="text-muted-foreground space-y-4 text-sm leading-relaxed border-l-2 border-border pl-6">
                                    <p>This project replaces black-box approaches with an <strong>logistic regression model</strong>. It analyzes historical user engagement to compute a weighted likelihood of conversion.</p>
                                    <p>The core logic is implemented directly in <strong>NumPy</strong>, including matrix operations and gradient updates, without relying on high-level ML libraries.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-destructive flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Model Objective
                                </h2>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">The goal is to make lead scoring transparent by clearly showing which features influence the final prediction.</p>
                                <ul className="space-y-4">
                                    {["Rank leads by conversion likelihood", "Improve outreach efficiency", "Audit feature influence"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-foreground group">
                                            <div className="p-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* MODEL PIPELINE VISUALIZER */}
                        <section className="space-y-10">
                            <div className="space-y-2 text-center">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Model Pipeline</h3>
                                <p className="text-muted-foreground/60 text-[10px] uppercase tracking-widest">Data Input → Feature Processing → Probability Estimation</p>
                            </div>
                            
                            <div className="p-2 border border-border rounded-[2.5rem] bg-card shadow-xl dark:shadow-none">
                                <div className="p-8 md:p-12 bg-muted/30 dark:bg-gradient-to-br dark:from-muted/40 dark:to-transparent rounded-[2.2rem] relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                        
                                        {/* Box 1 */}
                                        <div className="flex-1 w-full text-center p-6 border border-border rounded-2xl bg-background shadow-sm">
                                            <p className="text-foreground font-black text-[10px] mb-2 tracking-widest uppercase">Next.js UI</p>
                                            <code className="text-[10px] text-primary font-mono font-bold">/api/predict</code>
                                        </div>

                                        <ArrowRight className="rotate-90 md:rotate-0 text-muted-foreground w-5 h-5 shrink-0" />

                                        {/* Box 2 (Active Engine) */}
                                        <div className="flex-1 w-full text-center p-6 border border-primary/50 rounded-2xl bg-background shadow-lg ring-1 ring-primary/10">
                                            <p className="text-primary dark:text-foreground font-black text-[10px] mb-2 tracking-widest uppercase">FastAPI Engine</p>
                                            <code className="text-[10px] text-primary/80 dark:text-primary font-mono font-bold">NumPy Vectors</code>
                                        </div>

                                        <ArrowRight className="rotate-90 md:rotate-0 text-muted-foreground w-5 h-5 shrink-0" />

                                        {/* Box 3 */}
                                        <div className="flex-1 w-full text-center p-6 border border-emerald-500/30 rounded-2xl bg-background shadow-sm">
                                            <p className="text-emerald-600 dark:text-foreground font-black text-[10px] mb-2 tracking-widest uppercase">Logit Model</p>
                                            <code className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">Sigmoid Layer</code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* LOGISTIC REGRESSION MECHANICS */}
                        <section className="bg-card rounded-[3rem] p-12 space-y-10 border border-border shadow-2xl dark:shadow-none">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-4 text-foreground uppercase">
                                    <BrainCircuit className="w-8 h-8 text-primary" /> Logistic Regression Mechanics
                                </h2>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                                    Prediction confidence is derived from how far outputs are from the decision boundary at 0.5.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { val: "0.50", label: "Decision Boundary" },
                                    { val: "0.95", label: "Strong Positive Prediction" },
                                    { val: "0.02", label: "Strong Negative Prediction" }
                                ].map((ex, i) => (
                                    <div key={i} className="bg-muted/20 p-6 rounded-3xl border border-border text-center group hover:border-primary transition-all shadow-sm">
                                        <p className="text-[9px] font-black text-muted-foreground group-hover:text-primary uppercase mb-2 tracking-[0.2em] transition-colors">{ex.label}</p>
                                        <p className="text-4xl font-black text-foreground italic tracking-tighter">{ex.val}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* MODEL CONSTRAINTS */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-destructive/10 rounded-2xl border border-destructive/20 shadow-sm"><AlertTriangle className="w-5 h-5 text-destructive" /></div>
                                <h2 className="text-xl font-black tracking-tight text-foreground uppercase">Model Constraints</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { title: "Imbalance Sensitivity", icon: <Scale className="w-4 h-4 text-destructive" />, desc: "Sensitive to class imbalance and requires careful metric selection beyond raw accuracy." },
                                    { title: "Linear Boundary", icon: <BarChart3 className="w-4 h-4 text-destructive" />, desc: "Only models linear relationships and cannot capture complex non-linear interactions." },
                                    { title: "Feature Scaling", icon: <Activity className="w-4 h-4 text-destructive" />, desc: "Requires feature scaling to ensure stable and efficient gradient descent." }
                                ].map((limit, i) => (
                                    <div key={i} className="space-y-4 group">
                                        <div className="flex items-center gap-3">
                                            {limit.icon}
                                            <h4 className="font-black text-[11px] uppercase text-foreground tracking-widest">{limit.title}</h4>
                                        </div>
                                        <div className="h-[2px] w-full bg-border group-hover:bg-destructive/30 transition-colors"></div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{limit.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="bg-card text-card-foreground border border-border shadow-xl dark:shadow-2xl overflow-hidden relative group">
                            <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <Fingerprint className="w-32 h-32 text-foreground" />
                            </div>
                            <CardContent className="p-10 space-y-8 relative z-10">
                                <div>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-2">Developer</p>
                                    <h2 className="text-4xl font-black tracking-tighter">Erwin Bacani</h2>
                                </div>
                                <Separator className="bg-border" />
                                <div className="space-y-4">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Project Goal</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium italic border-l-4 border-primary/20 pl-4 bg-muted/10 py-4 rounded-r-xl">
                                        "This project was built to deepen my understanding of machine learning fundamentals, statistical modeling, and fullstack system design."
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <a href="https://github.com/Allarezeroes26" target="_blank" className="p-3 bg-background border border-border text-muted-foreground hover:text-primary shadow-sm transition-all rounded-xl">
                                        <FaGithub className="w-4 h-4" />
                                    </a>
                                    <a href="www.linkedin.com/in/john-erwin-bacani-90853a359" target="_blank" className="p-3 bg-background border border-border text-muted-foreground hover:text-primary shadow-sm transition-all rounded-xl">
                                        <FaLinkedin className="w-4 h-4" />
                                    </a>
                                    <a href="https://portfolio-j0qq.onrender.com/" target="_blank" className="p-3 bg-background border border-border text-muted-foreground hover:text-primary shadow-sm transition-all rounded-xl">
                                        <Globe className="w-4 h-4" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border border-border shadow-lg overflow-hidden text-card-foreground">
                            <CardHeader className="bg-muted/20 border-b border-border">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Terminal className="w-4 h-4 text-primary" /> Architecture Stack
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-4 tracking-widest">Frontend</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Next.js', 'React', 'Tailwind', 'shadcn/ui', 'Recharts'].map(t => (
                                            <Badge key={t} variant="secondary" className="bg-muted border-border text-[9px] px-2 py-0.5 rounded uppercase font-black text-muted-foreground">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Separator className="bg-border" />
                                <div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-4 tracking-widest">Backend</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['FastAPI', 'Python', 'NumPy', 'REST API'].map(t => (
                                            <Badge key={t} variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[9px] px-2 py-0.5 rounded uppercase font-black">{t}</Badge>
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
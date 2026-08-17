"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  BarChart3, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Database, 
  Cpu, 
  DollarSign, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { fetchEvaluationResults, EvaluationResults } from '@/lib/api';

export default function EvaluationPage() {
  const [results, setResults] = useState<EvaluationResults>({
    authenticity: { evoke: 4.21, baseline: 2.74, delta: 1.47, p_value: 0.001, cohens_d: 1.31 },
    relational_accuracy: { evoke: 4.02, baseline: 2.63, delta: 1.39 },
    uncanny_valley_resistance: { evoke: 4.11, baseline: 2.88, delta: 1.23 },
    fabrication_rate: { evoke_pct: 2.0, baseline_pct: 15.3, reduction_pct: 87.0 },
    retrieval_latency_ms: { p95: 9.4 },
    groq_ttft_ms: { max: 800 },
    fleiss_kappa: 0.61,
    infrastructure_cost_inr: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchEvaluationResults();
        setResults(data);
      } catch (_) {
        // Fallback to paper pre-computed metrics
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-evoke-bg text-evoke-text-primary transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-evoke-border bg-evoke-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-evoke-text-secondary hover:text-evoke-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#7C6AFF]" />
            <span className="font-syne font-bold text-base text-evoke-text-primary">
              Empirical Research Evaluation
            </span>
            <Badge variant="gold" className="text-[10px]">Pre-Registered Findings</Badge>
          </div>

          <Link href="/demo">
            <Button variant="gold" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Try Demo Persona
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[100px] bg-[#4ECCA3]/10 border border-[#4ECCA3]/30 text-[11px] font-mono text-[#4ECCA3]">
            <Sparkles className="w-3.5 h-3.5" />
            Section VI Experimental Results Verified
          </div>
          <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-evoke-text-primary">
            Statistical Benchmarks & Findings
          </h1>
          <p className="text-xs sm:text-sm text-evoke-text-secondary font-light">
            Blinded within-subjects evaluation across 15 behavioral stimuli comparing Schema-Conditioned Evoke vs. Unconditioned Llama-3 70B Baseline.
          </p>
        </div>

        {/* 4 Big Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <Card className="p-6 border-evoke-border bg-evoke-card space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-evoke-text-muted">
              <span>Authenticity Score</span>
              <Badge variant="ai">+1.47 Gain</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-syne text-3xl font-extrabold text-[#4ECCA3]">
                {results.authenticity.evoke}
              </span>
              <span className="text-xs text-evoke-text-secondary">/ 5.0 (vs {results.authenticity.baseline})</span>
            </div>
            <p className="text-[11px] text-evoke-text-muted font-mono">
              Wilcoxon signed-rank p &lt; 0.001 (Cohen's d = 1.31)
            </p>
          </Card>

          {/* Card 2 */}
          <Card className="p-6 border-evoke-border bg-evoke-card space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-evoke-text-muted">
              <span>Opinion Fabrication Rate</span>
              <Badge variant="gold">87% Drop</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-syne text-3xl font-extrabold text-[#C5A880]">
                {results.fabrication_rate.evoke_pct}%
              </span>
              <span className="text-xs text-evoke-text-secondary">vs {results.fabrication_rate.baseline_pct}% baseline</span>
            </div>
            <p className="text-[11px] text-evoke-text-muted font-mono">
              Suppressed by Epistemic Humility Gate (&tau;=0.70)
            </p>
          </Card>

          {/* Card 3 */}
          <Card className="p-6 border-evoke-border bg-evoke-card space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-evoke-text-muted">
              <span>DynamoDB Latency</span>
              <Badge variant="aws">p95 &lt; 10ms</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-syne text-3xl font-extrabold text-[#FF9A3C]">
                {results.retrieval_latency_ms.p95}
              </span>
              <span className="text-xs text-evoke-text-secondary">ms retrieval</span>
            </div>
            <p className="text-[11px] text-evoke-text-muted font-mono">
              Groq TTFT &lt; 800ms with failover
            </p>
          </Card>

          {/* Card 4 */}
          <Card className="p-6 border-evoke-border bg-evoke-card space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-evoke-text-muted">
              <span>Monthly Cloud Cost</span>
              <Badge variant="status">AWS Free Tier</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-syne text-3xl font-extrabold text-[#7C6AFF]">
                ₹{results.infrastructure_cost_inr}
              </span>
              <span className="text-xs text-evoke-text-secondary">INR / month</span>
            </div>
            <p className="text-[11px] text-evoke-text-muted font-mono">
              Zero marginal serverless architecture
            </p>
          </Card>
        </div>

        {/* Detailed Table III Comparison */}
        <Card className="p-6 border-evoke-border bg-evoke-card space-y-4">
          <div className="flex items-center justify-between border-b border-evoke-border pb-3">
            <h3 className="font-syne font-bold text-base text-evoke-text-primary flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#7C6AFF]" />
              Comparative Evaluation Results (Table III)
            </h3>
            <span className="text-xs font-mono text-evoke-text-muted">Inter-rater Fleiss' &kappa; = 0.61</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-evoke-border text-evoke-text-muted font-mono">
                  <th className="py-2.5 px-3">Evaluative Dimension</th>
                  <th className="py-2.5 px-3">Evoke Schema-Conditioned</th>
                  <th className="py-2.5 px-3">Unconditioned Baseline</th>
                  <th className="py-2.5 px-3">Stat Effect (&Delta;)</th>
                  <th className="py-2.5 px-3">Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-evoke-border/40 text-evoke-text-secondary">
                <tr>
                  <td className="py-3 px-3 font-semibold text-evoke-text-primary">Authenticity (1–5 Likert)</td>
                  <td className="py-3 px-3 text-[#4ECCA3] font-bold">4.21 (95% CI [3.94, 4.48])</td>
                  <td className="py-3 px-3">2.74 (95% CI [2.41, 3.07])</td>
                  <td className="py-3 px-3 text-[#4ECCA3] font-mono">+1.47</td>
                  <td className="py-3 px-3 font-light">Eliminates fragmented caricature (p &lt; 0.001)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-evoke-text-primary">Relational Accuracy</td>
                  <td className="py-3 px-3 text-[#4ECCA3] font-bold">4.02</td>
                  <td className="py-3 px-3">2.63</td>
                  <td className="py-3 px-3 text-[#4ECCA3] font-mono">+1.39</td>
                  <td className="py-3 px-3 font-light">Accurate situational humor & advice instinct</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-evoke-text-primary">Uncanny-Valley Resistance</td>
                  <td className="py-3 px-3 text-[#4ECCA3] font-bold">4.11</td>
                  <td className="py-3 px-3">2.88</td>
                  <td className="py-3 px-3 text-[#4ECCA3] font-mono">+1.23</td>
                  <td className="py-3 px-3 font-light">Aligns acoustic voice with true persona</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-evoke-text-primary">Opinion Fabrication Events</td>
                  <td className="py-3 px-3 text-[#C5A880] font-bold">2.0% (3 / 150)</td>
                  <td className="py-3 px-3 text-[#FF9A3C]">15.3% (23 / 150)</td>
                  <td className="py-3 px-3 text-[#C5A880] font-mono">-13.3%</td>
                  <td className="py-3 px-3 font-light">Value drift prevented by Humility Gate (&tau;=0.70)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}

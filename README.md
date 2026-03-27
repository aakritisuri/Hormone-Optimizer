# Hormone Optimizer — Endocrine Intelligence Lab v3.0

A comprehensive hormone panel analysis tool with mechanism-level education, personalized protocols, circadian architecture mapping, and lifestyle optimization.

**Built by Aakriti Suri**

## Features

- **16 Hormone Panel** — Cortisol, TSH, Free T3/T4, Testosterone, Free T, Estradiol, Progesterone, LH, FSH, SHBG, Prolactin, DHEA-S, Fasting Insulin, Vitamin D, HbA1c, IGF-1
- **Mechanism Expansions** — Click any hormone to see receptor-level mechanism of action
- **AI-Powered Analysis** — Claude integration for Huberman-style mechanistic synthesis
- **Active Pathway Detection** — Identifies biochemical cascades firing in your specific panel
- **Personalized Diet Protocols** — Condition-specific nutrition (anti-cortisol, pro-androgen, metabolic reset, thyroid support)
- **Exercise Prescriptions** — Training protocols tailored to hormonal status with sets/reps/timing
- **Circadian Architecture** — 24-hour overlay, per-hormone waveforms, testing protocols
- **Lifestyle Architecture** — Light exposure, temperature manipulation, sleep optimization, wearable-to-hormone mapping
- **Deep Dives** — Expandable educational articles on cortisol awakening response, insulin resistance, testosterone-sleep connection, SHBG

## Tech Stack

- React 18 + Vite
- Claude API (Sonnet 4) for AI analysis
- Custom SVG visualizations
- IBM Plex typography system

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Connect repo at vercel.com
3. Vercel auto-detects Vite — zero config needed
4. Live at `your-project.vercel.app`

## Architecture Decisions

- **No external chart libraries** — all visualizations are hand-rolled SVG for zero dependencies and full control
- **Mechanism-first design** — every recommendation includes the biochemical rationale
- **Circadian-anchored** — time-of-day is woven throughout, not an afterthought
- **Evidence-based protocols** — doses, timing, and study citations where available

## Educational Disclaimer

This is an educational tool, not medical advice. Always consult an endocrinologist for clinical decisions. Optimal ranges are informed by functional medicine literature (Huberman, Attia, peer-reviewed studies) and may differ from standard lab reference ranges.

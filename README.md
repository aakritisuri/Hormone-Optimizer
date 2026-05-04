# mypanel

> Empirical, age-stratified, sex-specific hormone reference ranges from NHANES. Open methodology, reproducible pipeline, model cards. Live product at [mypanelai.com](https://mypanelai.com).

[![CI](https://github.com/aakritisuri/Hormone-Optimizer/actions/workflows/ci.yml/badge.svg)](https://github.com/aakritisuri/Hormone-Optimizer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Site](https://img.shields.io/badge/live-mypanelai.com-2563eb)](https://mypanelai.com)

---

## The problem

Hormone reference ranges shape a lot of medical decisions. Whether someone is told their testosterone is "low," whether a perimenopausal woman is offered hormone therapy, whether a young man is started on TRT — these calls turn on whether a lab value falls inside or outside a reference range printed on a results sheet.

Most of those reference ranges are flawed. They are derived from inconsistent reference populations, often skewed toward older or unhealthier subjects, and they are typically not stratified by age in any clinically meaningful way. The 2017 Travison et al. paper in *JCEM* showed that when you carefully define a healthy reference population — excluding obesity, diabetes, opioid use, hypertension, and reproductive disorders — the resulting testosterone ranges differ substantially from those used by major commercial labs.

The Endocrine Society has flagged the same problem repeatedly. Despite this, the ranges most people see on their lab reports have not caught up.

This project is an attempt to do it properly, in the open.

## What this project is

A research pipeline that derives empirical hormone reference ranges from NHANES — the CDC's nationally representative health survey — using an explicit, defensible healthy-subsample definition, and publishes the resulting ranges as versioned, citable artifacts that a consumer-facing product can consume directly.

The work is structured as a monorepo:

- **`python/`** — the research pipeline. Loads NHANES data, applies exclusion criteria, fits empirical percentiles with bootstrap confidence intervals, validates against published clinical ranges, and emits versioned JSON artifacts.
- **`frontend/`** — the React app deployed at [mypanelai.com](https://mypanelai.com). Consumes the artifacts as static data.
- **`artifacts/`** — versioned reference range outputs (`reference_ranges_v1.0.0.json`, etc.). The bridge between research and product.
- **`data/`** — raw NHANES (gitignored), processed (gitignored), synthetic (committed for tests).

The architectural decision worth flagging: the Python pipeline does not serve live predictions. It generates artifacts that the frontend consumes statically. This keeps deployment simple (the frontend stays a fast Vite/Vercel app with no Python runtime in production) while the research pipeline can be as deep and reproducible as the science demands. Live ML inference is a v2.0 question, not a v1.0 one.

## Why this approach

A few principles are guiding this work, and they shape decisions throughout the codebase:

**Empirical over prescriptive.** Most "optimal range" content online is built from functional-medicine intuitions or single-paper extrapolations. This project uses a large, nationally representative dataset and reports what the distribution actually looks like in healthy people, with confidence intervals that reflect sample size. Where empirical ranges disagree with published clinical ranges, both are shown.

**Explicit healthy-population definition.** The choice of who counts as "healthy" *is* the science. Replicating Travison's exclusion criteria and documenting them cell-by-cell in the methodology notebook is more important than any modeling choice that follows.

**Versioned, citable artifacts.** Every reference range output is tagged with the NHANES cycles used, exclusion criteria applied, sample sizes per stratum, fit timestamp, and git commit hash. If the methodology changes, the version number changes, and downstream consumers (the frontend, anyone else) can pin to a specific version.

**Honest model cards.** Each artifact ships with a model card in the Mitchell et al. 2019 format, including limitations: NHANES is US-population, free testosterone isn't measured directly, sample sizes thin out at the age extremes, the healthy-subsample definition is contested. Limitations sections are not legal disclaimers; they're how the project earns trust.

## Current status

This README is being written during active development. Here is what's actually done and what isn't:

**Built and deployed:**
- Live consumer product at [mypanelai.com](https://mypanelai.com): hormone panel input, reference range comparison, mechanism-level education, PDF report export. Currently uses ranges drawn from clinical literature (LabCorp, Quest, Endocrine Society guidelines), not yet the empirical ranges this pipeline will produce.
- Repo restructured into the python/frontend monorepo described above.
- Python tooling fully configured: `uv` for environments, `ruff` and `black` for lint and format, `mypy` for type checking, `pytest` with `hypothesis` for tests.
- GitHub Actions CI running lint, typecheck, and tests on every push.
- MIT licensed, citation metadata (`CITATION.cff`), reproducible via `make setup`.

**In active development:**
- NHANES download and processing pipeline (Phase 2).
- Empirical reference range estimator with bootstrap CIs (Phase 2).
- Validation notebooks comparing empirical vs. published ranges (Phase 2).
- Frontend integration to consume the empirical artifact (Phase 3).
- v1.0.0 model card and tagged release (Phase 3).

**Not yet planned:**
- Free testosterone (calculated or directly measured) — out of scope for v1.0, deferred to v2.0.
- Non-US populations — explicit limitation. NHANES is US-only. Generalizability to South Asian or other populations is uncertain and will be flagged in the model card.
- Longitudinal personal tracking — a v2.0 capability that requires architecture this version doesn't have.

The roadmap below is the plan to get from current state to v1.0.

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1. Foundation | Monorepo structure, Python tooling, CI, license, citation | ✅ Complete |
| 2. NHANES pipeline | Download, healthy-subsample definition, empirical estimator with bootstrap CIs, validation against published ranges | 🚧 In progress |
| 3. Integration & v1.0 | Frontend consumes artifact, model card, README essay, tag v1.0.0 | Planned |
| 4. Extensions | Free testosterone modeling, longitudinal tracking, non-Western population study | Future |

## Reproducibility

Everything in this repo is designed to be reproducible from a clean machine.

```bash
git clone https://github.com/aakritisuri/Hormone-Optimizer.git
cd Hormone-Optimizer
make setup    # installs python (uv) and frontend (npm) dependencies
make test     # runs the Python test suite
```

Once the NHANES pipeline lands in Phase 2:

```bash
make data           # downloads NHANES cycles H and I
make build-ranges   # generates artifacts/reference_ranges_vX.Y.Z.json
```

CI runs on every push to every branch. Lint, type check, and tests all run on Python 3.11.

## Key references

The work this project builds on:

- Travison TG, et al. (2017). *Harmonized reference ranges for circulating testosterone levels in men of four cohort studies in the United States and Europe.* Journal of Clinical Endocrinology & Metabolism, 102(4): 1161–1173.
- Bhasin S, et al. (2018). *Testosterone Therapy in Men With Hypogonadism: An Endocrine Society Clinical Practice Guideline.* JCEM, 103(5): 1715–1744.
- Vesper HW, et al. (2014). *Interlaboratory comparison study of serum total testosterone measurements performed by mass spectrometry methods.* Steroids, 79: 35–44.
- Mitchell M, et al. (2019). *Model Cards for Model Reporting.* Proceedings of FAT* 2019.
- NHANES documentation: [wwwn.cdc.gov/nchs/nhanes](https://wwwn.cdc.gov/nchs/nhanes/)

## About

Built by [Aakriti Suri](https://github.com/aakritisuri). This project sits at the intersection of two long-term interests: rigorous applied ML for healthcare, and the open-science approach that I think the longevity field needs more of. It is part of a broader portfolio of work building toward AI-native tools for personal medicine.

Feedback, critique, and collaboration are welcome — open an issue or reach out.

## License

MIT — see [LICENSE](LICENSE).

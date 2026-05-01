# mypanel

Empirical hormone reference ranges derived from NHANES, with a React frontend at [mypanelai.com](https://mypanelai.com).

> **Status:** Restructuring toward v1.0. Full README essay coming Day 14 of the build.

## Structure

- `python/` — research pipeline that generates versioned reference range artifacts
- `frontend/` — React app consuming the artifacts
- `artifacts/` — versioned JSON outputs (the bridge between python and frontend)
- `data/` — raw NHANES (gitignored), processed, and synthetic test data

## Quick start
```bash
make setup
make test
```

## License

MIT — see [LICENSE](LICENSE).

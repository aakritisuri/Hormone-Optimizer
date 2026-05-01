# Learnings

A running log of concepts, tools, and patterns I'm learning while building this repo.

## Day 1 — 2026-04-30

- **`git mv` vs `mv`:** `git mv` tells git "this is a rename, not a delete + create" so history is preserved.
- **Branches:** `git checkout -b name` creates a new branch and switches to it. `main` stays clean while you work on a feature branch.
- **Virtual environments (`uv venv`):** isolates a project's Python libraries from the system. `source .venv/bin/activate` enters it; `deactivate` exits.
- **`pyproject.toml`:** modern replacement for `requirements.txt` + `setup.py`. Single source of truth for dependencies, build config, and tool configs.
- **Editable install (`uv pip install -e .`):** installs the project so code changes take effect without reinstalling.
- **Makefile:** shortcut menu for long commands. Indentation MUST be tabs, not spaces.
- **Conventional Commits:** `type(scope): description`. Types: feat, fix, docs, chore, refactor, test, ci, build.
- **Long-running processes:** `npm run dev` keeps running until Ctrl+C, even if the terminal window closes. Always Ctrl+C before closing.

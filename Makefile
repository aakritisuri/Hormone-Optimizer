.PHONY: setup data train test lint format clean

setup:
	cd python && uv venv && uv pip install -e ".[dev]"
	cd frontend && npm install

data:
	cd python && .venv/bin/python scripts/download_nhanes.py

test:
	cd python && .venv/bin/pytest

lint:
	cd python && .venv/bin/ruff check src tests && .venv/bin/mypy src

format:
	cd python && .venv/bin/black src tests && .venv/bin/ruff check --fix src tests

build-ranges:
	cd python && .venv/bin/python scripts/build_reference_ranges.py

clean:
	rm -rf python/.venv python/.pytest_cache python/**/__pycache__

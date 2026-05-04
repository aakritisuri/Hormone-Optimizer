"""Smoke tests: package imports, synthetic data loads, basic sanity checks."""

import pathlib

import pandas as pd
import pytest

REPO_ROOT = pathlib.Path(__file__).resolve().parents[2]
SYNTHETIC_CSV = REPO_ROOT / "data" / "synthetic" / "testosterone_synthetic.csv"


class TestPackageImports:
    def test_import_mypanel(self):
        import mypanel  # noqa: F401

    def test_import_submodules(self):
        import mypanel.data  # noqa: F401
        import mypanel.reference  # noqa: F401
        import mypanel.utils  # noqa: F401
        import mypanel.validation  # noqa: F401


class TestSyntheticData:
    @pytest.fixture()
    def df(self):
        return pd.read_csv(SYNTHETIC_CSV)

    def test_file_exists(self):
        assert SYNTHETIC_CSV.exists(), f"Missing {SYNTHETIC_CSV}"

    def test_expected_columns(self, df):
        expected = {"subject_id", "age", "sex", "testosterone_ng_dl"}
        assert set(df.columns) == expected

    def test_row_count(self, df):
        assert len(df) == 200

    def test_no_nulls(self, df):
        assert df.notna().all().all(), f"Nulls found:\n{df.isnull().sum()}"

    def test_age_range(self, df):
        assert df["age"].min() >= 20
        assert df["age"].max() <= 80

    def test_testosterone_positive(self, df):
        assert (df["testosterone_ng_dl"] > 0).all()

    def test_testosterone_plausible_range(self, df):
        assert df["testosterone_ng_dl"].min() > 50, "Implausibly low value"
        assert df["testosterone_ng_dl"].max() < 2000, "Implausibly high value"

    def test_sex_column(self, df):
        assert (df["sex"] == "M").all()

    def test_subject_ids_unique(self, df):
        assert df["subject_id"].is_unique

"""Property-based tests using Hypothesis for synthetic data generation."""

import numpy as np
import pandas as pd
from hypothesis import given, settings
from hypothesis import strategies as st


def generate_synthetic_testosterone(seed: int, n: int, min_age: int, max_age: int) -> pd.DataFrame:
    """Generate synthetic testosterone data with given parameters."""
    rng = np.random.default_rng(seed)
    ages = rng.integers(min_age, max_age + 1, size=n)

    baseline_mean = 600
    decline_rate = 0.01

    age_adjusted_mean = np.where(
        ages <= 30,
        baseline_mean,
        baseline_mean * (1 - decline_rate) ** (ages - 30),
    )

    cv = 0.25
    sigma = np.sqrt(np.log(1 + cv**2))
    mu = np.log(age_adjusted_mean) - sigma**2 / 2

    testosterone = rng.lognormal(mean=mu, sigma=sigma)

    return pd.DataFrame(
        {
            "subject_id": np.arange(1, n + 1),
            "age": ages,
            "sex": "M",
            "testosterone_ng_dl": np.round(testosterone, 1),
        }
    )


class TestSyntheticGenerationProperties:
    @given(seed=st.integers(0, 2**32 - 1))
    @settings(max_examples=50)
    def test_testosterone_always_positive(self, seed):
        df = generate_synthetic_testosterone(seed=seed, n=100, min_age=20, max_age=80)
        assert (df["testosterone_ng_dl"] > 0).all()

    @given(seed=st.integers(0, 2**32 - 1))
    @settings(max_examples=50)
    def test_no_nulls_any_seed(self, seed):
        df = generate_synthetic_testosterone(seed=seed, n=100, min_age=20, max_age=80)
        assert df.notna().all().all()

    @given(
        n=st.integers(1, 500),
        seed=st.integers(0, 2**32 - 1),
    )
    @settings(max_examples=50)
    def test_row_count_matches_n(self, n, seed):
        df = generate_synthetic_testosterone(seed=seed, n=n, min_age=20, max_age=80)
        assert len(df) == n

    @given(seed=st.integers(0, 2**32 - 1))
    @settings(max_examples=50)
    def test_older_cohort_lower_mean(self, seed):
        young = generate_synthetic_testosterone(seed=seed, n=500, min_age=20, max_age=30)
        old = generate_synthetic_testosterone(seed=seed, n=500, min_age=60, max_age=80)
        assert young["testosterone_ng_dl"].mean() > old["testosterone_ng_dl"].mean()

    @given(seed=st.integers(0, 2**32 - 1))
    @settings(max_examples=50)
    def test_subject_ids_unique(self, seed):
        df = generate_synthetic_testosterone(seed=seed, n=200, min_age=20, max_age=80)
        assert df["subject_id"].is_unique

import { useCallback, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;
const POLL_INTERVAL_MS = 30000;

export function useLivePrediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLivePrediction = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/api/live-prediction`);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const payload = await res.json();
      setData(payload);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load live prediction",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivePrediction();
    const interval = setInterval(fetchLivePrediction, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchLivePrediction]);

  return {
    data,
    loading,
    error,
    refresh: fetchLivePrediction,
    pollIntervalMs: POLL_INTERVAL_MS,
  };
}

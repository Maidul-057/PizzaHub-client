"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

// Small data-fetching hook: { data, loading, error, reload }
export function useFetch(path, { params, auth = false, enabled = true } = {}) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null });
  const [tick, setTick] = useState(0);
  const key = JSON.stringify([path, params, auth, enabled]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path, { params, auth })
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((err) => !cancelled && setState({ data: null, loading: false, error: err.message }));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}

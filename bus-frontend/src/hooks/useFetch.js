import { useEffect, useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export default function useFetch(path, { method = 'GET', body = null, headers = {}, skip = false, deps = [] } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const doFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });
      const isJson = res.headers.get('content-type')?.includes('application/json');
      const payload = isJson ? await res.json() : await res.text();
      if (!res.ok) throw new Error((payload && payload.message) || res.statusText || 'Request failed');
      setData(payload);
      return payload;
    } catch (e) {
      setError(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, [path, method, JSON.stringify(body), JSON.stringify(headers), ...deps]);

  useEffect(() => {
    if (!skip) {
      doFetch();
    }
  }, [doFetch, skip]);

  return { data, error, loading, refetch: doFetch };
}

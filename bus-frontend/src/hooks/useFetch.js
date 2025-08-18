import { useState, useEffect, useCallback, useRef } from 'react'
import { getToken } from '../utils/auth'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function useFetch({ 
  url, 
  method = 'GET', 
  body = null, 
  headers = {}, 
  auth = false, 
  auto = true, 
  deps = [] 
}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  const fetchData = useCallback(async (customBody = body) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setLoading(true)
    setError(null)

    try {
      const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers
      }

      if (auth) {
        const token = getToken()
        if (token) {
          requestHeaders.Authorization = `Bearer ${token}`
        }
      }

      const config = {
        method,
        headers: requestHeaders,
        signal: abortControllerRef.current.signal
      }

      if (customBody && method !== 'GET') {
        config.body = JSON.stringify(customBody)
      }

      const response = await fetch(`${API_BASE}${url}`, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      return result
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err)
        throw err
      }
    } finally {
      setLoading(false)
    }
  }, [url, method, JSON.stringify(body), JSON.stringify(headers), auth, ...deps])

  const refetch = useCallback((customBody) => {
    return fetchData(customBody)
  }, [fetchData])

  useEffect(() => {
    if (auto) {
      fetchData()
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData, auto])

  return { data, loading, error, refetch, setData }
}
'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PointLog } from '@/types'

interface UsePointsReturn {
    logs: PointLog[]
    loading: boolean
    error: string | null
    refetch: () => void
}

/**
 * Fetches point_logs for a given user.
 * Used on the Profile page to display point history.
 */
export function usePoints(userId: string | undefined): UsePointsReturn {
    const [logs, setLogs] = useState<PointLog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tick, setTick] = useState(0)

    const refetch = useCallback(() => setTick((t) => t + 1), [])

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        let cancelled = false

        ; (async () => {
            setLoading(true)
            setError(null)

            try {
                const res = await fetch(`/api/users/${userId}/point-logs`)
                if (!res.ok) throw new Error(await res.text())
                
                const data = await res.json()
                
                if (!cancelled) {
                    setLogs(data)
                }
            } catch (err: any) {
                if (!cancelled) setError(err.message)
            } finally {
                if (!cancelled) setLoading(false)
            }
        })()

        return () => { cancelled = true }
    }, [userId, tick])

    return { logs, loading, error, refetch }
}

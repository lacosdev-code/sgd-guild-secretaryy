'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
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
    const [supabase] = useState(() => createClient())

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
                    const { data, error: fetchError } = await supabase
                        .from('point_logs')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false })

                    if (!cancelled) {
                        if (fetchError) {
                            setError(fetchError.message)
                        } else {
                            setLogs((data ?? []) as PointLog[])
                        }
                    }
                } catch (err: any) {
                    if (!cancelled) setError(err.message)
                } finally {
                    if (!cancelled) setLoading(false)
                }
            })()

        return () => { cancelled = true }
    }, [userId, tick, supabase])

    return { logs, loading, error, refetch }
}

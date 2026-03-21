import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './use-auth'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
      }

      setProfile(data || null)
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  return { profile, loading }
}

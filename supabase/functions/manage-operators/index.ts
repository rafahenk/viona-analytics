import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    })

    const jwt = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(jwt)
    if (userError || !user) {
      throw new Error(`Unauthorized: ${userError?.message || 'Invalid token'}`)
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role, organization_id, is_super_admin')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'operator' && !profile?.is_super_admin) {
      throw new Error('Forbidden: Apenas gestores podem realizar esta ação.')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })

    if (req.method === 'POST') {
      const { username, password, fullName } = await req.json()
      if (!username || !password || !fullName) throw new Error('Dados incompletos')

      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_.-]/g, '')
      const email = `${cleanUsername}@operator.viona.local`

      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: fullName },
      })

      if (createError) {
        if (createError.message.includes('already exists')) {
          throw new Error('Este nome de usuário já está em uso.')
        }
        throw createError
      }

      const { error: insertProfileError } = await supabaseAdmin.from('profiles').insert({
        id: userData.user.id,
        organization_id: profile?.organization_id,
        full_name: fullName,
        role: 'operator',
        username: cleanUsername,
      })

      if (insertProfileError) {
        await supabaseAdmin
          .from('profiles')
          .update({
            organization_id: profile?.organization_id,
            full_name: fullName,
            role: 'operator',
            username: cleanUsername,
          })
          .eq('id', userData.user.id)
      }

      return new Response(JSON.stringify({ success: true, user: userData.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (req.method === 'PUT') {
      const { userId, newPassword } = await req.json()
      if (!userId || !newPassword) throw new Error('Dados incompletos')

      const { data: targetProfile } = await supabaseAdmin
        .from('profiles')
        .select('organization_id, role')
        .eq('id', userId)
        .single()

      if (!targetProfile) throw new Error('User not found')

      if (!profile?.is_super_admin) {
        if (
          targetProfile.organization_id !== profile?.organization_id ||
          targetProfile.role !== 'operator'
        ) {
          throw new Error('Não é possível alterar este usuário.')
        }
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      })
      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (req.method === 'DELETE') {
      const { userId } = await req.json()
      if (!userId) throw new Error('Missing userId')

      const { data: targetProfile } = await supabaseAdmin
        .from('profiles')
        .select('organization_id, role')
        .eq('id', userId)
        .single()

      if (!targetProfile) throw new Error('User not found')

      if (!profile?.is_super_admin) {
        if (
          targetProfile.organization_id !== profile?.organization_id ||
          targetProfile.role !== 'operator'
        ) {
          throw new Error('Não é possível remover este usuário.')
        }
      }

      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (deleteError) throw deleteError

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

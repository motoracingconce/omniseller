import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    if (data.user) {
      try {
        await supabaseAdmin.from('users').upsert({
          id: data.user.id,
          email: data.user.email!,
          plan: 'trial',
          searches_used: 0,
          searches_limit: 3,
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: 'id', ignoreDuplicates: true })
      } catch { /* non-fatal */ }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}

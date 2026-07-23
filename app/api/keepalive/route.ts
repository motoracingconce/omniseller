import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('users').select('id').limit(1)
  return Response.json({ ok: !error, ts: Date.now() })
}

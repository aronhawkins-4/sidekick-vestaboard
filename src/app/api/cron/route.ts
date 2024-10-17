import { createClient } from '@/app/utils/supabase/server';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET() {
  const supabase = createClient();
  const { data: messages, error } = await supabase.from('messages').select().gte('post_dateTime', new Date().toISOString());
  if (error) {
    console.error(error);
    return Response.json({ ok: false, message: error.message });
  }
  console.log(messages?.length);
  return Response.json({ ok: true, message: `Hello from ${process.env.VERCEL_REGION}` });
}

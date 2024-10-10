'use server';
import { createClient } from '@/app/utils/supabase/server';
import { IBoard } from 'vestaboard-api/lib/cjs/VB-Original-Types';

export const scheduleVestaMessage = async (
  id: string | null | undefined,
  messageArray: IBoard | null | undefined,
  startDateTime: string | null | undefined,
  startTimeZone: string | null | undefined
) => {
  if (!id || !messageArray || !startDateTime || !startTimeZone) {
    return { ok: false, message: 'Some parameters missing' };
  }
  console.log(messageArray);
  const supabase = createClient();
  const { error } = await supabase.from('messages').insert({ id: id, post_dateTime: startDateTime, post_timeZone: startTimeZone, message_array: messageArray });

  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true, message: 'Message successfully scheduled' };
};

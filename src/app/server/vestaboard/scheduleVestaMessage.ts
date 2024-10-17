'use server';
import { createClient } from '@/app/utils/supabase/server';
import { IBoard } from 'vestaboard-api/lib/cjs/VB-Original-Types';

export const scheduleVestaMessage = async (
  id: string | null | undefined,
  charCodeArray: IBoard | null | undefined,
  startDateTime: string | null | undefined,
  startTimeZone: string | null | undefined
) => {
  if (!id || !charCodeArray || !startDateTime || !startTimeZone) {
    return { ok: false, message: 'Some parameters missing' };
  }
  console.log(charCodeArray);
  const supabase = createClient();
  const { error } = await supabase.from('messages').insert({ id: id, post_dateTime: startDateTime, post_timeZone: startTimeZone, message_array: charCodeArray });

  if (error) {
    console.error(error);
    let errorMessage = '';
    switch (error.code) {
      case '23505':
        errorMessage = 'Another message is already scheduled to post at that time';
        break;
      default:
        errorMessage = error.message;
    }
    return { ok: false, message: errorMessage };
  }
  return { ok: true, message: 'Message successfully scheduled' };
};

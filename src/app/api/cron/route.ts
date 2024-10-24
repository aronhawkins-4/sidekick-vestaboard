import { createClient } from '@/app/utils/supabase/server';
import { VestaboardControlMode, VestaRW } from 'vestaboard-api';
import { IBoard } from 'vestaboard-api/lib/cjs/VB-Original-Types';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.from('messages').select();
    const nowTime = new Date();
    if (error) {
      console.error(error);
      return Response.json({ ok: false, message: error.message, data: null });
    }
    const messageToPost = data.filter((message) => {
      const postDateTime = new Date(message.post_dateTime!);
      return isWithinOneHour(postDateTime, nowTime);
    })[0];
    if (messageToPost) {
      const vesta = new VestaRW({ apiReadWriteKey: process.env.VESTABOARD_READ_WRITE_KEY || '', mode: VestaboardControlMode.RW });
      const currentMessageOnBoard = await vesta.readFromBoard();
      const messageToPostArray = messageToPost.message_array as number[][];
      if (deepEqual(currentMessageOnBoard.currentMessage.layout, messageToPostArray)) {
        return Response.json({
          ok: true,
          message: `Message to post equals the current message on the board. The message on the board is: ${currentMessageOnBoard.currentMessage.layout}`,
          data: { postedMessage: messageToPostArray },
        });
      }
      const postedMessage = await vesta.postMessage(messageToPostArray as IBoard);
      return Response.json({
        ok: true,
        message: 'Posting new message to the board',
        data: { postedMessage: postedMessage },
      });
    }
    return Response.json({ ok: true, message: `No message to post for run on: ${nowTime.toISOString()}`, data: null });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json({ ok: false, message: `Something went wrong. Error: ${error.message}`, data: null });
  }
}

// const isWithinFiveMinutes = (targetTime: Date, currentTime: Date) => {
//   // Convert times to milliseconds
//   const targetTimeMs = targetTime.getTime();
//   const currentTimeMs = currentTime.getTime();
//   console.log(targetTimeMs, currentTimeMs);
//   // Calculate the difference in milliseconds
//   const timeDifferenceMs = targetTimeMs - currentTimeMs;
//   console.log(timeDifferenceMs);
//   // Check if the difference is within 5 minutes 30 seconds (330,000 milliseconds)
//   return timeDifferenceMs >= 0 && timeDifferenceMs <= 330000;
// };
const isWithinOneHour = (targetTime: Date, currentTime: Date) => {
  // Convert times to milliseconds
  const targetTimeMs = targetTime.getTime();
  const currentTimeMs = currentTime.getTime();
  console.log(targetTimeMs, currentTimeMs);
  // Calculate the difference in milliseconds
  const timeDifferenceMs = targetTimeMs - currentTimeMs;
  console.log(timeDifferenceMs);
  // Check if the difference is within 1 hour 30 seconds (3,630,000 milliseconds)
  return timeDifferenceMs >= 0 && timeDifferenceMs <= 3630000;
};

function deepEqual(arr1: number[] | number[][], arr2: number[] | number[][]) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
      // If both elements are arrays, recursively compare them
      //@ts-expect-error arr1 will be an array because of the check above
      if (!deepEqual(arr1[i], arr2[i])) {
        return false;
      }
    } else if (arr1[i] !== arr2[i]) {
      // If elements are not arrays and not equal, return false
      return false;
    }
  }

  return true;
}

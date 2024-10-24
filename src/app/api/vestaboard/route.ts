import { VestaboardControlMode, VestaRW } from 'vestaboard-api';
import { IBoard } from 'vestaboard-api/lib/cjs/VB-Original-Types';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function POST(request: Request) {
  try {
    const authKey = request.headers.get('auth_key');
    if (authKey !== process.env.SECRET_AUTH_KEY) {
      return Response.json({
        ok: false,
        message: 'Unauthorized',
        data: null,
      });
    }
    const json = await request.json();
    const messageToPost = json.message;

    if (!messageToPost) {
      return Response.json({
        ok: false,
        message: 'No message provided',
        data: null,
      });
    }

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json({ ok: false, message: `Something went wrong. Error: ${error.message}`, data: null });
  }
}

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

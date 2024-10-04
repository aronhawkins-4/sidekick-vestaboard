'use server';
import { VestaboardControlMode, VestaRW } from 'vestaboard-api';
import { IBoard } from 'vestaboard-api/lib/cjs/VB-Original-Types';

export const postVestaMessage = async (charArray: IBoard) => {
  console.log(charArray);

  const vesta = new VestaRW({ apiReadWriteKey: process.env.VESTABOARD_READ_WRITE_KEY || '', mode: VestaboardControlMode.RW });

  const messageResponse = await vesta.postMessage(charArray);
  console.log(messageResponse);
};

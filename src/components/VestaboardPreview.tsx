/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Input } from '@/components/ui/input';
import React, { createRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { COLUMN_NUMBER, ROW_NUMBER, TILE_NUMBER } from '../app/utils';
import { postVestaMessage } from '@/app/server/vestaboard/postVestaMessage';
import { convertToCharCode } from '@/app/lib/convertToCharCode';
import { IBoard } from 'vestaboard-api/lib/cjs/VB-Original-Types';
import { Color, ColorSwatch } from './ColorSwatch';
import { VestaboardTile } from './VestaboardTile';
import { getEvents } from '@/app/server/google-calendar/getEvents';

export const VestaboardPreview = () => {
  const [inputRefsArray] = useState(() => Array.from({ length: TILE_NUMBER }, () => createRef<HTMLInputElement>()));
  const [currentIndex, setCurrentIndex] = useState(-2);
  const boardRef = useRef<HTMLDivElement>(null);
  const [flatMessageArray, setFlatMessageArray] = useState(Array(TILE_NUMBER).fill(0));
  const [currentColor, setCurrentColor] = useState<{ name: Color; charCode: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (currentIndex === TILE_NUMBER) {
      setCurrentIndex(0);
    } else if (currentIndex > TILE_NUMBER) {
      setCurrentIndex(currentIndex % TILE_NUMBER);
    } else if (currentIndex < 0 && currentIndex !== -2) {
      setCurrentIndex(TILE_NUMBER - 1);
    } else if (currentIndex !== -2) {
      inputRefsArray[currentIndex].current?.focus();
    }
  }, [currentIndex]);

  const handleClear = () => {
    inputRefsArray.forEach((inputRef) => {
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.style.backgroundColor = 'transparent';
      }
    });
    setFlatMessageArray(Array(TILE_NUMBER).fill(0));
  };
  const updateFlatMessageArray = (value: number, index: number) => {
    setFlatMessageArray((current) => {
      return [...current.slice(0, index), value, ...current.slice(index + 1)];
    });
  };
  const handlePostMessage = () => {
    const formattedCharArray: number[][] = [];
    let nestedArray: number[] = [];
    flatMessageArray.map((value, index) => {
      if (index === 0) {
        nestedArray.push(value);
      } else if (index === TILE_NUMBER - 1) {
        nestedArray.push(value);
        formattedCharArray.push(nestedArray);
      } else if (index % COLUMN_NUMBER !== 0) {
        nestedArray.push(value);
      } else {
        formattedCharArray.push(nestedArray);
        nestedArray = [];
        nestedArray.push(value);
      }
    });
    postVestaMessage(formattedCharArray as IBoard);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.addEventListener('mouseup', () => {
        setIsDragging(false);
      });
    }
  });

  return (
    <div className='flex flex-col gap-4 items-stretch justify-stretch w-full'>
      <div className='relative pb-[53.4%] w-full'>
        <Image fill alt='' src={'/vestaboard-board.png'} objectFit='contain' className='z-0' />
        <div className='absolute top-[11%] left-[5%] w-[90%] h-[78%] flex flex-col justify-between z-10' ref={boardRef} onMouseDown={() => setIsDragging(true)}>
          {[...Array(ROW_NUMBER)].map((_, index) => {
            return (
              <div key={index} className='flex w-full h-[13%]'>
                {[...Array(COLUMN_NUMBER)].map((_, _index) => {
                  return (
                    <VestaboardTile
                      key={_index}
                      index={index * COLUMN_NUMBER + _index}
                      inputRef={inputRefsArray[index * COLUMN_NUMBER + _index]}
                      setCurrentIndex={setCurrentIndex}
                      onUpdate={updateFlatMessageArray}
                      color={currentColor}
                      isDragging={isDragging}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className='flex justify-center gap-2'>
        <Button onClick={handleClear} variant={'destructive'}>
          Clear
        </Button>
        <Button onClick={handlePostMessage} className='bg-white text-black hover:bg-white/90'>
          Send
        </Button>
      </div>
      <div className='flex justify-center gap-2 mt-8'>
        <ColorSwatch color={{ name: Color.RED, charCode: 63 }} setCurrentColor={setCurrentColor} />
        <ColorSwatch color={{ name: Color.ORANGE, charCode: 64 }} setCurrentColor={setCurrentColor} />
        <ColorSwatch color={{ name: Color.YELLOW, charCode: 65 }} setCurrentColor={setCurrentColor} />
        <ColorSwatch color={{ name: Color.GREEN, charCode: 66 }} setCurrentColor={setCurrentColor} />
        <ColorSwatch color={{ name: Color.BLUE, charCode: 67 }} setCurrentColor={setCurrentColor} />
        <ColorSwatch color={{ name: Color.VIOLET, charCode: 68 }} setCurrentColor={setCurrentColor} />
        <ColorSwatch color={{ name: Color.WHITE, charCode: 69 }} setCurrentColor={setCurrentColor} />
        <ColorSwatch color={{ name: Color.BLACK, charCode: 70 }} setCurrentColor={setCurrentColor} />
        <ColorSwatch color={{ name: Color.ERASE, charCode: 0 }} setCurrentColor={setCurrentColor} />
        <ColorSwatch color={null} setCurrentColor={setCurrentColor} />
      </div>
    </div>
  );
};

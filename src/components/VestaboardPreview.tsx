/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Input } from '@/components/ui/input';
import React, { createRef, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { COLUMN_NUMBER, ROW_NUMBER, TILE_NUMBER } from '../app/utils';
import { postVestaMessage } from '@/app/server/vestaboard/postVestaMessage';
import { convertCharToCharCode } from '@/app/lib/convertCharToCharCode';
import { IBoard } from 'vestaboard-api/lib/cjs/VB-Original-Types';
import { Color, ColorSwatch } from './ColorSwatch';
import { VestaboardTile } from './VestaboardTile';
import { getEvents } from '@/app/server/google-calendar/getEvents';
import { calendar_v3 } from 'googleapis';
import { EventsDialog } from './EventsDialog';
import { Textarea } from './ui/textarea';
import { Align, Justify, vbml } from '@vestaboard/vbml';
import { convertCharCodeToChar } from '@/app/lib/convertCharCodeToChar';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Baseline, Brush } from 'lucide-react';

interface VestaboardPreviewProps {
  events: calendar_v3.Schema$Event[] | undefined;
}

export const VestaboardPreview: React.FC<VestaboardPreviewProps> = ({ events }) => {
  const [inputRefsArray] = useState(() => Array.from({ length: TILE_NUMBER }, () => createRef<HTMLInputElement>()));
  const [currentIndex, setCurrentIndex] = useState(-2);
  const boardRef = useRef<HTMLDivElement>(null);
  const [flatCharCodeArray, setFlatCharCodeArray] = useState(Array(TILE_NUMBER).fill(0));
  const [flatCharArray, setFlatCharArray] = useState(Array(TILE_NUMBER).fill(''));
  const [currentColor, setCurrentColor] = useState<{ name: Color; charCode: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoLayout, setIsAutoLayout] = useState(true);

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
    inputRefsArray.forEach((inputRef, index) => {
      if (inputRef.current) {
        // inputRef.current.value = '';
        // inputRef.current.style.backgroundColor = 'transparent';
        // setCurrentColor(null);
        // setFlatCharCodeArray((current) => {
        //   return [...current.slice(0, index), 0, ...current.slice(index + 1)];
        // });
        // setFlatCharArray((current) => {
        //   return [...current.slice(0, index), '', ...current.slice(index + 1)];
        // });
      }
    });
    setFlatCharCodeArray(Array(TILE_NUMBER).fill(0));
    setFlatCharArray(Array(TILE_NUMBER).fill(''));
  };
  const handleUpdate = (charCode: number, char: string, index: number) => {
    setFlatCharCodeArray((current) => {
      return [...current.slice(0, index), charCode, ...current.slice(index + 1)];
    });
    setFlatCharArray((current) => {
      return [...current.slice(0, index), char, ...current.slice(index + 1)];
    });
  };
  const handlePostMessage = () => {
    const formattedCharCodeArray: number[][] = [];
    let nestedArray: number[] = [];
    flatCharCodeArray.map((value, index) => {
      if (index === 0) {
        nestedArray.push(value);
      } else if (index === TILE_NUMBER - 1) {
        nestedArray.push(value);
        formattedCharCodeArray.push(nestedArray);
      } else if (index % COLUMN_NUMBER !== 0) {
        nestedArray.push(value);
      } else {
        formattedCharCodeArray.push(nestedArray);
        nestedArray = [];
        nestedArray.push(value);
      }
    });
    postVestaMessage(formattedCharCodeArray as IBoard);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.document.addEventListener('mouseup', () => {
        setIsDragging(false);
      });
    }
  }, []);
  useEffect(() => {
    console.log(flatCharCodeArray);
  }, [flatCharArray, setFlatCharArray]);

  return (
    <div className='flex flex-col gap-4 items-stretch justify-stretch w-full'>
      <div className='flex justify-between'>
        <ToggleGroup type='single' variant={'outline'} className='text-white'>
          <ToggleGroupItem value='auto' onClick={() => setIsAutoLayout(true)} defaultChecked className='flex gap-2'>
            Auto <Baseline size={16} />
          </ToggleGroupItem>
          <ToggleGroupItem value='visual' onClick={() => setIsAutoLayout(false)} className='flex gap-2'>
            Visual <Brush size={16} />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button onClick={handleClear} variant={'ghost'} className='text-white'>
          Clear
        </Button>
      </div>
      <div className='relative pb-[53.4%] w-full'>
        <Image fill alt='' src={'/vestaboard-board.png'} objectFit='contain' className='z-0' />
        <div className='absolute top-[11%] left-[5%] w-[90%] h-[78%] flex flex-col justify-between z-10' ref={boardRef} onMouseDown={() => setIsDragging(true)}>
          {[...Array(ROW_NUMBER)].map((_, index) => {
            return (
              <div key={index} className='flex w-full h-[13%] overflow-hidden'>
                {[...Array(COLUMN_NUMBER)].map((_, _index) => {
                  return (
                    <VestaboardTile
                      key={_index}
                      index={index * COLUMN_NUMBER + _index}
                      inputRef={inputRefsArray[index * COLUMN_NUMBER + _index]}
                      setCurrentIndex={setCurrentIndex}
                      onUpdate={handleUpdate}
                      color={currentColor}
                      isDragging={isDragging}
                      value={flatCharArray[index * COLUMN_NUMBER + _index]}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {isAutoLayout && (
        <div>
          <Textarea
            className='bg-[#1f2123] text-white'
            onChange={(e) => {
              console.log(e.currentTarget.value);
              const messageArray = vbml.parse({
                components: [
                  {
                    style: {
                      justify: Justify.center,
                      align: Align.center,
                    },
                    template: e.currentTarget.value ?? '',
                  },
                ],
              });
              const flatCharChodeArray = messageArray.flat(6);
              const flatCharArray = flatCharChodeArray.map((charCode) => {
                return convertCharCodeToChar(charCode);
              });
              flatCharArray.forEach((char, index) => {
                handleUpdate(flatCharChodeArray[index], flatCharArray[index], index);
              });
            }}
          />
        </div>
      )}
      {!isAutoLayout && (
        <div className='flex justify-center gap-2 mt-8'>
          <ColorSwatch color={{ name: Color.RED, charCode: 63 }} setCurrentColor={setCurrentColor} currentColor={currentColor} />
          <ColorSwatch color={{ name: Color.ORANGE, charCode: 64 }} setCurrentColor={setCurrentColor} currentColor={currentColor} />
          <ColorSwatch color={{ name: Color.YELLOW, charCode: 65 }} setCurrentColor={setCurrentColor} currentColor={currentColor} />
          <ColorSwatch color={{ name: Color.GREEN, charCode: 66 }} setCurrentColor={setCurrentColor} currentColor={currentColor} />
          <ColorSwatch color={{ name: Color.BLUE, charCode: 67 }} setCurrentColor={setCurrentColor} currentColor={currentColor} />
          <ColorSwatch color={{ name: Color.VIOLET, charCode: 68 }} setCurrentColor={setCurrentColor} currentColor={currentColor} />
          <ColorSwatch color={{ name: Color.WHITE, charCode: 69 }} setCurrentColor={setCurrentColor} currentColor={currentColor} />
          <ColorSwatch color={{ name: Color.BLACK, charCode: 70 }} setCurrentColor={setCurrentColor} currentColor={currentColor} />
          <ColorSwatch color={{ name: Color.ERASE, charCode: 0 }} setCurrentColor={setCurrentColor} currentColor={currentColor} />
          <ColorSwatch color={null} setCurrentColor={setCurrentColor} currentColor={currentColor} />
        </div>
      )}
      <div className='flex justify-center gap-2'>
        <Button onClick={handlePostMessage} className='bg-white text-black hover:bg-white/90'>
          Post
        </Button>
        <EventsDialog events={events} setFlatCharArray={setFlatCharArray} handleUpdate={handleUpdate} />
      </div>
    </div>
  );
};

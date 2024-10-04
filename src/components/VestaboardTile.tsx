'use client';
import { convertToCharCode } from '@/app/lib/convertToCharCode';
import { COLUMN_NUMBER, TILE_NUMBER } from '@/app/utils';

import { Input } from './ui/input';
import Image from 'next/image';
import { Color } from './ColorSwatch';
import { useState } from 'react';

interface VestaboardTileProps {
  index: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onUpdate: (value: number, index: number) => void;
  color: {
    name: Color;
    charCode: number;
  } | null;
  isDragging: boolean;
}
export const VestaboardTile: React.FC<VestaboardTileProps> = ({ index, inputRef, setCurrentIndex, onUpdate, color, isDragging }) => {
  const [bgColor, setBgColor] = useState('transparent');
  const [disabled, setDisabled] = useState(false);

  return (
    <div className='relative mr-[1%]'>
      <Image fill alt='' src={'/vestaboard-tile.png'} objectFit='contain' className='z-0' />
      <Input
        ref={inputRef}
        onKeyUp={(e) => {
          if (!disabled) {
            if (inputRef.current) {
              switch (e.key) {
                case 'Backspace':
                case 'Delete':
                  inputRef.current.value = '';
                  onUpdate(0, index);
                  setCurrentIndex(index - 1);
                  break;
                case 'Enter':
                  setCurrentIndex(index + COLUMN_NUMBER);
                  break;
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowRight':
                case 'ArrowLeft':
                case 'Shift':
                case 'CapsLock':
                  break;
                case 'Tab':
                  e.preventDefault();
                  if (e.shiftKey) {
                    if (index === 0) {
                      setCurrentIndex(TILE_NUMBER - 1);
                    } else {
                      setCurrentIndex(index - 1);
                    }
                  } else {
                    if (index === TILE_NUMBER - 1) {
                      setCurrentIndex(0);
                    } else {
                      setCurrentIndex(index + 1);
                    }
                  }
                  break;
                default:
                  inputRef.current.value = e.key[0];
                  onUpdate(convertToCharCode(e.key[0]), index);
                  setCurrentIndex(index + 1);
                  break;
              }
            } else {
              e.preventDefault();
            }
          }
        }}
        onKeyDown={(e) => {
          if (!disabled) {
            if (e.key === 'Tab') {
              e.preventDefault();
            }
          } else {
            e.preventDefault();
          }
        }}
        onFocus={() => {
          setCurrentIndex(index);
          if (color) {
            switch (color.name) {
              case Color.RED:
                setBgColor('red');
                break;
              case Color.ORANGE:
                setBgColor('orange');
                break;
              case Color.YELLOW:
                setBgColor('yellow');
                break;
              case Color.GREEN:
                setBgColor('green');
                break;
              case Color.BLUE:
                setBgColor('blue');
                break;
              case Color.VIOLET:
                setBgColor('violet');
                break;
              case Color.WHITE:
                setBgColor('white');
                break;
              case Color.BLACK:
                setBgColor('black');
                break;
              default:
                setBgColor('transparent');
                break;
            }

            onUpdate(color.charCode, index);
            setDisabled(true);
            if (inputRef.current) {
              inputRef.current.value = '';
              inputRef.current?.blur();
            }
          } else {
            if (bgColor && bgColor !== 'transparent' && inputRef.current) {
              inputRef.current.value = '';
              setDisabled(false);
            }
            setBgColor('transparent');
          }
        }}
        className='w-full h-full bg-transparent border-none text-center text-white text-xl rounded-none p-0 ring-offset-transparent focus-visible:ring-none z-10 relative font-[family-name:var(--font-vestaboard)] vestaboard-tile'
        style={{ backgroundColor: bgColor }}
        onMouseEnter={() => {
          if (isDragging && color) {
            switch (color.name) {
              case Color.RED:
                setBgColor('red');
                setDisabled(true);
                break;
              case Color.ORANGE:
                setBgColor('orange');
                setDisabled(true);
                break;
              case Color.YELLOW:
                setBgColor('yellow');
                setDisabled(true);
                break;
              case Color.GREEN:
                setBgColor('green');
                setDisabled(true);
                break;
              case Color.BLUE:
                setBgColor('blue');
                setDisabled(true);
                break;
              case Color.VIOLET:
                setBgColor('violet');
                setDisabled(true);
                break;
              case Color.WHITE:
                setBgColor('white');
                setDisabled(true);
                break;
              case Color.BLACK:
                setBgColor('black');
                setDisabled(true);
                break;
              case Color.ERASE:
                setBgColor('transparent');
                setDisabled(false);
                break;
              default:
                setBgColor('transparent');
                setDisabled(false);
                break;
            }
            onUpdate(color.charCode, index);

            if (inputRef.current) {
              inputRef.current.value = '';
            }
          }
        }}
      />
    </div>
  );
};

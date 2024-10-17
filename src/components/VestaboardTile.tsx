'use client';
import { COLUMN_NUMBER, TILE_NUMBER } from '@/app/utils';

import { Input } from './ui/input';
import Image from 'next/image';
import { Color } from './ColorSwatch';
import { useEffect, useState } from 'react';
import { convertCharToCharCode } from '@/app/lib/convertCharToCharCode';

interface VestaboardTileProps {
  index: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onUpdate: (charCode: number, char: string, index: number) => void;
  color: {
    name: Color;
    charCode: number;
  } | null;
  isDragging: boolean;
  value: string;
}
export const VestaboardTile: React.FC<VestaboardTileProps> = ({ index, inputRef, setCurrentIndex, onUpdate, color, isDragging, value }) => {
  const [bgColor, setBgColor] = useState('transparent');
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (value !== ' ') {
      setBgColor('transparent');
      setDisabled(false);
    }
  }, [value]);
  return (
    <div className='relative h-full mr-[1%] overflow-hidden' style={{ backgroundColor: bgColor }}>
      <Image fill alt='' src={'/vestaboard-tile.png'} objectFit='cover' className='z-0' />
      <Input
        ref={inputRef}
        onKeyUp={(e) => {
          if (!disabled) {
            if (inputRef.current) {
              switch (e.key) {
                case 'Backspace':
                case 'Delete':
                  onUpdate(0, '', index);
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
                  onUpdate(convertCharToCharCode(e.key[0]), e.key[0], index);
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
                setBgColor('#da291c');
                break;
              case Color.ORANGE:
                setBgColor('#ff7500');
                break;
              case Color.YELLOW:
                setBgColor('#ffb81c');
                break;
              case Color.GREEN:
                setBgColor('#009a44');
                break;
              case Color.BLUE:
                setBgColor('#0084d5');
                break;
              case Color.VIOLET:
                setBgColor('#70248a');
                break;
              case Color.WHITE:
                setBgColor('#ffffff');
                break;
              case Color.BLACK:
                setBgColor('#000000');
                break;
              default:
                setBgColor('transparent');
                break;
            }

            onUpdate(color.charCode, ' ', index);
            setDisabled(true);
            if (inputRef.current) {
              inputRef.current?.blur();
            }
          } else {
            if (bgColor && bgColor !== 'transparent' && inputRef.current) {
              setDisabled(false);
              setBgColor('transparent');
            }
          }
        }}
        value={value}
        onChange={(e) => {
          e.preventDefault();
        }}
        maxLength={1}
        className='w-full h-full bg-transparent border-none text-center text-white text-xl rounded-none p-0 ring-offset-transparent focus-visible:ring-none z-10 relative font-[family-name:var(--font-vestaboard)] vestaboard-tile'
        onMouseEnter={() => {
          if (isDragging && color) {
            switch (color.name) {
              case Color.RED:
                setBgColor('#da291c');
                setDisabled(true);
                break;
              case Color.ORANGE:
                setBgColor('#ff7500');
                setDisabled(true);
                break;
              case Color.YELLOW:
                setBgColor('#ffb81c');
                setDisabled(true);
                break;
              case Color.GREEN:
                setBgColor('#009a44');
                setDisabled(true);
                break;
              case Color.BLUE:
                setBgColor('#0084d5');
                setDisabled(true);
                break;
              case Color.VIOLET:
                setBgColor('#70248a');
                setDisabled(true);
                break;
              case Color.WHITE:
                setBgColor('#ffffff');
                setDisabled(true);
                break;
              case Color.BLACK:
                setBgColor('#000000');
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
            onUpdate(color.charCode, ' ', index);
          }
        }}
      />
    </div>
  );
};

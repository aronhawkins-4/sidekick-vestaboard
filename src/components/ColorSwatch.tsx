import { Eraser, TextCursor } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

export enum Color {
  RED,
  ORANGE,
  YELLOW,
  GREEN,
  BLUE,
  VIOLET,
  WHITE,
  BLACK,
  FILLED,
  ERASE,
}
interface ColorSwatchProps {
  color: { name: Color; charCode: number } | null;
  setCurrentColor: React.Dispatch<React.SetStateAction<{ name: Color; charCode: number } | null>>;
  currentColor: {
    name: Color;
    charCode: number;
  } | null;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, setCurrentColor, currentColor }) => {
  return (
    <Button
      className={`w-8 h-12 p-0 flex items-center justify-center border-white border-[1px]  ${currentColor?.charCode === color?.charCode && 'ring-2 ring-white '} ${
        color?.name === Color.RED ? 'bg-[#da291c] hover:bg-[#da291c]' : ''
      } ${color?.name === Color.ORANGE ? 'bg-[#ff7500] hover:bg-[#ff7500]' : ''} ${color?.name === Color.YELLOW ? 'bg-[#ffb81c] hover:bg-[#ffb81c]' : ''} ${
        color?.name === Color.GREEN ? 'bg-[#009a44] hover:bg-[#009a44]' : ''
      } ${color?.name === Color.BLUE ? 'bg-[#0084d5] hover:bg-[#0084d5]' : ''} ${color?.name === Color.VIOLET ? 'bg-[#70248a] hover:bg-[#70248a]' : ''} ${
        color?.name === Color.WHITE ? 'bg-white hover:bg-white' : ''
      } ${color?.name === Color.BLACK ? 'bg-black hover:bg-black' : ''} ${color?.name === Color.FILLED ? 'bg-black hover:bg-black' : ''} ${
        color?.name === Color.ERASE ? 'bg-transparent hover:bg-transparent' : ''
      }`}
      onClick={() => setCurrentColor(color)}
    >
      {color && color.name === Color.ERASE && <Eraser className='text-white' />}
      {!color && !(color === Color.RED) && <TextCursor className='text-white' />}
    </Button>
  );
};

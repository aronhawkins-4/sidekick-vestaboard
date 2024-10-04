import { Eraser, TextCursor } from 'lucide-react';
import React from 'react';

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
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, setCurrentColor }) => {
  return (
    <button
      className={`w-8 h-12 flex items-center justify-center border-white border-[1px] ${color?.name === Color.RED && 'bg-red-600'} ${color?.name === Color.ORANGE && 'bg-orange-600'} ${
        color?.name === Color.YELLOW && 'bg-yellow-400'
      } ${color?.name === Color.GREEN && 'bg-green-600'} ${color?.name === Color.BLUE && 'bg-blue-500'} ${color?.name === Color.VIOLET && 'bg-violet-700'} ${
        color?.name === Color.WHITE && 'bg-white'
      } ${color?.name === Color.BLACK && 'bg-black'} ${color?.name === Color.FILLED && 'bg-black'} ${color?.name === Color.ERASE && 'bg-transparent'}`}
      onClick={() => setCurrentColor(color)}
    >
      {color && color.name === Color.ERASE && <Eraser className='text-white' />}
      {!color && !(color === Color.RED) && <TextCursor className='text-white' />}
    </button>
  );
};

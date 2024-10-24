'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { calendar_v3 } from 'googleapis';
import { Separator } from './ui/separator';
import { Align, Justify, vbml } from '@vestaboard/vbml';
import { postVestaMessage } from '@/app/server/vestaboard/postVestaMessage';
import { IBoard } from 'vestaboard-api/lib/cjs/VB-Original-Types';
import { scheduleVestaMessage } from '@/app/server/vestaboard/scheduleVestaMessage';
import { useToast } from '@/hooks/use-toast';
import { convertCharCodeToChar } from '@/app/lib/convertCharCodeToChar';

interface EventsDialogProps {
  events: calendar_v3.Schema$Event[] | undefined;
  setFlatCharArray: React.Dispatch<React.SetStateAction<string[]>>;
  handleUpdate: (charCode: number, char: string, index: number) => void;
}
export const EventsDialog: React.FC<EventsDialogProps> = ({ events, handleUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const sendMessage = async (event: calendar_v3.Schema$Event) => {
    const messageArray = vbml.parse({
      components: [
        {
          style: {
            justify: Justify.center,
            align: Align.center,
          },
          template: event.summary ?? '',
        },
      ],
    });
    await postVestaMessage(messageArray as IBoard);
  };

  const scheduleMessage = async (event: calendar_v3.Schema$Event) => {
    const id = event.id;
    const messageArray = vbml.parse({
      components: [
        {
          style: {
            justify: Justify.center,
            align: Align.center,
          },
          template: event.summary ?? '',
        },
      ],
    });
    const startDateTime = event.start?.dateTime;
    const startTimeZone = event.start?.timeZone;

    const response = (await scheduleVestaMessage(id, messageArray as IBoard, startDateTime, startTimeZone)) as { ok: boolean; message: string };
    if (response.ok) {
      toast({
        title: 'Success!',
        description: response.message,
      });
    } else {
      toast({
        title: 'Error!',
        description: response.message,
        variant: 'destructive',
      });
    }
  };

  const previewMessage = async (event: calendar_v3.Schema$Event) => {
    const messageArray = vbml.parse({
      components: [
        {
          style: {
            justify: Justify.center,
            align: Align.center,
          },
          template: event.summary ?? '',
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
    // setFlatCharArray(flatCharArray);
    setIsOpen(false);
  };

  if (!events) return;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant={'secondary'} onClick={() => setIsOpen(true)} className=''>
        Schedule Message
      </Button>
      <DialogContent className='max-h-screen overflow-scroll'>
        <DialogHeader>
          <DialogTitle>Events</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-8'>
          {events.map((event, index) => {
            return (
              <div key={event.id} className='flex flex-col gap-8'>
                <div className='flex flex-col gap-1 items-start'>
                  <span>Title: {event.summary}</span>
                  {event?.start?.dateTime && <span>Start date: {new Date(Date.parse(event.start.dateTime)).toLocaleString()}</span>}
                  {event?.end?.dateTime && <span>End date: {new Date(Date.parse(event.end.dateTime)).toLocaleString()}</span>}
                  <div className='flex gap-2'>
                    <Button className='mt-4' onClick={() => scheduleMessage(event)}>
                      Schedule
                    </Button>
                    <Button className='mt-4' onClick={() => sendMessage(event)}>
                      Post
                    </Button>
                    <Button className='mt-4' onClick={() => previewMessage(event)}>
                      Preview
                    </Button>
                  </div>
                </div>
                {index !== events.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

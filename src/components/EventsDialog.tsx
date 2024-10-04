'use client';
import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { calendar_v3 } from 'googleapis';
import { Separator } from './ui/separator';

interface EventsDialogProps {
  events: calendar_v3.Schema$Event[] | undefined;
}
export const EventsDialog: React.FC<EventsDialogProps> = ({ events }) => {
  if (!events) {
    return;
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={'secondary'}>Schedule Message</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Events</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-8'>
          {events.map((event, index) => {
            return (
              <>
                <div key={event.id} className='flex flex-col gap-1 items-start'>
                  <span>Title: {event.summary}</span>
                  {event?.start?.dateTime && <span>Start date: {new Date(Date.parse(event.start.dateTime)).toLocaleString()}</span>}
                  {event?.end?.dateTime && <span>End date: {new Date(Date.parse(event.end.dateTime)).toLocaleString()}</span>}
                  <Button className='mt-4'>Select</Button>
                </div>
                {index !== events.length - 1 && <Separator />}
              </>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

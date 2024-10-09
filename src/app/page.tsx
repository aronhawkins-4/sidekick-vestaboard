import { CalendarIdentifier } from '@/components/CalendarIdentifier';
import { VestaboardPreview } from '../components/VestaboardPreview';
import { EventsDialog } from '@/components/EventsDialog';
import { getEvents } from './server/google-calendar/getEvents';

export default async function Home() {
  const events = await getEvents();

  return (
    <div className='flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#181919]'>
      <main className='flex flex-col gap-8 w-[820px] items-center'>
        <VestaboardPreview />
        {/* <CalendarIdentifier /> */}
        <EventsDialog events={events} />
      </main>
    </div>
  );
}

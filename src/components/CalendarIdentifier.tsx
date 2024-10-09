import { createJwtClient } from '@/app/server/google-calendar/createJwtClient';
import { google } from 'googleapis';

export const CalendarIdentifier = async () => {
  const jwtClient = await createJwtClient();
  if (!jwtClient) {
    return;
  }
  const calendar = google.calendar({
    version: 'v3',
    auth: jwtClient,
  });
  const vestaboardCalendar = await calendar.calendars.get({ calendarId: process.env.GOOGLE_CALENDAR_ID });
  const name = vestaboardCalendar.data.summary;
  console.log(name);
  return (
    <div>
      <span className='text-white'>Current calendar: {name}</span>
    </div>
  );
};

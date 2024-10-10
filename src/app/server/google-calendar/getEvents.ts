import { google } from 'googleapis';
import { createJwtClient } from './createJwtClient';

export const getEvents = async () => {
  const jwtClient = await createJwtClient();
  console.log(jwtClient);
  const calendar = google.calendar({
    version: 'v3',
    auth: jwtClient,
  });
  const events = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    maxResults: 10,
  });

  const items = events.data.items;
  console.log(items);
  return items;
};

import { google } from 'googleapis';
import { createJwtClient } from './createJwtClient';

export const getEvents = async () => {
  const jwtClient = await createJwtClient();
  const calendar = google.calendar({
    version: 'v3',
    auth: jwtClient,
  });
  const events = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
  });

  const items = events.data.items;
  return items;
};

'use server';
import { google } from 'googleapis';
import { createJwtClient } from './createJwtClient';

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export async function getEvents() {
  const jwtClient = await createJwtClient();

  const calendar = google.calendar({
    version: 'v3',
    auth: jwtClient,
  });
  const events = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    maxResults: 10,
  });

  const items = events.data.items;
  return items;
}

import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export async function createJwtClient() {
  const jwtClient = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, undefined, process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'), SCOPES);

  return jwtClient;
}

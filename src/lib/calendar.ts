import { google } from "googleapis";

const account = new google.auth.GoogleAuth({
  keyFile: "@/../keys/facmansys-key.json",
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ],
});

google.options({ auth: account });

const calendarClient = google.calendar("v3");

export default calendarClient;

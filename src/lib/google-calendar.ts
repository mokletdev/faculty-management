import { google } from "googleapis";

const account = new google.auth.GoogleAuth({
  keyFile: "@/../keys/facmansys-key.json",
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/admin.directory.resource.calendar",
  ],
  clientOptions: {
    subject: "teguhbayu.31@moklet.org",
  },
});

google.options({ auth: account });

export const googleCalendarClient = google.calendar("v3");

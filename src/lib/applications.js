/**
 * A membership application, as sent from /apply:
 * {
 *   fullName: string,
 *   fullNameAr?: string,         // name in Arabic script, if they gave it
 *   email: string,
 *   phone?: string,              // local Jordanian mobile, digits only, no country code (07XXXXXXXX)
 *   studentId: string,           // exactly 6 digits; used to verify enrolment
 *   major: string,               // one of MAJORS, or free text when 'Other'
 *   year: string,                // one of YEARS
 *   committees: string[],        // subset of COMMITTEES
 *   skills: string[],            // subset of SKILLS
 *   otherSkills?: string,
 *   motivation: string,
 *   link?: string,               // github / portfolio / linkedin
 *   submittedAt: string,         // ISO timestamp
 *   source: 'website',
 * }
 *
 * Submissions go to a Google Sheet through a Google Apps Script web app (script
 * not written yet). Set VITE_APPLICATION_ENDPOINT — in .env.local, or Netlify's
 * environment variables — to the web app's /exec URL and the form starts sending.
 *
 * What the script has to do (doPost):
 *   - read the application with JSON.parse(e.postData.contents)
 *   - append it as a row (arrays like committees/skills joined into one cell)
 *   - reply with ContentService JSON:
 *       { ok: true, reference: 'IES-…' }   — reference is shown to the applicant
 *       { ok: false, error: '…' }          — shown as a failed submit; answers stay saved
 *   - be deployed as "Execute as: me", "Who has access: Anyone"
 *
 * The body is JSON but sent as text/plain on purpose: Apps Script doesn't answer
 * CORS preflight requests, and a text/plain POST doesn't trigger one. The script
 * reads it the same way either way.
 *
 * Without an endpoint, dev builds fake a successful submit (and log the payload)
 * so the form can be worked on, while production builds show applications as
 * closed — nobody should think they applied when nothing was saved.
 */
const ENDPOINT = import.meta.env.VITE_APPLICATION_ENDPOINT;

export const MAJORS = [
  'Electrical Engineering',
  'Computer Engineering',
  'Biomedical Engineering',
  'Mechanical Engineering',
  'Computer Science',
  'Other',
];
export const YEARS = ['1st year', '2nd year', '3rd year', '4th year', '5th year', 'Graduate'];
export const COMMITTEES = [
  { id: 'Scientific', blurb: 'workshops, projects, technical content' },
  { id: 'Media', blurb: 'design, photo/video, social media' },
  { id: 'Web', blurb: 'this site and the chapter\'s tools' },
];
export const SKILLS = [
  'Embedded C', 'PCB design', 'PLC / SCADA', 'Python', 'MATLAB / Simulink', 'Power electronics',
  'Web dev', 'Graphic design', 'Photo / video', 'Writing', 'Event organizing', 'Public speaking',
];

/** True when the form should be shown: a real endpoint, or local development. */
export const applicationsOpen = Boolean(ENDPOINT) || import.meta.env.DEV;

/** True when submits go nowhere (dev without an endpoint). */
export const submissionsStubbed = !ENDPOINT;

function localReference() {
  return `IES-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export async function submitApplication(application) {
  if (!ENDPOINT) {
    if (!import.meta.env.DEV) throw new Error('Applications are not connected yet.');
    console.info('[apply] VITE_APPLICATION_ENDPOINT not set — application NOT saved:', application);
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { reference: localReference() };
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // see note above: avoids a CORS preflight
    body: JSON.stringify(application),
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  const body = await res.json().catch(() => ({}));
  /* Apps Script always answers 200, so a script-side failure comes back as { ok: false } */
  if (body.ok === false) throw new Error(body.error || 'the sheet rejected the application');
  return { reference: body.reference ?? localReference() };
}

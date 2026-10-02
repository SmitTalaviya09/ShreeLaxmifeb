/* ============================================================
   SHREE LAXMI TEXFAB — enquiry form → Google Sheet
   ============================================================
   What this does: every time someone submits the enquiry form on the
   website, this script appends their details as a new row in the Google
   Sheet whose ID you paste in below. Rejects anything missing required
   fields. (reCAPTCHA verification removed for now — it needs a separate
   Google authorization step that kept blocking the whole endpoint; add it
   back later once that's sorted out, following the same pattern as before.)

   SETUP (one time, ~5 minutes):
   1. Create a new blank Google Sheet (sheets.new), or open the one you
      already made.
   2. Look at its URL — it looks like:
        https://docs.google.com/spreadsheets/d/THIS_LONG_PART/edit
      Copy that long ID part.
   3. Paste it into SHEET_ID below, in between the quotes.
   4. Open Apps Script for this project — either:
        - from script.google.com directly, or
        - from Drive → New → More → Google Apps Script
      (it does NOT need to be opened from inside the Sheet itself — this
      script connects to the sheet explicitly, by ID, in step 3 above, so
      it works as a standalone Apps Script project too.)
   5. Delete whatever's in the editor, paste this whole file in its place.
   6. Click Deploy → New deployment.
        - Type: "Web app"
        - Execute as: "Me"
        - Who has access: "Anyone"
   7. Click Deploy, authorize it when Google asks (it's your own script,
      acting on your own sheet — the scary-looking permission screen is
      normal for any Apps Script the first time you deploy it).
   8. Copy the Web app URL it gives you (ends in /exec).
   9. Open assets/js/main.js, find SHEET_ENDPOINT near the top of the
      form() function, and paste the URL in between the quotes.

   ALREADY DEPLOYED AND JUST FIXING THIS?
   After pasting this in, Save, then Deploy → Manage deployments → pencil
   icon → Version: "New version" → Deploy. Editing the code alone does NOT
   update what's live — that "new version" step is what pushes it.

   That's it. If you ever change the form's fields in index.html, add a
   matching line below in the sheet.appendRow(...) call so the new field
   gets its own column.
   ============================================================ */

var SHEET_ID = '10l5_jVjcAqnkjNuH6xd3OSLUKHWuVlqqnaqghkAORYg';

function doPost(e) {
  var data = e.parameter;

  if (!data.name || !data.company || !data.phone || !data.fabric || !data.qty) {
    return jsonOut({ result: 'error', reason: 'missing required fields' });
  }

  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Name', 'Company', 'Phone', 'Email',
      'Fabric Type', 'Quantity (metres)', 'Message'
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.company || '',
    data.phone || '',
    data.email || '',
    data.fabric || '',
    data.qty || '',
    data.message || ''
  ]);

  return jsonOut({ result: 'success' });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

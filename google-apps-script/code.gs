// Kavishka & Nimeshi — RSVP, attendance confirmation and wishes endpoint.
// Every submission goes to the tab for its event:
//   Wedding RSVP | Wedding Wishes | Homecoming RSVP | Homecoming Wishes
// The website sends: sheet = RSVP | WISH, event = wedding | homecoming.

const SPREADSHEET_ID = '1Gx-ZPOCyh8Rl0gxxRtBY-6kkdgqQabPGUeZzojrGe6c';

const EVENTS = {
  wedding: 'Wedding',
  homecoming: 'Homecoming',
};

const TYPES = {
  RSVP: {
    suffix: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Attending', 'Guests', 'Notes', 'Source'],
    row: (p) => [
      new Date(),
      p.fullName || '',
      p.attending || 'Yes',
      p.guests || '',
      p.dietaryNotes || '',
      p.source || 'Invitation RSVP',
    ],
  },
  WISH: {
    suffix: 'Wishes',
    headers: ['Timestamp', 'Name', 'Message'],
    row: (p) => [new Date(), p.name || '', p.message || ''],
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const payload = parsePayload_(e);
    const type = TYPES[String(payload.sheet || '').toUpperCase()];

    if (!type) {
      return jsonResponse_({ ok: false, error: 'Invalid sheet. Use RSVP or WISH.' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, sheetName_(eventKey_(payload.event), type), type.headers);
    sheet.appendRow(type.row(payload));

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Kavishka & Nimeshi form endpoint is running.',
  });
}

// Run this once from the Apps Script editor to create all four tabs with headers.
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(EVENTS).forEach((eventKey) => {
    Object.keys(TYPES).forEach((typeKey) => {
      const type = TYPES[typeKey];
      getOrCreateSheet_(ss, sheetName_(eventKey, type), type.headers);
    });
  });
}

// Anything mentioning "homecoming" goes to the homecoming tabs; everything else is the wedding.
function eventKey_(value) {
  return String(value || '').toLowerCase().indexOf('homecoming') !== -1 ? 'homecoming' : 'wedding';
}

function sheetName_(eventKey, type) {
  return EVENTS[eventKey] + ' ' + type.suffix;
}

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};

  if (Object.keys(params).length > 0) {
    return params;
  }

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) {
    return {};
  }

  if (contents.indexOf('=') !== -1 && contents.indexOf('{') !== 0) {
    return parseQueryString_(contents);
  }

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

function parseQueryString_(query) {
  const out = {};
  const pairs = String(query).split('&');

  for (let i = 0; i < pairs.length; i++) {
    const part = pairs[i];
    if (!part) continue;

    const idx = part.indexOf('=');
    const rawKey = idx >= 0 ? part.slice(0, idx) : part;
    const rawValue = idx >= 0 ? part.slice(idx + 1) : '';
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(rawValue.replace(/\+/g, ' '));

    out[key] = value;
  }

  return out;
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  ensureHeaders_(sheet, headers);
  return sheet;
}

// Makes sure row 1 holds the headers: writes them on an empty sheet,
// replaces an outdated header row, or inserts one above existing data.
function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() > 0) {
    const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (current.join('|') === headers.join('|')) return;
    if (String(sheet.getRange(1, 1).getValue()) === 'Timestamp') {
      sheet.getRange(1, 1, 1, sheet.getLastColumn()).clearContent();
    } else {
      sheet.insertRowBefore(1);
    }
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#fbe3ea')
    .setFontColor('#5a2a3a')
    .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 170);
  for (let col = 2; col <= headers.length; col++) {
    sheet.setColumnWidth(col, col === headers.length ? 360 : 180);
  }
  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

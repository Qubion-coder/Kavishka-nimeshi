# Google Sheet setup — Kavishka & Nimeshi

Sheet: https://docs.google.com/spreadsheets/d/1Gx-ZPOCyh8Rl0gxxRtBY-6kkdgqQabPGUeZzojrGe6c/edit

1. Open the sheet above and go to **Extensions > Apps Script**.
2. Delete everything in `Code.gs`, paste the full code from `google-apps-script/code.gs`, and click **Save**.
3. In the function dropdown pick `setup` and click **Run**. Approve the permission prompt
   (Advanced > Go to project > Allow). This creates four tabs with headers:
   - **Wedding RSVP** / **Homecoming RSVP**: Timestamp | Full Name | Attending | Guests | Notes | Source
   - **Wedding Wishes** / **Homecoming Wishes**: Timestamp | Name | Message
4. Click **Deploy > New deployment**, choose type **Web app**.
5. Execute as: **Me**. Who has access: **Anyone**. Click **Deploy**.
6. Copy the Web App URL (ends in `/exec`) and paste it into `src/config.ts` as `GOOGLE_SCRIPT_URL`.
7. Redeploy the site.

Where submissions land:

| Form on the site | Wedding link | Homecoming link |
|---|---|---|
| RSVP section on the invitation (Source: Invitation RSVP) | Wedding RSVP | Homecoming RSVP |
| `/confirm` and `/confirm/homecoming` (Source: Confirmation Page) | Wedding RSVP | Homecoming RSVP |
| Blessings & Wishes | Wedding Wishes | Homecoming Wishes |

Notes:
- If you change the Apps Script code later, use **Deploy > Manage deployments > Edit > New version**,
  so the URL stays the same.
- Tabs are also created automatically on the first submission if you skip step 3.

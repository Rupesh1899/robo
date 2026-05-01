# Setup Instructions: Google Sheets & Deployment

This guide will walk you through setting up your Assignment Management System with Google Sheets and deploying your portfolio.

## 1. Google Sheets & Apps Script Setup

### Step 1: Create a Google Sheet
1. Create a new Google Sheet.
2. In row 1, add these exact headers: `id`, `title`, `subject`, `date`, `status`, `driveLink`, `notes`.
3. Rename the sheet tab at the bottom to `Assignments`.

### Step 2: Add Google Apps Script
1. In your Google Sheet, click on **Extensions > Apps Script**.
2. Delete any code there and paste the following:

```javascript
const SHEET_NAME = 'Assignments';

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);
  const action = e.parameter.action;

  if (action === 'add') {
    sheet.appendRow([data.id, data.title, data.subject, data.date, data.status, data.driveLink, data.notes]);
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'update') {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] == data.id) {
        sheet.getRange(i + 1, 2, 1, 6).setValues([[data.title, data.subject, data.date, data.status, data.driveLink, data.notes]]);
        return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  if (action === 'delete') {
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] == data.id) {
        sheet.deleteRow(i + 1);
        return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
      }
    }
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  const assignments = [];
  
  for (let i = 1; i < rows.length; i++) { // Skip headers
    assignments.push({
      id: rows[i][0],
      title: rows[i][1],
      subject: rows[i][2],
      date: rows[i][3],
      status: rows[i][4],
      driveLink: rows[i][5],
      notes: rows[i][6]
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(assignments)).setMimeType(ContentService.MimeType.JSON);
}
```

### Step 3: Deploy the Script
1. Click **Deploy > New deployment** in the top right.
2. Select type: **Web app**.
3. Under "Execute as", select **Me**.
4. Under "Who has access", select **Anyone**.
5. Click **Deploy** and authorize permissions if prompted.
6. Copy the **Web app URL**.

### Step 4: Connect to your Website
1. Open `script.js` in your project.
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` on line 5 with the URL you just copied.
3. Change `const USE_MOCK_DATA = true;` to `const USE_MOCK_DATA = false;`.

---

## 2. Deployment (GitHub Pages)

1. Initialize a Git repository in your folder.
2. Push your code to a new public repository on GitHub.
3. Go to your repository settings on GitHub.
4. Go to **Pages** on the left sidebar.
5. Under Source, select **Deploy from a branch**. Select the `main` branch and click Save.
6. Your portfolio will be live at `https://yourusername.github.io/reponame`.

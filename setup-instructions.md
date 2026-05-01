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
  const action = data.action;

  if (action === 'add') {
    sheet.appendRow([data.number, data.title, data.videoUrl, data.inference, data.date]);
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === 'delete') {
    if (!data.row) {
      return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Row number required'})).setMimeType(ContentService.MimeType.JSON);
    }
    sheet.deleteRow(parseInt(data.row, 10));
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Unsupported action'})).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  const assignments = [];

  for (let i = 1; i < rows.length; i++) {
    assignments.push({
      number: rows[i][0],
      title: rows[i][1],
      videoUrl: rows[i][2],
      inference: rows[i][3],
      date: rows[i][4]
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
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the Web App URL you just copied.
3. Make sure the same Google Sheet is shared as **Anyone with the link can view** so the site can read assignments.

> If the Apps Script URL is still not configured, the upload form will save assignments locally in your browser so they still appear on the same page.

### Step 5: Publish Sheet Data for Read Access
1. In your Google Sheet, click **File > Share > Share with others**.
2. Set link access to **Anyone with the link can view**.
3. No need to share edit access to the public; the upload form writes only through the Apps Script Web App.

---

## 2. Deployment (GitHub Pages)

1. Initialize a Git repository in your folder.
2. Push your code to a new public repository on GitHub.
3. Go to your repository settings on GitHub.
4. Go to **Pages** on the left sidebar.
5. Under Source, select **Deploy from a branch**. Select the `main` branch and click Save.
6. Your portfolio will be live at `https://yourusername.github.io/reponame`.

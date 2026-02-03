// --- Helper Functions ---

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const exportToWord = (htmlContent, filename) => {
  const footerText = "@dacbpkbali - #2026 - dicetak menggunakan aplikasi supervisi dalnis";
  
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Export HTML to Word</title>
      <style>
        @page Section1 {
            size: 21.0cm 29.7cm;
            margin: 2cm 2cm 2cm 2cm;
            mso-page-orientation: portrait;
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-footer: f1; 
        }
        div.Section1 { page: Section1; }
        /* Footer style definitions */
        p.MsoFooter, li.MsoFooter, div.MsoFooter {
            margin: 0cm;
            margin-bottom: 0.0001pt;
            mso-pagination: widow-orphan;
            font-size: 8.0pt;
            font-family: "Arial", sans-serif;
            color: #888888;
            text-align: right;
            border-top: solid #EEEEEE 1.0pt;
            padding-top: 5.0pt;
        }
        div#f1 { display: none; }
      </style>
    </head>
    <body>
      <div class='Section1'>
  `;
  
  const footer = `
        <div style='mso-element:footer' id='f1'>
          <p class=MsoFooter>
            ${footerText}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const sourceHTML = header + htmlContent + footer;

  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `${filename}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

export const parseCSV = (text) => {
  const rows = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;
  
  let delimiter = ',';
  const firstLineEnd = text.indexOf('\n');
  const firstLine = text.substring(0, firstLineEnd > -1 ? firstLineEnd : text.length);
  if (firstLine.includes(';')) delimiter = ';';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i+1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"'; 
        i++;
      } else {
        inQuotes = !inQuotes; 
      }
    } 
    else if (char === delimiter && !inQuotes) {
      currentRow.push(currentVal);
      currentVal = '';
    } 
    else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++; 
      
      if (currentRow.length > 0 || currentVal) {
          currentRow.push(currentVal);
          rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } 
    else {
      currentVal += char;
    }
  }
  
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }
  
  return { rows };
};

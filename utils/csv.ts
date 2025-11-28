/**
 * Basic CSV parser that handles quoted fields and newlines within quotes.
 * This is a simplified parser for display purposes.
 */
export const parseCSV = (text: string): string[][] => {
  const result: string[][] = [];
  let row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of cell
      row.push(current.trim());
      current = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      // End of row
      if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
      
      row.push(current.trim());
      if (row.length > 0 && (row.length > 1 || row[0] !== "")) {
        result.push(row);
      }
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  // Handle last row
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.length > 0) {
        result.push(row);
    }
  }

  return result;
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
};
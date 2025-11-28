import React, { useState } from 'react';
import { Download, Table, Grid, FileSpreadsheet, Copy, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { downloadCSV } from '../utils/csv';

interface DataViewerProps {
  data: string[][];
  rawCsv: string;
  fileName: string;
}

type Tab = 'table' | 'sheets' | 'raw';

const DataViewer: React.FC<DataViewerProps> = ({ data, rawCsv, fileName }) => {
  const [activeTab, setActiveTab] = useState<Tab>('table');
  const [copied, setCopied] = useState(false);

  if (!data || data.length === 0) return null;

  const headers = data[0];
  const rows = data.slice(1);
  
  // Check if this is demo data by looking for the specific ID or content
  const isDemoData = rawCsv.includes('DEMO-DATA') || rawCsv.includes('DEMO_FALLBACK');

  const handleCopyToClipboard = async () => {
    // Convert to TSV for Google Sheets paste
    const tsv = data.map(row => row.map(cell => {
      let content = cell;
      // Escape quotes and wrap in quotes if cell contains tab, newline, or quote to ensure Sheets pastes correctly
      if (content.includes('\t') || content.includes('\n') || content.includes('"')) {
        content = `"${content.replace(/"/g, '""')}"`;
      }
      return content;
    }).join('\t')).join('\n');

    try {
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
      alert('Failed to copy to clipboard automatically. Please check permissions.');
    }
  };

  const handleOpenSheets = () => {
    handleCopyToClipboard();
    window.open('https://sheets.new', '_blank');
  };

  return (
    <div className="w-full space-y-4 animate-fade-in-up">
      
      {isDemoData && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 text-amber-800 text-sm">
           <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
           <div>
              <p className="font-semibold">Demo Mode Active</p>
              <p className="text-amber-700/80">You are viewing sample data because no valid API key was provided. To process your actual file, please click "Set API Key" in the header.</p>
           </div>
        </div>
      )}

      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div className="space-y-3 flex-1">
             <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                    <Grid className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Extracted Data</h3>
                    <p className="text-sm text-slate-500">{rows.length} rows found</p>
                </div>
            </div>
            
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('table')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Table View
                </button>
                <button
                    onClick={() => setActiveTab('sheets')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === 'sheets' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <FileSpreadsheet className="w-4 h-4" />
                    Google Sheets
                </button>
                 <button
                    onClick={() => setActiveTab('raw')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === 'raw' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Raw CSV
                </button>
            </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
            <button
            onClick={() => downloadCSV(rawCsv, `${fileName.replace('.pdf', '')}_extracted.csv`)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download CSV</span>
            <span className="sm:hidden">CSV</span>
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px] max-h-[600px]">
        
        {activeTab === 'table' && (
            <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                    {headers.map((header, idx) => (
                    <th key={idx} scope="col" className="px-6 py-4 font-semibold whitespace-nowrap border-b border-slate-200">
                        {header}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                    {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-3 whitespace-nowrap border-r border-transparent hover:border-slate-200 last:border-0">
                        {cell}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            {rows.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    <Table className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No data rows detected.</p>
                </div>
            )}
            </div>
        )}

        {activeTab === 'sheets' && (
             <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-slate-50/50">
                <div className="max-w-md w-full space-y-8">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto rotate-3 shadow-sm">
                        <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Export to Google Sheets</h3>
                        <p className="text-slate-500">
                            We've formatted your data for Google Sheets. Follow these two simple steps:
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={handleCopyToClipboard}
                            className="w-full group relative flex items-center justify-between bg-white border-2 border-slate-200 hover:border-green-500 hover:text-green-700 text-slate-700 px-6 py-4 rounded-xl font-semibold transition-all duration-200"
                        >
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-green-50 transition-colors">
                                     <Copy className="w-5 h-5" />
                                </div>
                                <span className="text-left">
                                    <span className="block text-xs text-slate-400 uppercase tracking-wider">Step 1</span>
                                    Copy Data to Clipboard
                                </span>
                             </div>
                             {copied && <Check className="w-6 h-6 text-green-500 animate-fade-in" />}
                        </button>

                        <div className="flex justify-center">
                           <div className="h-6 w-0.5 bg-slate-200"></div>
                        </div>

                        <button 
                            onClick={handleOpenSheets}
                            className="w-full group flex items-center justify-between bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                     <ExternalLink className="w-5 h-5" />
                                </div>
                                <span className="text-left">
                                    <span className="block text-xs text-green-200 uppercase tracking-wider">Step 2</span>
                                    Create New Spreadsheet
                                </span>
                             </div>
                        </button>
                    </div>
                     
                     <p className="text-xs text-slate-400 bg-white inline-block px-3 py-1 rounded-full border border-slate-100">
                        Tip: Press <kbd className="font-mono font-bold text-slate-600">Cmd/Ctrl + V</kbd> in the first cell (A1) of your new sheet.
                     </p>
                </div>
             </div>
        )}

        {activeTab === 'raw' && (
            <div className="flex-1 p-0 relative group h-full">
                <textarea 
                    className="w-full h-full p-6 font-mono text-xs text-slate-600 resize-none focus:outline-none focus:bg-slate-50 transition-colors custom-scrollbar leading-relaxed"
                    value={rawCsv}
                    readOnly
                />
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText(rawCsv);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                    className="absolute top-4 right-4 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 p-2 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                    title="Copy Raw CSV"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default DataViewer;
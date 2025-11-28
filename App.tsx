import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import DataViewer from './components/DataViewer';
import ApiKeyModal from './components/ApiKeyModal';
import { fileToBase64, extractCsvFromPdf } from './services/gemini';
import { parseCSV } from './utils/csv';
import { AppState, ExtractionResult } from './types';
import { BrainCircuit, AlertTriangle, CheckCircle2, Table, Download, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);
  
  // API Key Management
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Load saved key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setUserApiKey(savedKey);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setUserApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setIsApiKeyModalOpen(false);
    
    // If we had a file pending upload, process it now
    if (pendingFile) {
      processFile(pendingFile, key);
      setPendingFile(null);
    }
  };

  const handleUseDemo = () => {
    setIsApiKeyModalOpen(false);
    if (pendingFile) {
      processFile(pendingFile, ''); // Empty key triggers demo mode
      setPendingFile(null);
    }
  };

  const handleFileSelect = (file: File) => {
    const envKey = process.env.API_KEY;
    const hasEnvKey = envKey && envKey !== 'MISSING_KEY' && envKey !== '';
    
    // If we have an ENV key or a User key, proceed.
    // Otherwise, ask the user.
    if (hasEnvKey || userApiKey) {
      processFile(file, userApiKey);
    } else {
      setPendingFile(file);
      setIsApiKeyModalOpen(true);
    }
  };

  const processFile = async (file: File, apiKey: string) => {
    setCurrentFile(file);
    setAppState(AppState.PROCESSING);
    setError(null);
    setResult(null);
    setProcessingTime(0);
    
    const timer = setInterval(() => {
        setProcessingTime(prev => prev + 0.1);
    }, 100);

    try {
      const base64 = await fileToBase64(file);
      // Pass the userApiKey (if exists) to the service
      const csvString = await extractCsvFromPdf(base64, apiKey);
      const parsed = parseCSV(csvString);
      
      setResult({
        rawCsv: csvString,
        parsedData: parsed
      });
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while processing the PDF.");
      setAppState(AppState.ERROR);
    } finally {
      clearInterval(timer);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCurrentFile(null);
    setResult(null);
    setError(null);
    setProcessingTime(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <Header onOpenApiKey={() => setIsApiKeyModalOpen(true)} hasKey={!!userApiKey} />

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onSave={handleSaveApiKey} 
        onUseDemo={handleUseDemo}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Hero / Intro Section */}
        <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Turn PDFs into <span className="text-indigo-600">Excel</span> instantly.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Upload scanned invoices, bank statements, or messy reports. 
              Our AI thinks through the visual layout to restructure broken tables into clean CSVs.
            </p>
        </div>

        {/* Main Action Area */}
        <div className="mb-12">
          {appState === AppState.IDLE && (
            <div className="animate-fade-in">
               <FileUploader onFileSelect={handleFileSelect} isProcessing={false} />
            </div>
          )}

          {appState === AppState.PROCESSING && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center animate-fade-in">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-4 rounded-full border-2 border-indigo-50 shadow-sm flex items-center justify-center h-full w-full">
                  <BrainCircuit className="w-8 h-8 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Analyzing Document Structure</h3>
              <p className="text-slate-500 mb-6">Gemini 3 Pro is thinking deeply to extract and align your data...</p>
              
              <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full animate-[shimmer_2s_infinite] w-1/2 mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
              <p className="text-xs font-mono text-slate-400">{processingTime.toFixed(1)}s elapsed</p>
            </div>
          )}

          {appState === AppState.ERROR && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Extraction Failed</h3>
              <p className="text-slate-500 mb-6">{error}</p>
              <button 
                onClick={handleReset}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Try Another File
              </button>
            </div>
          )}

          {appState === AppState.COMPLETE && result && (
            <div className="space-y-8 animate-fade-in">
               <div className="flex items-center justify-between max-w-7xl mx-auto bg-indigo-900 text-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div>
                        <p className="font-semibold">Extraction Complete</p>
                        <p className="text-xs text-indigo-200">Processed in {processingTime.toFixed(1)}s</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
                  >
                    Start Over
                  </button>
               </div>

               <DataViewer 
                 data={result.parsedData} 
                 rawCsv={result.rawCsv} 
                 fileName={currentFile?.name || "document.pdf"} 
               />
            </div>
          )}
        </div>

        {/* Features Grid (shown when idle) */}
        {appState === AppState.IDLE && (
           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20 animate-fade-in-up">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                 <Table className="w-5 h-5 text-blue-600" />
               </div>
               <h3 className="font-semibold text-slate-900 mb-2">Smart Table Reconstruction</h3>
               <p className="text-sm text-slate-500 leading-relaxed">Detects column headers and merges multi-line rows automatically, even from scanned images.</p>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                 <BrainCircuit className="w-5 h-5 text-purple-600" />
               </div>
               <h3 className="font-semibold text-slate-900 mb-2">Thinking Model</h3>
               <p className="text-sm text-slate-500 leading-relaxed">Uses Gemini 3 Pro's reasoning capabilities to understand context, filtering out watermarks and noise.</p>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                 <Download className="w-5 h-5 text-emerald-600" />
               </div>
               <h3 className="font-semibold text-slate-900 mb-2">Instant Export</h3>
               <p className="text-sm text-slate-500 leading-relaxed">Preview your data instantly in the browser and download as a formatted CSV file ready for Excel.</p>
             </div>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-sm py-12">
        <p>&copy; {new Date().getFullYear()} DocuGrid AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
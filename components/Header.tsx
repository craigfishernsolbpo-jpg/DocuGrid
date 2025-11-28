import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Sparkles, Key, Check } from 'lucide-react';

interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const Header: React.FC<HeaderProps> = ({ apiKey, onApiKeyChange }) => {
  const [showInput, setShowInput] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const hasEnvKey = process.env.API_KEY && process.env.API_KEY !== 'MISSING_KEY' && process.env.API_KEY !== '';

  useEffect(() => {
    setTempKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    onApiKeyChange(tempKey);
    setShowInput(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">DocuGrid AI</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Powered by Gemini 3 Pro</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* API Key Input Section */}
             <div className="relative">
                {!showInput ? (
                    <button 
                        onClick={() => setShowInput(true)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${apiKey || hasEnvKey ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'}`}
                    >
                        <Key className="w-3.5 h-3.5" />
                        {apiKey || hasEnvKey ? 'API Key Active' : 'Set API Key'}
                    </button>
                ) : (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white border border-slate-300 rounded-lg shadow-lg p-1 z-30">
                        <input 
                            type="password" 
                            placeholder="Enter Gemini API Key"
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            className="text-xs px-2 py-1 outline-none w-40 text-slate-700"
                            autoFocus
                        />
                        <button 
                            onClick={handleSave}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-1 rounded-md transition-colors"
                        >
                            <Check className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
                {showInput && (
                    <div className="fixed inset-0 z-20 bg-transparent" onClick={() => setShowInput(false)} />
                )}
             </div>

             <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 hidden sm:flex">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Thinking Mode Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
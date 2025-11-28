import React from 'react';
import { FileSpreadsheet, Sparkles, Key } from 'lucide-react';

interface HeaderProps {
  onOpenApiKey?: () => void;
  hasKey?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenApiKey, hasKey }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
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
          
          <div className="flex items-center gap-3">
             <button 
               onClick={onOpenApiKey}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${hasKey ? 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
             >
                <Key className="w-3.5 h-3.5" />
                {hasKey ? 'API Key Set' : 'Set API Key'}
             </button>

            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/50">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold text-slate-600">Thinking Mode Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
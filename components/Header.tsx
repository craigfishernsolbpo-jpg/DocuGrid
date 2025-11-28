import React from 'react';
import { FileSpreadsheet, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
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
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Thinking Mode Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
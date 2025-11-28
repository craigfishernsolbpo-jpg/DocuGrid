import React, { useState } from 'react';
import { Key, AlertCircle, Play, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onUseDemo: () => void;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onUseDemo, onClose }) => {
  const [inputKey, setInputKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onSave(inputKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 animate-fade-in-up">
        <div className="p-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-indigo-600" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2">Enter Gemini API Key</h3>
          <p className="text-slate-500 text-sm mb-6">
            This app requires a Google Gemini API key to process your PDF. 
            Your key is used only in your browser and is never stored on our servers.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                API Key
              </label>
              <input
                id="apiKey"
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-mono text-sm"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!inputKey.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Securely Process File
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or</span>
            </div>
          </div>

          <button
            onClick={onUseDemo}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Play className="w-4 h-4" />
            Try with Demo Data
          </button>
        </div>
        
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Don't have a key? Get one for free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google AI Studio</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
import React, { useRef, useState } from 'react';
import { UploadCloud, FileType, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleClick = () => {
    if (!isProcessing && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 bg-white'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleChange}
          accept="application/pdf"
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full transition-colors ${isDragging ? 'bg-indigo-200' : 'bg-slate-100 group-hover:bg-indigo-100'}`}>
             {fileName ? <FileType className="w-8 h-8 text-indigo-600" /> : <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-indigo-600" />}
          </div>
          
          <div>
            {fileName ? (
               <h3 className="text-lg font-semibold text-indigo-900 truncate px-4">
                {fileName}
               </h3>
            ) : (
                <>
                    <h3 className="text-lg font-semibold text-slate-900">
                    Upload your PDF
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                    Drag and drop or click to browse
                    </p>
                </>
            )}
          </div>

          {!fileName && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-50 inline-block px-3 py-1 rounded-full mx-auto">
              <AlertCircle className="w-3 h-3" />
              <span>PDF files only (Statements, Invoices, Reports)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
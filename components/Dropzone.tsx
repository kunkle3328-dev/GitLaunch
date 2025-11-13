
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { FileZipIcon } from './icons/FileZipIcon';
import { FolderIcon } from './icons/FolderIcon';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  initialFiles: File[];
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelected, initialFiles }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
    }
  };

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragOver(true);
    } else if (e.type === 'dragleave') {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Note: Dropping folders is not reliably supported across all browsers.
      // We process the files, assuming it's a mix of files or a single zip.
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  }, [onFilesSelected]);

  const renderFileSummary = () => {
    if (initialFiles.length === 0) return null;

    const isZip = initialFiles.length === 1 && initialFiles[0].name.endsWith('.zip');
    const Icon = isZip ? FileZipIcon : FolderIcon;
    const title = isZip ? initialFiles[0].name : `${initialFiles.length} files selected`;
    
    return (
       <div className="mt-4 text-center bg-slate-700/50 p-4 rounded-lg">
          <Icon className="w-10 h-10 mx-auto text-blue-400" />
          <p className="mt-2 text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-slate-400">Ready to upload.</p>
       </div>
    );
  }

  return (
    <div>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`w-full p-6 border-2 border-dashed rounded-lg text-center transition-colors ${
          isDragOver ? 'border-blue-500 bg-slate-700/50' : 'border-slate-600 bg-slate-800/30'
        }`}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-2 text-lg font-semibold text-slate-200">Drag & drop your project here</p>
        <p className="text-sm text-slate-400">or select a folder or .zip file</p>
        <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
            <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-500 transition-colors"
            >
                <FolderIcon className="w-5 h-5"/>
                Select Folder
            </button>
             <button
                type="button"
                onClick={() => zipInputRef.current?.click()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-500 transition-colors"
            >
                <FileZipIcon className="w-5 h-5"/>
                Select .zip File
            </button>
        </div>
        <input
          type="file"
          ref={folderInputRef}
          onChange={handleFileChange}
          className="hidden"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          multiple
        />
        <input
          type="file"
          ref={zipInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".zip"
        />
      </div>
      {renderFileSummary()}
    </div>
  );
};

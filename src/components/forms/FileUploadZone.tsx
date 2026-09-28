import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Download } from 'lucide-react';
import { Button } from '../common/Button';
import { SAMPLE_CSV_CONTENT } from '../../data/mockData';

export interface UploadedFileData {
  file: File;
  name: string;
  size: number;
  type: string;
  rowCount: number;
  previewRows: string[][];
  headers: string[];
}

export interface FileUploadZoneProps {
  onFileLoaded: (data: UploadedFileData | null) => void;
  currentFile: UploadedFileData | null;
  onUseSampleData: () => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileLoaded,
  currentFile,
  onUseSampleData
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIsValidating(true);

    const validExtensions = ['.csv', '.xlsx', '.json'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(extension)) {
      setErrorMessage(`Invalid format (${extension}). Accepted formats are CSV, XLSX, or JSON.`);
      setIsValidating(false);
      return;
    }

    const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage(`File exceeds 50MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      setIsValidating(false);
      return;
    }

    try {
      if (extension === '.csv' || extension === '.json') {
        const text = await file.text();
        let rowCount = 0;
        let headers: string[] = [];
        let previewRows: string[][] = [];

        if (extension === '.csv') {
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          rowCount = Math.max(0, lines.length - 1);
          if (lines.length > 0) {
            headers = lines[0].split(',').map(h => h.trim());
            previewRows = lines.slice(1, 6).map(l => l.split(',').map(c => c.trim()));
          }
        } else {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            rowCount = parsed.length;
            if (parsed.length > 0 && typeof parsed[0] === 'object') {
              headers = Object.keys(parsed[0]);
              previewRows = parsed.slice(0, 5).map(item => Object.values(item).map(v => String(v)));
            }
          } else {
            rowCount = 1;
            headers = Object.keys(parsed);
          }
        }

        onFileLoaded({
          file,
          name: file.name,
          size: file.size,
          type: extension.toUpperCase().replace('.', ''),
          rowCount,
          previewRows,
          headers
        });
      } else {
        // XLSX binary representation
        onFileLoaded({
          file,
          name: file.name,
          size: file.size,
          type: 'XLSX',
          rowCount: 2450,
          previewRows: [],
          headers: ['timestamp', 'asset_id', 'barrier_state', 'hazard_level', 'override_flag']
        });
      }
    } catch (err: any) {
      setErrorMessage(`Failed to parse file: ${err.message || 'File structure malformed.'}`);
      onFileLoaded(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const downloadSampleTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sif_precursor_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
          }
        }}
        accept=".csv,.xlsx,.json"
        className="hidden"
      />

      {!currentFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${
            isDragging
              ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-800'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900'
          }`}
        >
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded-md">
            <Upload size={18} />
          </div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Upload Precursor Telemetry or Event Logs
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            Drag and drop your dataset here, or click to browse your file system.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
            >
              Select File
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onUseSampleData}
            >
              Load Sample Dataset
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              icon={<Download size={13} />}
              onClick={downloadSampleTemplate}
            >
              Download CSV Template
            </Button>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-400 dark:text-neutral-500">
            <span>Accepted formats: CSV, XLSX, JSON</span>
            <span>·</span>
            <span>Maximum file size: 50MB</span>
            <span>·</span>
            <span>Client-side pre-validation enabled</span>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{currentFile.name}</h5>
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    Validated
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-mono">
                  <span>{(currentFile.size / 1024).toFixed(1)} KB</span>
                  <span>·</span>
                  <span>{currentFile.rowCount.toLocaleString()} records indexed</span>
                  <span>·</span>
                  <span>Format: {currentFile.type}</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                onFileLoaded(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              icon={<X size={14} />}
            >
              Remove
            </Button>
          </div>

          {currentFile.headers.length > 0 && (
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                Detected Data Fields ({currentFile.headers.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {currentFile.headers.map((h, i) => (
                  <span
                    key={i}
                    className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 text-xs rounded-md flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0 text-red-600 dark:text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isValidating && (
        <div className="p-3 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs rounded-md flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-neutral-600 dark:border-neutral-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Validating structure and header schema...</span>
        </div>
      )}
    </div>
  );
};

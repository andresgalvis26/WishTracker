import React from 'react';
import { X, Download, FileText, Image } from 'lucide-react';

const ReceiptModal = ({ isOpen, onClose, receiptUrl, receiptName, receiptType }) => {
  if (!isOpen) return null;

  const isPDF = receiptType === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden transition-colors">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isPDF ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'}`}>
              {isPDF ? <FileText className="h-5 w-5" /> : <Image className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                {receiptName || 'Comprobante'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isPDF ? 'Documento PDF' : 'Imagen'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={receiptUrl}
              download={receiptName}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Descargar</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
          {isPDF ? (
            <iframe
              src={receiptUrl}
              title={receiptName || 'Comprobante PDF'}
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={receiptUrl}
                alt={receiptName || 'Comprobante'}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;

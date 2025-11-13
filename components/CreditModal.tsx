import React, { useState, useEffect } from 'react';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToStore: () => void;
}

export const CreditModal: React.FC<CreditModalProps> = ({ isOpen, onClose, onGoToStore }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsRendered(false);
    }
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
      onAnimationEnd={handleAnimationEnd}
      aria-labelledby="credit-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md p-8 text-center transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <h2 id="credit-modal-title" className="text-2xl font-bold text-white">
          You're out of free uploads!
        </h2>
        <p className="mt-3 text-slate-400">
          To continue deploying unlimited projects, please visit our store to purchase more credits.
        </p>

        <div className="my-6 p-3 bg-blue-900/30 border border-blue-700 rounded-lg text-sm text-blue-200">
          Support the developer and unlock unlimited uploads by purchasing a credit pack.
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={onGoToStore}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Visit Credit Store
          </button>
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
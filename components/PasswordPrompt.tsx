import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordPromptProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication delay for effect
    setTimeout(() => {
        if (password === 'MARZIA') {
        onSuccess();
        } else {
        setError('ACCESS DENIED');
        setPassword('');
        inputRef.current?.focus();
        }
    }, 500);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-8 sm:p-12 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scanning Line Animation */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_15px_#ef4444] animate-[scan_3s_ease-in-out_infinite]"></div>
        <style>{`
            @keyframes scan {
                0%, 100% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
        `}</style>

        <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-700 relative">
                 <motion.i 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="fa-solid fa-user-secret text-4xl text-gray-400"
                 ></motion.i>
                 <div className="absolute inset-0 rounded-full border border-dashed border-gray-600 animate-[spin_10s_linear_infinite]"></div>
            </div>
            <h2 className="text-2xl font-bold text-white font-mono tracking-widest uppercase">Security Check</h2>
            <p className="text-gray-500 text-xs mt-2 font-mono">Restricted Area. Authorization Required.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="relative mb-6 group">
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={`w-full bg-black border-2 rounded-lg px-4 py-4 text-center text-xl tracking-[0.5em] text-white focus:outline-none transition-all duration-300 font-mono uppercase placeholder:tracking-normal
                    ${error ? 'border-red-900 focus:border-red-500' : 'border-gray-800 focus:border-purple-500'}`}
                placeholder="ENTER CODE"
              />
              {error && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -bottom-6 left-0 w-full text-center text-red-500 text-xs font-mono font-bold tracking-wider"
                >
                    ⚠ {error}
                </motion.div>
              )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
                type="button"
                onClick={onCancel}
                className="py-3 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors font-mono text-sm uppercase"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-all font-mono text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
                Unlock
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PasswordPrompt;
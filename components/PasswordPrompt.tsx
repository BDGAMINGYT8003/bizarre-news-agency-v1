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
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'MARZIA') {
      onSuccess();
    } else {
      setError('ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  const backdropVariants = {
    visible: { opacity: 1, transition: { duration: 0.3 } },
    hidden: { opacity: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2, ease: 'easeIn' } },
  };
  
  const shakeVariants = {
      initial: { opacity: 0, y: -10 },
      animate: { 
          opacity: 1, 
          y: 0,
          x: [0, -8, 8, -8, 8, 0],
          transition: { type: "spring", stiffness: 500, damping: 20, duration: 0.5 }
      },
      exit: { opacity: 0, y: 10 },
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-[#111116] border border-gray-700/50 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl shadow-black/50"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
            <div className="text-gray-600 mb-6">
                 <i className="fa-solid fa-lock text-6xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                প্রবেশাধিকার সংরক্ষিত
            </h2>
            <p className="text-gray-400">এই বার্তাটি পড়ার জন্য পাসওয়ার্ড দিন।</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="relative mb-4">
              <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full bg-gray-800/50 border text-white rounded-xl px-4 py-4 pl-12 text-center text-lg tracking-widest focus:outline-none focus:ring-2 transition-all duration-300 ${error ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-700 focus:ring-purple-500 focus:border-purple-500'}`}
                placeholder="• • • • • •"
                aria-label="Password"
                aria-invalid={!!error}
                aria-describedby="password-error"
              />
          </div>
          <AnimatePresence>
              {error && (
                <motion.p
                    id="password-error"
                    variants={shakeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-red-400 text-sm text-center -mb-2 mt-3 flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {error}
                </motion.p>
              )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-4 rounded-xl mt-6 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
          >
            প্রবেশ করুন
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-gray-500 hover:text-white font-medium py-3 px-4 rounded-xl mt-3 transition-colors duration-300"
          >
            বাতিল
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PasswordPrompt;

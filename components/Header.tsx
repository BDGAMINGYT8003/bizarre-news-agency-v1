import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    onTitleClick: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    showSearch: boolean;
    showBackButton?: boolean;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onTitleClick, 
    searchQuery, 
    onSearchChange, 
    showSearch,
    showBackButton,
    onBack
}) => {
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    // Handle scroll effect for glass morphism intensity
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
                scrolled 
                ? 'bg-black/70 backdrop-blur-xl border-white/5 h-16' 
                : 'bg-transparent border-transparent h-24'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Left Area: Logo or Back Button */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Back Button - Only visible if showBackButton is true on mobile */}
                        <AnimatePresence mode="wait">
                            {showBackButton && (
                                <motion.button
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    onClick={onBack}
                                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-surfaceHighlight/50 text-white border border-white/10 hover:bg-surfaceHighlight transition-colors"
                                >
                                    <i className="fa-solid fa-arrow-left"></i>
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Logo Area - Hidden on mobile if back button is active */}
                        <motion.div
                            layout
                            className={`flex items-center gap-3 cursor-pointer group ${showBackButton ? 'hidden md:flex' : 'flex'}`}
                            onClick={onTitleClick}
                        >
                            <motion.div 
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.6 }}
                                className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/20"
                            >
                                <span className="text-white font-bold text-lg">আ</span>
                            </motion.div>
                            <h1 className={`font-heading font-bold text-gray-100 tracking-wide transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                                <span className="md:hidden">আবাস</span>
                                <span className="hidden md:inline">
                                    আজগুবি<span className="text-purple-400">বার্তা</span>
                                </span>
                            </h1>
                        </motion.div>
                    </div>

                    {/* Search Area */}
                    <div className="flex items-center gap-4">
                        <AnimatePresence mode="wait">
                            {showSearch ? (
                                <motion.div
                                    initial={{ opacity: 0, scaleX: 0.8 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    exit={{ opacity: 0, scaleX: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className={`relative flex items-center transition-all duration-300 ${searchFocused ? 'w-48 sm:w-64 md:w-80' : 'w-32 sm:w-48 md:w-64'}`}
                                >
                                    <i className={`fa-solid fa-magnifying-glass absolute left-4 z-10 transition-colors duration-300 ${searchFocused ? 'text-purple-400' : 'text-gray-500'}`}></i>
                                    <input
                                        type="text"
                                        placeholder="অনুসন্ধান..."
                                        value={searchQuery}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        onChange={(e) => onSearchChange(e.target.value)}
                                        className="w-full bg-surfaceHighlight/50 border border-white/10 text-gray-200 rounded-full py-2 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-surfaceHighlight transition-all duration-300 text-sm font-sans placeholder-gray-600"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => onSearchChange('')}
                                            className="absolute right-3 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 hover:text-white transition-all"
                                            aria-label="Clear search"
                                        >
                                            <i className="fa-solid fa-xmark text-xs"></i>
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hidden md:flex items-center gap-4"
                                >
                                    {/* Dummy Nav Items for 'Pro' Feel */}
                                    {['জনপ্রিয়', 'সাম্প্রতিক', 'আমাদের সম্পর্কে'].map((item, i) => (
                                        <button key={i} className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
                                            {item}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
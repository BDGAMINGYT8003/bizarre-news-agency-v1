
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    onTitleClick: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    showSearch: boolean;
}

const Header: React.FC<HeaderProps> = ({ onTitleClick, searchQuery, onSearchChange, showSearch }) => {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center h-20 ${showSearch ? 'justify-between' : 'justify-center'}`}>
                    <motion.div
                        layout
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="text-2xl md:text-3xl font-bold text-gray-100 tracking-wider cursor-pointer"
                        onClick={onTitleClick}
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                        আজগুবি বার্তা সংস্থা
                    </motion.div>
                    <AnimatePresence>
                        {showSearch && (
                             <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.3 }}
                                className="relative flex items-center"
                            >
                                <i className="fa-solid fa-magnifying-glass absolute left-4 text-gray-500 z-10"></i>
                                <input
                                    type="text"
                                    placeholder="অনুসন্ধান..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="bg-gray-900/80 border border-gray-700 text-gray-200 rounded-full py-2 pl-12 pr-10 w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => onSearchChange('')}
                                        className="absolute right-4 text-gray-500 hover:text-gray-200 transition-colors"
                                        aria-label="Clear search"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;
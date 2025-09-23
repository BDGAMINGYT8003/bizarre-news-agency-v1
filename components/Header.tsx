
import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
    onTitleClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onTitleClick }) => {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div
                        className="text-2xl md:text-3xl font-bold text-gray-100 tracking-wider cursor-pointer"
                        onClick={onTitleClick}
                        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                        আজগুবি বার্তা সংস্থা
                    </div>
                    <div className="relative flex items-center">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 text-gray-500"></i>
                        <input
                            type="text"
                            placeholder="অনুসন্ধান..."
                            className="bg-gray-900/80 border border-gray-700 text-gray-200 rounded-full py-2 pl-12 pr-4 w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        />
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;

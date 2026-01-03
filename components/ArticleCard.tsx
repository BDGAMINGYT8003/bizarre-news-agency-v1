import React from 'react';
import { motion } from 'framer-motion';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, index }) => {
  const isSecret = article.isSecret;

  return (
    <motion.div
      layoutId={`article-container-${article.id}`}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.05 } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      onClick={onClick}
      className={`group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 h-full
        ${isSecret 
            ? 'bg-[#0a0a0a] border border-dashed border-gray-800 hover:border-red-900/50 hover:shadow-[0_0_30px_rgba(153,27,27,0.15)]' 
            : 'bg-surface border border-white/5 hover:border-purple-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]'
        }`}
    >
        {/* Ripple/Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {isSecret ? (
            <div className="flex flex-col items-center justify-center p-10 relative overflow-hidden h-full min-h-[300px]">
                 {/* Animated Background for Secret Card */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                 
                 <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mb-6 relative z-10"
                 >
                    <div className="w-20 h-20 rounded-full bg-red-900/20 flex items-center justify-center border border-red-900/50">
                        <i className="fa-solid fa-lock text-3xl text-red-500"></i>
                    </div>
                 </motion.div>
                 
                 <h3 className="text-xl font-bold text-gray-200 font-heading z-10 text-center">প্রবেশাধিকার সংরক্ষিত</h3>
                 <p className="text-gray-500 text-sm mt-2 font-sans z-10 text-center">টপ সিক্রেট ফাইল</p>
                 
                 <div className="mt-8 px-4 py-2 rounded-full border border-red-900/30 text-red-400 text-xs uppercase tracking-widest font-bold bg-red-900/10 z-10 group-hover:bg-red-900/20 transition-colors">
                    Confidential
                 </div>
            </div>
        ) : (
            <div className="flex-1 p-8 flex flex-col relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                    {/* Date moved here from image overlay */}
                    <div className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <i className="fa-regular fa-calendar"></i>
                        {article.publishDate}
                    </div>
                </div>

                <motion.h2 
                    className="text-xl md:text-2xl font-bold text-gray-100 mb-4 leading-snug font-heading group-hover:text-purple-400 transition-colors"
                    layoutId={`article-title-${article.id}`}
                >
                    {article.title}
                </motion.h2>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow font-sans">
                    {article.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-[10px] text-white font-bold">
                            {article.author[0]}
                        </div>
                        <span className="text-xs text-gray-500 truncate max-w-[120px]">{article.author.split(',')[0]}</span>
                    </div>
                    <span className="text-xs font-medium text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        পড়ুন <i className="fa-solid fa-arrow-right"></i>
                    </span>
                </div>
            </div>
        )}
    </motion.div>
  );
};

export default ArticleCard;
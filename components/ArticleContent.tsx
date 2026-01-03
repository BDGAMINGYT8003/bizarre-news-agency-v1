import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Article } from '../types';
import ArticleImage from './ArticleImage';
import { ToastContext } from '../App';

// --- Helpers ---
const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} মিনিট পড়ার সময়`;
};

// --- Markdown Renderer ---
const parseInlineText = (text: string): React.ReactNode => {
    const regex = /(\*_(?:.*?)_\*)|(\*\*(?:.*?)\*\*)|(\*(?:.*?)\*)|(~(?:.*?)~)/g;
    const parts = text.split(regex).filter(Boolean);

    return parts.map((part, index) => {
        if (part.startsWith('*_') && part.endsWith('_*')) return <em key={index} className="text-purple-200 font-serif"><strong>{part.slice(2, -2)}</strong></em>;
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={index} className="text-gray-100 font-bold">{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*')) return <em key={index} className="text-gray-300">{part.slice(1, -1)}</em>;
        if (part.startsWith('~') && part.endsWith('~')) return <del key={index} className="opacity-60">{part.slice(1, -1)}</del>;
        return part;
    });
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const blocks = content.trim().split('\n\n');
    return (
        <div className="space-y-6">
            {blocks.map((block, i) => {
                if (block.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl md:text-3xl font-bold text-gray-100 mt-10 mb-4 font-heading border-l-4 border-purple-500 pl-4">{parseInlineText(block.substring(3))}</h2>;
                }
                if (block.startsWith('> ')) {
                    return (
                        <blockquote key={i} className="relative p-6 my-8 bg-surfaceHighlight rounded-r-xl border-l-4 border-teal-500 italic text-gray-300">
                            <i className="fa-solid fa-quote-left absolute top-2 left-2 text-teal-500/20 text-4xl"></i>
                            <span className="relative z-10">{parseInlineText(block.substring(2))}</span>
                        </blockquote>
                    );
                }
                if (block.startsWith('* ')) {
                    const listItems = block.split('\n').map(item => item.substring(2));
                    return (
                        <ul key={i} className="space-y-3 my-6 ml-2">
                            {listItems.map((item, j) => (
                                <li key={j} className="flex items-start gap-3 text-gray-300">
                                    <span className="mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                                    <span>{parseInlineText(item)}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }
                return <p key={i} className="text-lg text-gray-300 leading-loose font-bengali tracking-wide">{parseInlineText(block)}</p>;
            })}
        </div>
    );
};

// --- Components ---
const ReactionButton: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <motion.button 
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="flex flex-col items-center gap-2 group min-w-[60px]"
    >
        <div className="w-12 h-12 rounded-2xl bg-surfaceHighlight group-hover:bg-gray-800 flex items-center justify-center text-2xl shadow-lg transition-colors duration-300 border border-white/5 group-hover:border-purple-500/30">
            {icon}
        </div>
        <span className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors font-medium">{label}</span>
    </motion.button>
);

interface ArticleContentProps {
  article: Article;
  onBack: () => void;
}

const MotionArticleImage = motion(ArticleImage);

const ArticleContent: React.FC<ArticleContentProps> = ({ article, onBack }) => {
  const { showToast } = useContext(ToastContext);

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) { console.log("Cancelled"); }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("লিঙ্ক কপি করা হয়েছে!", "success");
      } catch (err) {
        showToast("কপি করতে ব্যর্থ হয়েছে", "error");
      }
    }
  };

  const handleReaction = (label: string) => {
      showToast(`আপনি "${label}" প্রতিক্রিয়া জানিয়েছেন`, "info");
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-0 md:px-4 lg:px-8 pb-24"
    >
      <motion.div 
        className="bg-surface md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 min-h-screen md:min-h-0 md:border border-white/5"
        layoutId={`article-container-${article.id}`}
      >
        {/* Hero Header */}
        <div className="relative h-[60vh] md:h-[70vh] w-full">
             <MotionArticleImage
                articleId={article.id}
                fallbackUrl={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
                layoutId={`article-image-${article.id}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-surface" />
            
            {/* Back Button Floating */}
            <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onBack} 
                className="absolute top-6 left-6 md:top-10 md:left-10 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            >
                <i className="fa-solid fa-arrow-left"></i>
            </motion.button>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-3 mb-4"
                >
                    {article.tags.map(tag => (
                        <span key={tag} className="bg-purple-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                            {tag}
                        </span>
                    ))}
                 </motion.div>
                 <motion.h1 
                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight font-heading drop-shadow-lg"
                    layoutId={`article-title-${article.id}`}
                >
                    {article.title}
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-gray-300 text-sm font-medium"
                >
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold border border-white/20">
                            {article.author[0]}
                        </div>
                        <span>{article.author}</span>
                     </div>
                     <span className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></span>
                     <div className="flex items-center gap-2">
                        <i className="fa-regular fa-calendar"></i>
                        <span>{article.publishDate}</span>
                     </div>
                     <span className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></span>
                     <div className="flex items-center gap-2 text-purple-300">
                        <i className="fa-regular fa-clock"></i>
                        <span>{calculateReadingTime(article.content)}</span>
                     </div>
                </motion.div>
            </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-6 md:p-12 lg:p-16 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }} 
                    className="prose prose-invert prose-lg max-w-none"
                >
                    <p className="text-xl md:text-2xl leading-relaxed font-medium text-gray-200 mb-8 border-b border-white/10 pb-8 font-bengali">
                        {article.excerpt}
                    </p>
                    <MarkdownRenderer content={article.content} />
                </motion.div>
            </div>

            {/* Sidebar (Reactions & Share) */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-8">
                    {/* Reactions */}
                    <div className="bg-surfaceHighlight/30 rounded-3xl p-8 border border-white/5 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-6 font-heading flex items-center gap-2">
                            <i className="fa-solid fa-heart-pulse text-red-500"></i> প্রতিক্রিয়া জানান
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <ReactionButton icon="😂" label="হাহা" onClick={() => handleReaction("হাহা")} />
                            <ReactionButton icon="😲" label="অবিশ্বাস্য" onClick={() => handleReaction("অবিশ্বাস্য")} />
                            <ReactionButton icon="😢" label="দুঃখজনক" onClick={() => handleReaction("দুঃখজনক")} />
                            <ReactionButton icon="🤔" label="ভাবছি" onClick={() => handleReaction("ভাবছি")} />
                            <ReactionButton icon="😡" label="রাগ" onClick={() => handleReaction("রাগ")} />
                            <ReactionButton icon="🔥" label="আগুন" onClick={() => handleReaction("আগুন")} />
                        </div>
                    </div>

                    {/* Share */}
                    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl p-8 border border-white/5 text-center">
                         <h3 className="text-lg font-bold text-white mb-2 font-heading">বন্ধুদের সাথে শেয়ার করুন</h3>
                         <p className="text-sm text-gray-400 mb-6">সত্য ছড়িয়ে দিন (অথবা গুজব)</p>
                         <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleShare}
                            className="w-full py-3 px-6 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                         >
                            <i className="fa-solid fa-share-nodes"></i> শেয়ার করুন
                         </motion.button>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArticleContent;
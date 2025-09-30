import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Article } from '../types';
import ArticleImage from './ArticleImage';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Wrap the custom ArticleImage component with motion to enable layout animations.
const MotionArticleImage = motion(ArticleImage);

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  if (article.isSecret) {
    return (
      <motion.div
        variants={cardVariants}
        className="bg-gray-900 rounded-3xl overflow-hidden cursor-pointer group border border-dashed border-gray-700 flex flex-col items-center justify-center p-6 min-h-[380px] hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300"
        onClick={onClick}
        layoutId={`article-container-${article.id}`}
      >
        <div className="text-center text-gray-600 group-hover:text-gray-400 transition-colors duration-300">
          <i className="fa-solid fa-lock text-6xl"></i>
          <p className="mt-4 font-bold text-lg" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>প্রবেশাধিকার সংরক্ষিত</p>
          <p className="text-sm mt-1">এই বার্তাটি দেখতে পাসওয়ার্ড দিন।</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      className="bg-gray-900 rounded-3xl overflow-hidden cursor-pointer group border border-transparent hover:border-gray-700 transition-colors duration-300"
      onClick={onClick}
      layoutId={`article-container-${article.id}`}
    >
      <div className="overflow-hidden">
        <MotionArticleImage
          articleId={article.id}
          fallbackUrl={article.imageUrl}
          alt={article.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          layoutId={`article-image-${article.id}`}
        />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
            {article.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full">{tag}</span>
            ))}
        </div>
        <motion.h2 
            className="text-xl font-bold text-gray-100 mb-2"
            layoutId={`article-title-${article.id}`}
        >
            {article.title}
        </motion.h2>
        <p className="text-gray-400 text-sm leading-relaxed">{article.excerpt}</p>
      </div>
    </motion.div>
  );
};

export default ArticleCard;

import React from 'react';
// FIX: Import the `Variants` type from framer-motion to resolve the type error.
import { motion, Variants } from 'framer-motion';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

// FIX: Explicitly type `cardVariants` with `Variants`. This allows TypeScript to correctly infer
// the type of `ease: 'easeOut'` as a valid `Easing` literal instead of a generic `string`.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-gray-900 rounded-3xl overflow-hidden cursor-pointer group border border-transparent hover:border-gray-700 transition-colors duration-300"
      onClick={onClick}
      layoutId={`article-container-${article.id}`}
    >
      <div className="overflow-hidden">
        <motion.img
          src={article.imageUrl}
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

import React from 'react';
import { motion } from 'framer-motion';
import { Article } from '../types';

// Standalone Helper Function for Markdown Parsing
const parseInlineText = (text: string): React.ReactNode => {
    // FIX: The original regex caused `string.split()` to produce duplicate array elements
    // for matched markdown (e.g., `['**bold**', 'bold']`), leading to repeated text in the UI.
    // Using non-capturing groups `(?:...)` for the inner content resolves this issue
    // by only including the full match (e.g., `['**bold**']`).
    const regex = /(\*_(?:.*?)_\*)|(\*\*(?:.*?)\*\*)|(\*(?:.*?)\*)|(~(?:.*?)~)/g;
    const parts = text.split(regex).filter(Boolean);

    // This simplified mapping logic now correctly handles styled and plain text segments
    // without the need for complex, error-prone checks for duplicate parts.
    return parts.map((part, index) => {
        if (part.startsWith('*_') && part.endsWith('_*')) {
            return <em key={index}><strong>{part.slice(2, -2)}</strong></em>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('~') && part.endsWith('~')) {
            return <del key={index}>{part.slice(1, -1)}</del>;
        }
        return part;
    });
};


const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const blocks = content.trim().split('\n\n');

    return (
        <div>
            {blocks.map((block, i) => {
                if (block.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-bold text-gray-200 mt-8 mb-4">{parseInlineText(block.substring(3))}</h2>;
                }
                if (block.startsWith('> ')) {
                    return <blockquote key={i} className="border-l-4 border-gray-700 pl-4 my-6 text-gray-400 italic">{parseInlineText(block.substring(2))}</blockquote>;
                }
                if (block.startsWith('* ')) {
                    const listItems = block.split('\n').map(item => item.substring(2));
                    return (
                        <ul key={i} className="list-disc list-outside space-y-2 my-4 pl-6 text-gray-300">
                            {listItems.map((item, j) => <li key={j}>{parseInlineText(item)}</li>)}
                        </ul>
                    );
                }
                if(block.startsWith('**') && block.endsWith('**')) {
                     return <p key={i} className="my-4 text-gray-300 font-bold leading-relaxed">{parseInlineText(block.substring(2, block.length-2))}</p>;
                }

                return <p key={i} className="my-4 text-gray-300 leading-relaxed">{parseInlineText(block)}</p>;
            })}
        </div>
    );
};

const ReactionButton: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <motion.button 
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
    >
        <div className="text-3xl">{icon}</div>
        <span className="text-xs">{label}</span>
    </motion.button>
);


interface ArticleContentProps {
  article: Article;
  onBack: () => void;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article, onBack }) => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
    >
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
            <span>ফিরে যান</span>
        </button>
      <motion.div 
        className="bg-gray-900 rounded-3xl overflow-hidden"
        layoutId={`article-container-${article.id}`}
      >
        <motion.img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-64 md:h-96 object-cover"
          layoutId={`article-image-${article.id}`}
        />
        <div className="p-6 md:p-10 lg:p-12">
            <motion.h1 
                className="text-3xl md:text-4xl font-bold text-gray-100 mb-4"
                layoutId={`article-title-${article.id}`}
            >
                {article.title}
            </motion.h1>
            <div className="flex items-center text-sm text-gray-500 mb-8">
                <span>{article.author}</span>
                <span className="mx-2">&#8226;</span>
                <span>{article.publishDate}</span>
            </div>
            
            <div className="prose prose-invert max-w-none text-lg">
                <MarkdownRenderer content={article.content} />
            </div>

            <hr className="my-10 border-gray-800" />

            <div className="flex flex-col items-center gap-6">
                <h3 className="text-lg font-medium text-gray-300">আপনার প্রতিক্রিয়া কি?</h3>
                <div className="flex items-center justify-center gap-6 md:gap-10">
                    <ReactionButton icon="😂" label="হাহা" />
                    <ReactionButton icon="😲" label="অবিশ্বাস্য" />
                    <ReactionButton icon="😢" label="দুঃখজনক" />
                    <ReactionButton icon="🤔" label="চিন্তার বিষয়" />
                    <ReactionButton icon="😡" label="রেগে গেলাম" />
                </div>
                 <button className="mt-6 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center gap-3">
                    <i className="fa-solid fa-share-nodes"></i>
                    শেয়ার করুন
                </button>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArticleContent;
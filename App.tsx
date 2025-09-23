
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Article } from './types';
import { articles as mockArticles } from './data/articles';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import ArticleContent from './components/ArticleContent';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate API call
    setArticles(mockArticles);

    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#\/article\/([\w-]+)$/);
      if (match) {
        const articleId = match[1];
        const article = mockArticles.find(a => a.id === articleId);
        if (article) {
          setSelectedArticle(article);
          window.scrollTo(0, 0);
        } else {
          // If article with given ID is not found, redirect to home
          window.location.hash = '#/';
        }
      } else {
        setSelectedArticle(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check on page load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleArticleSelect = (article: Article) => {
    window.location.hash = `#/article/${article.id}`;
  };

  const handleBack = () => {
    window.location.hash = '#/';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const filteredArticles = articles.filter(article => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <LayoutGroup>
      <div className="bg-black min-h-screen text-gray-100">
        <Header 
            onTitleClick={handleBack} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showSearch={!selectedArticle}
        />

        <main>
          <AnimatePresence mode="wait">
            {selectedArticle ? (
              <ArticleContent
                key={selectedArticle.id}
                article={selectedArticle}
                onBack={handleBack}
              />
            ) : (
              <motion.div
                key="homepage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16"
              >
                {filteredArticles.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                    {filteredArticles.map((article) => (
                        <ArticleCard
                        key={article.id}
                        article={article}
                        onClick={() => handleArticleSelect(article)}
                        />
                    ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-400">"{searchQuery}" এর জন্য কোনো ফলাফল পাওয়া যায়নি।</p>
                    </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        
        {!selectedArticle && <Footer />}
      </div>
    </LayoutGroup>
  );
};

export default App;

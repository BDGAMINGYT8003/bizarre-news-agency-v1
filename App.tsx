
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

  useEffect(() => {
    // Simulate API call
    setArticles(mockArticles);
  }, []);

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedArticle(null);
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

  return (
    <LayoutGroup>
      <div className="bg-black min-h-screen text-gray-100">
        <Header onTitleClick={handleBack} />

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
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onClick={() => handleArticleSelect(article)}
                    />
                  ))}
                </motion.div>
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


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Article } from './types';
import { articles as mockArticles } from './data/articles';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import ArticleContent from './components/ArticleContent';
import Footer from './components/Footer';
import Pagination from './components/Pagination';
import PasswordPrompt from './components/PasswordPrompt';

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [unlockingArticle, setUnlockingArticle] = useState<Article | null>(null);

  useEffect(() => {
    // Simulate API call and sort articles by ID descending
    const sortedArticles = [...mockArticles].sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
    setArticles(sortedArticles);

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
  
  // Effect to add 'noindex' meta tag for secret articles
  useEffect(() => {
    if (selectedArticle?.isSecret) {
        const meta = document.createElement('meta');
        meta.id = 'noindex-meta-tag';
        meta.name = 'robots';
        meta.content = 'noindex';
        document.head.appendChild(meta);
        
        return () => {
            const tag = document.getElementById('noindex-meta-tag');
            if (tag) {
                tag.remove();
            }
        };
    }
  }, [selectedArticle]);


  const handleArticleSelect = (article: Article) => {
    window.location.hash = `#/article/${article.id}`;
  };
  
  const handleCardClick = (article: Article) => {
    if (article.isSecret) {
      setUnlockingArticle(article);
    } else {
      handleArticleSelect(article);
    }
  };

  const handleBack = () => {
    window.location.hash = '#/';
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
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
  
  // Pagination logic
  const articlesPerPage = 10;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  return (
    <LayoutGroup>
      <div className="bg-black min-h-screen text-gray-100">
        <Header 
            onTitleClick={handleBack} 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            showSearch={!selectedArticle}
        />

        <AnimatePresence>
            {unlockingArticle && (
                <PasswordPrompt
                    onSuccess={() => {
                        if (unlockingArticle) {
                            handleArticleSelect(unlockingArticle);
                        }
                        setUnlockingArticle(null);
                    }}
                    onCancel={() => setUnlockingArticle(null)}
                />
            )}
        </AnimatePresence>

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
                    <>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                        {currentArticles.map((article) => (
                            <ArticleCard
                            key={article.id}
                            article={article}
                            onClick={() => handleCardClick(article)}
                            />
                        ))}
                        </motion.div>
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
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
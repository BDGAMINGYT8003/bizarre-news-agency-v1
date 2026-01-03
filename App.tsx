import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup, useScroll, useSpring } from 'framer-motion';
import { Article } from './types';
import { articles as mockArticles } from './data/articles';
import Header from './components/Header';
import ArticleCard from './components/ArticleCard';
import ArticleContent from './components/ArticleContent';
import Footer from './components/Footer';
import Pagination from './components/Pagination';
import PasswordPrompt from './components/PasswordPrompt';

// --- Toast Context for User Feedback ---
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const ToastContext = React.createContext<{
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}>({ showToast: () => {} });

// --- Main Application ---
const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [unlockingArticle, setUnlockingArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Simulate "production-grade" initial data load
    setTimeout(() => {
      const sortedArticles = [...mockArticles].sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
      setArticles(sortedArticles);
      setIsLoading(false);
    }, 800);

    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#\/article\/([\w-]+)$/);
      if (match) {
        const articleId = match[1];
        const article = mockArticles.find(a => a.id === articleId);
        if (article) {
          setSelectedArticle(article);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.location.hash = '#/';
        }
      } else {
        setSelectedArticle(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Meta tag management for secret articles
  useEffect(() => {
    if (selectedArticle?.isSecret) {
        const meta = document.createElement('meta');
        meta.id = 'noindex-meta-tag';
        meta.name = 'robots';
        meta.content = 'noindex';
        document.head.appendChild(meta);
        return () => { document.getElementById('noindex-meta-tag')?.remove(); };
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
    setCurrentPage(1);
  };

  // Filtering Logic
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
  
  const articlesPerPage = 9; // 3x3 grid looks better
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Animation Variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <LayoutGroup>
        <div className="bg-background min-h-screen text-gray-100 font-bengali selection:bg-purple-500/30 relative overflow-x-hidden">
            
          {/* Background Ambience */}
          <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-900/10 rounded-full blur-[120px]" />
          </div>

          {/* Scroll Progress Bar (Global) */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-teal-400 origin-left z-[60]"
            style={{ scaleX }}
          />

          <Header 
              onTitleClick={handleBack} 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              showSearch={!selectedArticle}
          />

          {/* Password Modal */}
          <AnimatePresence>
              {unlockingArticle && (
                  <PasswordPrompt
                      onSuccess={() => {
                          if (unlockingArticle) handleArticleSelect(unlockingArticle);
                          setUnlockingArticle(null);
                      }}
                      onCancel={() => setUnlockingArticle(null)}
                  />
              )}
          </AnimatePresence>

          {/* Toast Container */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
              {toasts.map(toast => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className={`px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border border-white/10 flex items-center gap-3 text-sm font-medium pointer-events-auto
                    ${toast.type === 'success' ? 'bg-green-900/80 text-green-100' : 
                      toast.type === 'error' ? 'bg-red-900/80 text-red-100' : 'bg-gray-800/90 text-white'}`}
                >
                  <i className={`fa-solid ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'error' ? 'fa-circle-exclamation' : 'fa-info-circle'}`}></i>
                  {toast.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <main className="relative z-10 pt-24 min-h-[calc(100vh-200px)]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                 <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[60vh]"
                 >
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full"
                    />
                    <p className="mt-4 text-gray-500 animate-pulse">লোড হচ্ছে...</p>
                 </motion.div>
              ) : selectedArticle ? (
                <ArticleContent
                  key={selectedArticle.id}
                  article={selectedArticle}
                  onBack={handleBack}
                />
              ) : (
                <motion.div
                  key="homepage"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16"
                >
                  {/* Hero Section for Home */}
                  {!searchQuery && currentPage === 1 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center py-12 mb-8"
                      >
                          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-4 tracking-tight leading-tight font-heading">
                            আজগুবি বার্তা সংস্থা
                          </h1>
                          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            সত্যের সন্ধানে নয়, নিছক বিনোদনের অন্বেষণে। <br className="hidden md:block"/> একটি আধুনিক স্যাটায়ার সংবাদ মাধ্যম।
                          </p>
                      </motion.div>
                  )}

                  {filteredArticles.length > 0 ? (
                      <>
                          <motion.div
                              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                          >
                          {currentArticles.map((article, index) => (
                              <ArticleCard
                                key={article.id}
                                article={article}
                                onClick={() => handleCardClick(article)}
                                index={index}
                              />
                          ))}
                          </motion.div>
                          <Pagination 
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                          />
                      </>
                  ) : (
                      <div className="flex flex-col items-center justify-center py-32 text-center">
                          <i className="fa-solid fa-magnifying-glass text-4xl text-gray-700 mb-4"></i>
                          <p className="text-xl text-gray-400">"{searchQuery}" এর জন্য কোনো সংবাদ পাওয়া যায়নি।</p>
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-purple-400 hover:text-purple-300 underline decoration-dotted underline-offset-4 transition-colors"
                          >
                            সব সংবাদ দেখুন
                          </button>
                      </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          
          {!selectedArticle && <Footer />}
        </div>
      </LayoutGroup>
    </ToastContext.Provider>
  );
};

export default App;
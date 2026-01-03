import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const ArticleImage = React.forwardRef<
    HTMLImageElement,
    {
        articleId: string;
        fallbackUrl: string;
        alt: string;
        className?: string;
    }
>(({ articleId, fallbackUrl, alt, className }, ref) => {
    const potentialSources = useMemo(() => [
        `/thumbnails/article${articleId}.gif`,
        `/thumbnails/article${articleId}.png`,
        `/thumbnails/article${articleId}.jpg`,
    ], [articleId]);

    const [sourceIndex, setSourceIndex] = useState(0);
    const [imageSrc, setImageSrc] = useState(potentialSources[0]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setSourceIndex(0);
        setImageSrc(potentialSources[0]);
        setIsLoaded(false);
    }, [potentialSources]);

    const handleError = () => {
        const nextIndex = sourceIndex + 1;
        if (nextIndex < potentialSources.length) {
            setSourceIndex(nextIndex);
            setImageSrc(potentialSources[nextIndex]);
        } else {
            setImageSrc(fallbackUrl);
        }
    };

    return (
        <div className={`relative overflow-hidden bg-gray-900 ${className}`}>
            {/* Skeleton Loader Overlay */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse z-10">
                    <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                </div>
            )}
            
            <motion.img
                ref={ref}
                src={imageSrc}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onError={handleError}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
            />
            
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
});

export default ArticleImage;
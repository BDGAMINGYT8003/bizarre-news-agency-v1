import React, { useState, useEffect, useMemo } from 'react';

// ForwardRef allows the component to receive a ref and forward it to a DOM element,
// which is necessary for framer-motion to animate it.
const ArticleImage = React.forwardRef<
    HTMLImageElement,
    {
        articleId: string;
        fallbackUrl: string;
        alt: string;
        className?: string;
    }
>(({ articleId, fallbackUrl, alt, className }, ref) => {
    // Memoize the array of potential local thumbnail sources.
    // This list is only recalculated if the article ID changes.
    const potentialSources = useMemo(() => [
        `/thumbnails/article${articleId}.gif`,
        `/thumbnails/article${articleId}.png`,
        `/thumbnails/article${articleId}.jpg`,
    ], [articleId]);

    const [sourceIndex, setSourceIndex] = useState(0);
    const [imageSrc, setImageSrc] = useState(potentialSources[0]);

    // This effect resets the image source whenever the articleId changes.
    useEffect(() => {
        setSourceIndex(0);
        setImageSrc(potentialSources[0]);
    }, [potentialSources]);

    const handleError = () => {
        const nextIndex = sourceIndex + 1;
        // If there's another local source to try, update the state.
        if (nextIndex < potentialSources.length) {
            setSourceIndex(nextIndex);
            setImageSrc(potentialSources[nextIndex]);
        } else {
            // If all local sources have failed, use the final fallback URL.
            setImageSrc(fallbackUrl);
        }
    };

    return (
        <img
            ref={ref}
            src={imageSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
});

export default ArticleImage;

import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

/**
 * Universal, rock-solid Lottie Player component using lottie-web.
 * Works seamlessly in Vite/React with zero bundler export quirks.
 */
const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  className = '',
  style = {},
}) => {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    // Destroy any existing animation instance before loading
    if (animRef.current) {
      animRef.current.destroy();
      animRef.current = null;
    }

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: loop,
        autoplay: autoplay,
        animationData: typeof animationData === 'string' ? JSON.parse(animationData) : animationData,
      });
    } catch (err) {
      console.error('Failed to initialize Lottie animation:', err);
    }

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [animationData, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
};

export default LottieAnimation;

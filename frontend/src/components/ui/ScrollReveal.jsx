import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that tracks scroll progress and visibility of an element.
 * Returns { progress, isVisible } where progress is 0→1 based on scroll position
 * within the element's section, and isVisible is true when the element is in viewport.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const isVisible = useRef(false);

  const reveal = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if element is in viewport
    const inView = rect.top < windowHeight * (1 - threshold) && rect.bottom > 0;
    isVisible.current = inView;

    // Calculate progress: 0 when just entering, 1 when fully scrolled through
    const progress = Math.max(0, Math.min(1,
      (windowHeight - rect.top) / (windowHeight + rect.height)
    ));

    return { progress, isVisible: inView };
  }, [threshold]);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      rafId = requestAnimationFrame(reveal);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    reveal(); // Initial check
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [reveal]);

  return { ref, isVisible: isVisible.current, reveal };
}

/**
 * Component that applies CSS transforms based on scroll progress.
 * Children receive a render prop with { progress, isVisible } values.
 */
export function ScrollReveal({
  children,
  threshold = 0.15,
  className = '',
  style = {},
  ...props
}) {
  const { ref, reveal } = useScrollReveal(threshold);
  const stateRef = useRef({ progress: 0, isVisible: false });

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      const state = reveal();
      stateRef.current = state;
      // Apply inline styles to children
      if (typeof children === 'function') {
        // Will be handled in render
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    stateRef.current = reveal();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [reveal, children]);

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      data-visible={stateRef.current.isVisible}
      data-progress={stateRef.current.progress.toFixed(3)}
      {...props}
    >
      {typeof children === 'function'
        ? children(stateRef.current)
        : children}
    </div>
  );
}

export default ScrollReveal;

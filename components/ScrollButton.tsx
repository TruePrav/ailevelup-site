'use client';

interface ScrollButtonProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scrolls to a section by ID without modifying the URL hash.
 * Prevents the browser auto-scroll-on-load issue caused by href="#id".
 */
export default function ScrollButton({ targetId, children, className, style }: ScrollButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, ...style }}
    >
      {children}
    </button>
  );
}

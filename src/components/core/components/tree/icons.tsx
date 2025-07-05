import { cn } from '@/components/core/class-config';

export const DefaultExpandIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('h-4 w-4 transition-transform duration-200', className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DefaultCollapseIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn(
      'h-4 w-4 rotate-90 transition-transform duration-200',
      className,
    )}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

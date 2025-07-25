import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/loading/class-config.ts';

export const DefaultLoadingIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn(classConfig.loadingIcon, className)}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="20"
      cy="20"
      r="16"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="75.4 25.13"
    />
  </svg>
);

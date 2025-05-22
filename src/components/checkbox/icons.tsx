import classConfig from '@/components/checkbox/class-config.ts';
import { cn } from '@/utils/styles';

export const DefaultCheckedIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={cn(classConfig.iconConfig, className)}
    stroke="currentColor"
    strokeWidth="4"
  >
    <path d="M5 12L10 17L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DefaultIndeterminateIcon = ({
  className,
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={cn(classConfig.iconConfig, className)}
    stroke="currentColor"
    strokeWidth="4"
  >
    <path d="M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

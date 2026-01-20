import { cn } from '@/components/core/class-config';
import classConfig from '@/components/core/components/checkbox/class-config.ts';

const classConfigData = classConfig();

export const DefaultCheckedIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={cn(classConfigData.icon({ className }))}
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
    className={cn(classConfigData.icon({ className }))}
    stroke="currentColor"
    strokeWidth="4"
  >
    <path d="M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

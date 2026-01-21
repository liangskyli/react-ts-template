import classConfig from '@/components/core/components/tree/class-config.ts';

const classConfigData = classConfig();

export const DefaultExpandIcon = ({ className }: { className?: string }) => (
  <svg
    className={classConfigData.defaultExpandIcon({ className })}
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
    className={classConfigData.defaultCollapseIcon({ className })}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

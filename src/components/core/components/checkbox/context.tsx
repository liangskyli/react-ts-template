import { createContext } from 'react';

export type CheckboxContextValue = {
  value: (string | number)[];
  disabled?: boolean;
  onChange?: (value: (string | number)[]) => void;
};

export const CheckboxContext = createContext<CheckboxContextValue>({
  value: [], // 提供默认空数组
});

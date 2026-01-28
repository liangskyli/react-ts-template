import { createContext } from 'react';

export type CheckboxGroupContextValue = {
  value: (string | number)[];
  disabled?: boolean;
  onChange?: (value: (string | number)[]) => void;
};

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue>({
  value: [], // 提供默认空数组
});

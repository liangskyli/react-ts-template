import ListDemo from '@/pages/test/components/tw/List-demo.tsx';
import BadgeDemo from '@/pages/test/components/tw/badge-demo.tsx';
import ButtonDemo from '@/pages/test/components/tw/button-demo.tsx';
import CheckboxDemo from '@/pages/test/components/tw/checkbox-demo.tsx';
import FormDemo from '@/pages/test/components/tw/form-demo.tsx';
import InputDemo from '@/pages/test/components/tw/input-demo.tsx';
import LoadingDemo from '@/pages/test/components/tw/loading-demo.tsx';
import PopoverDemo from '@/pages/test/components/tw/popover-demo.tsx';
import PopupDemo from '@/pages/test/components/tw/popup-demo.tsx';
import RadioDemo from '@/pages/test/components/tw/radio-demo.tsx';
import SearchBarDemo from '@/pages/test/components/tw/search-bar-demo.tsx';
import SkeletonDemo from '@/pages/test/components/tw/skeleton-demo.tsx';
import StepsDemo from '@/pages/test/components/tw/steps-demo.tsx';
import SwitchDemo from '@/pages/test/components/tw/switch-demo.tsx';
import TextareaDemo from '@/pages/test/components/tw/textarea-demo.tsx';
import ToastDemo from '@/pages/test/components/tw/toast-demo.tsx';
import TreeCheckboxDemo from '@/pages/test/components/tw/tree-checkbox-demo.tsx';
import TreeDemo from '@/pages/test/components/tw/tree-demo.tsx';
import TreeRadioDemo from '@/pages/test/components/tw/tree-radio-demo.tsx';
import VirtualGridDemo from '@/pages/test/components/tw/virtual-grid-demo.tsx';

const Index = () => {
  return (
    <div className="tw-mt-[10px] tw-text-center">
      <title>UI</title>
      <VirtualGridDemo />
      <SearchBarDemo />
      <TreeCheckboxDemo />
      <TreeRadioDemo />
      <TreeDemo />
      <StepsDemo />
      <BadgeDemo />
      <SkeletonDemo />
      <LoadingDemo />
      <ButtonDemo />
      <InputDemo />
      <PopupDemo />
      <ToastDemo />
      <PopoverDemo />
      <CheckboxDemo />
      <RadioDemo />
      <TextareaDemo />
      <SwitchDemo />
      <ListDemo />
      <FormDemo />
    </div>
  );
};

export default Index;

import ListDemo from '@/pages/test/components/List-demo.tsx';
import BadgeDemo from '@/pages/test/components/badge-demo.tsx';
import ButtonDemo from '@/pages/test/components/button-demo.tsx';
import CheckboxDemo from '@/pages/test/components/checkbox-demo.tsx';
import FormDemo from '@/pages/test/components/form-demo.tsx';
import InputDemo from '@/pages/test/components/input-demo.tsx';
import LoadingDemo from '@/pages/test/components/loading-demo.tsx';
import PopoverDemo from '@/pages/test/components/popover-demo.tsx';
import PopupDemo from '@/pages/test/components/popup-demo.tsx';
import RadioDemo from '@/pages/test/components/radio-demo.tsx';
import SearchBarDemo from '@/pages/test/components/search-bar-demo.tsx';
import SkeletonDemo from '@/pages/test/components/skeleton-demo.tsx';
import StepsDemo from '@/pages/test/components/steps-demo.tsx';
import SwitchDemo from '@/pages/test/components/switch-demo.tsx';
import TextareaDemo from '@/pages/test/components/textarea-demo.tsx';
import ToastDemo from '@/pages/test/components/toast-demo.tsx';
import TreeCheckboxDemo from '@/pages/test/components/tree-checkbox-demo.tsx';
import TreeDemo from '@/pages/test/components/tree-demo.tsx';
import TreeRadioDemo from '@/pages/test/components/tree-radio-demo.tsx';
import VirtualGridDemo from '@/pages/test/components/virtual-grid-demo.tsx';
import VirtualTableDemo from '@/pages/test/components/virtual-table-demo.tsx';

const Index = () => {
  return (
    <div className="mt-[10px] text-center">
      <title>UI</title>
      <VirtualTableDemo />
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

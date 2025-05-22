import ListDemo from '@/pages/test/components/tw/List-demo.tsx';
import ButtonDemo from '@/pages/test/components/tw/button-demo.tsx';
import CheckboxDemo from '@/pages/test/components/tw/checkbox-demo.tsx';
import FormDemo from '@/pages/test/components/tw/form-demo.tsx';
import InputDemo from '@/pages/test/components/tw/input-demo.tsx';
import LoadingDemo from '@/pages/test/components/tw/loading-demo.tsx';
import PopoverDemo from '@/pages/test/components/tw/popover-demo.tsx';
import PopupDemo from '@/pages/test/components/tw/popup-demo.tsx';
import RadioDemo from '@/pages/test/components/tw/radio-demo.tsx';
import SwitchDemo from '@/pages/test/components/tw/switch-demo.tsx';
import TextareaDemo from '@/pages/test/components/tw/textarea-demo.tsx';
import ToastDemo from '@/pages/test/components/tw/toast-demo.tsx';

const Index = () => {
  return (
    <div className="tw-mt-[10px] tw-text-center">
      <title>UI</title>
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

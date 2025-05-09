import ListDemo from '@/pages/test/components/List-demo.tsx';
import ButtonDemo from '@/pages/test/components/button-demo.tsx';
import CheckboxDemo from '@/pages/test/components/checkbox-demo.tsx';
import FormDemo from '@/pages/test/components/form-demo.tsx';
import InputDemo from '@/pages/test/components/input-demo.tsx';
import PopupDemo from '@/pages/test/components/popup-demo.tsx';
import RadioDemo from '@/pages/test/components/radio-demo.tsx';
import SwitchDemo from '@/pages/test/components/switch-demo.tsx';
import TextareaDemo from '@/pages/test/components/textarea-demo.tsx';
import ToastDemo from '@/pages/test/components/toast-demo.tsx';

const Index = () => {
  return (
    <div className="mt-[10px] text-center">
      <title>UI</title>
      <ButtonDemo />
      <InputDemo />
      <PopupDemo />
      <ToastDemo />
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

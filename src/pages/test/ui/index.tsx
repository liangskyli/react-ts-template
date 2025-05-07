import ButtonDemo from '@/pages/test/components/ButtonDemo.tsx';
import CheckboxDemo from '@/pages/test/components/CheckboxDemo.tsx';
import InputDemo from '@/pages/test/components/InputDemo.tsx';
import ListDemo from '@/pages/test/components/ListDemo.tsx';
import PopupDemo from '@/pages/test/components/PopupDemo.tsx';
import RadioGroupDemo from '@/pages/test/components/RadioGroupDemo.tsx';
import SwitchDemo from '@/pages/test/components/SwitchDemo.tsx';
import TextAreaDemo from '@/pages/test/components/TextAreaDemo.tsx';
import ToastDemo from '@/pages/test/components/ToastDemo.tsx';
import FormDemo from '@/pages/test/components/form-demo.tsx';

const Index = () => {
  return (
    <div className="mt-[10px] text-center">
      <title>UI</title>
      <ButtonDemo />
      <InputDemo />
      <PopupDemo />
      <ToastDemo />
      <CheckboxDemo />
      <RadioGroupDemo />
      <TextAreaDemo />
      <SwitchDemo />
      <ListDemo />
      <FormDemo />
    </div>
  );
};

export default Index;

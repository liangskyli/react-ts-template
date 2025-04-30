import ButtonDemo from '@/pages/test/components/ButtonDemo.tsx';
import CheckboxDemo from '@/pages/test/components/CheckboxDemo.tsx';
import InputDemo from '@/pages/test/components/InputDemo.tsx';
import PopupDemo from '@/pages/test/components/PopupDemo.tsx';
import RadioGroupDemo from '@/pages/test/components/RadioGroupDemo.tsx';
import TextAreaDemo from '@/pages/test/components/TextAreaDemo.tsx';
import ToastDemo from '@/pages/test/components/ToastDemo.tsx';

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
    </div>
  );
};

export default Index;

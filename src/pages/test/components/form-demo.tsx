import { Controller, useForm } from 'react-hook-form';
import Button from '@/components/button';
import Input from '@/components/input';
import FormFiled1 from '@/pages/test/components/form-field1.tsx';

type FormValues1 = {
  group1: {
    name1: string;
    name2: string;
  };
  group2: {
    name1: string;
    name2: string;
  };
  name3?: string;
};

type FormValues2 = {
  name1: string;
  name2: string;
};

const FormDemo = () => {
  // 明确指定 useForm 的泛型类型
  const form1 = useForm<FormValues1>();
  const form2 = useForm<FormValues2>();

  // 手动触发表单提交
  const submitHandler1 = () => {
    form1.handleSubmit(
      (data) => {
        console.log('表单数据1:', data);
      },
      (fieldErrors) => {
        console.log('验证失败1:', fieldErrors);
      },
    )();
  };

  const submitHandler2 = () => {
    form2.handleSubmit(
      (data) => {
        console.log('表单数据2:', data);
      },
      (fieldErrors) => {
        console.log('验证失败2:', fieldErrors);
      },
    )();
  };

  return (
    <div className="px-2">
      <FormFiled1 form={form1} prefixName="group1." />
      <FormFiled1 form={form1} prefixName="group2." />
      <Controller
        name="name3"
        control={form1.control}
        rules={{ required: 'name3 is required' }}
        render={({ field, fieldState }) => (
          <>
            <Input
              className="mb-1"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            {fieldState.error && <div>{fieldState.error.message}</div>}
          </>
        )}
      />
      <Button onClick={submitHandler1}>提交1</Button>

      <FormFiled1 form={form2} />
      <Button onClick={submitHandler2}>提交2</Button>
    </div>
  );
};

export default FormDemo;

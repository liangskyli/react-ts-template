import { Controller, useForm } from 'react-hook-form';
import Button from '@/components/button';
import Input from '@/components/input';
import FormFiled1 from '@/pages/test/components/form-field1.tsx';

type FormValues1 = {
  group1: {
    name1: string;
    name2: string;
  };
  group2?: {
    name1: string;
    name2: string;
  };
  name3?: string;
  others?: {
    name3?: string;
  };
};

type FormValues2 = {
  name1: string;
  name2: string;
};

const FormDemo = () => {
  // 明确指定 useForm 的泛型类型
  const form1 = useForm<FormValues1>({
    values: {
      group1: {
        name1: 'test',
        name2: 'test2',
      },
    },
  });
  const form2 = useForm<FormValues2>();

  // 手动触发表单提交
  const submitHandler1 = () => {
    // 提交前再次检查表单值
    console.log('Form values before submit:', form1.getValues());

    form1.handleSubmit(
      async (data) => {
        console.log('表单数据1:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
      <h2 className="text-xl font-bold">Form 组件</h2>
      <div className="mb-2 border border-gray-600 p-2">
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
                ref={field.ref}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
              {fieldState.error && (
                <div className="text-left text-red">
                  {fieldState.error.message}
                </div>
              )}
            </>
          )}
        />
        <Button onClick={submitHandler1} loading={form1.formState.isSubmitting}>
          提交1
        </Button>
        <div className="p-[300px]"></div>
        <Button onClick={submitHandler1} loading={form1.formState.isSubmitting}>
          提交滚动定位
        </Button>
      </div>
      <div className="mb-2 border border-gray-600 p-2">
        <FormFiled1 form={form2} />
        <Button onClick={submitHandler2}>提交2</Button>
      </div>
    </div>
  );
};

export default FormDemo;

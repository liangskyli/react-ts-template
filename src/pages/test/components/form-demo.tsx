import { Controller, useForm } from 'react-hook-form';
import Button from '@/components/button';
import Checkbox from '@/components/checkbox';
import RadioGroup from '@/components/radio';
import Switch from '@/components/switch';
import TextArea from '@/components/textarea';
import FormGroupFiled from '@/pages/test/components/form-group-field.tsx';

type FormValues1 = {
  group1: {
    name1: string;
    name2: string;
  };
  group2: {
    name1: string;
    name2: string;
  };
  name3: number | null;
  name4: number[];
  name5: string;
  name6: boolean;
};

type FormValues2 = {
  name1: string;
  name2: string;
};

const FormDemo = () => {
  // 明确指定 useForm 的泛型类型
  const form1 = useForm<FormValues1>({
    // values 确保包含所有表单字段，避免字段丢失
    values: {
      group1: {
        name1: 'test',
        name2: 'test2',
      },
      group2: {
        name1: 'test',
        name2: 'test2',
      },
      name3: null,
      name4: [],
      name5: '',
      name6: false,
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
        <FormGroupFiled form={form1} prefixName="group1." />
        <FormGroupFiled form={form1} prefixName="group2." />
        <Controller
          name="name3"
          control={form1.control}
          defaultValue={null}
          rules={{ required: 'name3 is required' }}
          render={({ field, fieldState }) => (
            <>
              <RadioGroup<number | null>
                className="mb-1"
                formRef={field.ref}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                <RadioGroup.Radio
                  /*ref={field.ref}*/
                  value={1}
                >
                  选项 1
                </RadioGroup.Radio>
                <RadioGroup.Radio value={2}>选项 2</RadioGroup.Radio>
                <RadioGroup.Radio value={3}>选项 3</RadioGroup.Radio>
              </RadioGroup>
              {fieldState.error && (
                <div className="text-left text-red">
                  {fieldState.error.message}
                </div>
              )}
            </>
          )}
        />
        <Controller
          name="name4"
          control={form1.control}
          rules={{ required: 'name4 is required' }}
          render={({ field, fieldState }) => (
            <>
              <Checkbox.Group
                className="mb-1"
                formRef={field.ref}
                value={field.value}
                onChange={field.onChange}
              >
                <Checkbox
                  /*ref={field.ref}*/
                  value={1}
                >
                  选项1
                </Checkbox>
                <Checkbox value={2}>选项2</Checkbox>
                <Checkbox value={3}>选项3</Checkbox>
              </Checkbox.Group>
              {fieldState.error && (
                <div className="text-left text-red">
                  {fieldState.error.message}
                </div>
              )}
            </>
          )}
        />
        <Controller
          name="name5"
          control={form1.control}
          rules={{ required: 'name5 is required' }}
          render={({ field, fieldState }) => (
            <>
              <TextArea
                className="mb-1"
                textareaClassName="data-[invalid]:border-pink-500 focus:data-[invalid]:border-pink-500 focus:data-[invalid]:ring-pink-500"
                ref={field.ref}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={!!fieldState.error}
                placeholder="请输入内容"
              />
              {fieldState.error && (
                <div className="text-left text-red">
                  {fieldState.error.message}
                </div>
              )}
            </>
          )}
        />
        <Controller
          name="name6"
          control={form1.control}
          rules={{ required: 'name5 is required' }}
          render={({ field, fieldState }) => (
            <>
              <Switch
                /** 移动端div,span元素才可滚动定位 */
                as={'div'}
                ref={field.ref}
                checked={field.value}
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
        <div className="py-[400px]"></div>
        <Button onClick={submitHandler1} loading={form1.formState.isSubmitting}>
          提交滚动定位
        </Button>
      </div>
      <div className="mb-2 border border-gray-600 p-2">
        <FormGroupFiled form={form2} />
        <Button onClick={submitHandler2}>提交2</Button>
      </div>
    </div>
  );
};

export default FormDemo;

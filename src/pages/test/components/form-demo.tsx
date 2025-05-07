import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/components/button';
import Input from '@/components/input';

type Inputs = {
  name1: string;
  name2: string;
};

const FormDemo = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };
  console.log('errors:',errors);
  return (
    <div className="space-y-6 px-2">
      {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
        <Controller
          name="name1"
          control={control}
          defaultValue="test"
          rules={{ required: "name1 is required" }}
          render={({ field }) => (
            <Input
              className="mb-1"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.name1 && <div>{errors.name1.message}</div>}

        <Controller
          name="name2"
          control={control}
          rules={{ required: "name2 is required", maxLength: { value: 5, message: 'name2 maxLength 5' }, }}
          render={({ field }) => (
            <Input
              className="mb-1"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.name2 && <div>{errors.name2.message}</div>}

      <Button type="submit">提交</Button>
      <Button onSubmit={handleSubmit(onSubmit,(data2)=>{
        console.log('data2:',data2);
      })}>提交2</Button>
      {/*</form>*/}
    </div>
  );
};

export default FormDemo;

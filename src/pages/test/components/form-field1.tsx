import { Controller } from 'react-hook-form';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import Input from '@/components/input';

type IFormFiled1<T extends FieldValues> = {
  form: UseFormReturn<T>;
  prefixName?: string;
};
const FormFiled1 = <T extends FieldValues = FieldValues>(
  props: IFormFiled1<T>,
) => {
  const { form, prefixName = '' } = props;

  return (
    <div className="px-2">
      <Controller
        name={`${prefixName}name1` as never}
        control={form.control}
        defaultValue={'test' as never}
        rules={{ required: 'name1 is required' }}
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

      <Controller
        name={`${prefixName}name2` as never}
        control={form.control}
        rules={{
          required: 'name2 is required',
          maxLength: { value: 5, message: 'name2 maxLength 5' },
        }}
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
    </div>
  );
};

export default FormFiled1;

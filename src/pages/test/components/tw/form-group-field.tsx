import { Controller } from 'react-hook-form';
import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';
import Input from '@/components/core/components/input';

type IFormFiled1<T extends FieldValues> = {
  form: UseFormReturn<T>;
  prefixName?: string;
};
const FormGroupFiled = <T extends FieldValues = FieldValues>(
  props: IFormFiled1<T>,
) => {
  const { form, prefixName = '' } = props;

  return (
    <>
      <Controller
        name={`${prefixName}name1` as FieldPath<T>}
        control={form.control}
        defaultValue={'test' as FieldPathValue<T, FieldPath<T>>}
        rules={{
          required: 'name1 is required',
          validate: {
            test: (value) => {
              return value === 'test' || 'value must be test';
            },
          },
        }}
        render={({ field, fieldState }) => (
          <>
            <div className="tw-flex tw-items-center">
              <div className="tw-mr-2 tw-text-sm tw-font-medium tw-text-gray-700">
                title1:
              </div>
              <Input
                className="tw-mb-1"
                ref={field.ref}
                value={field.value}
                disabled={field.disabled}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </div>
            {fieldState.error && (
              <div className="tw-text-left tw-text-red">
                {fieldState.error.message}
              </div>
            )}
          </>
        )}
      />

      <Controller
        name={`${prefixName}name2` as FieldPath<T>}
        control={form.control}
        rules={{
          required: 'name2 is required',
          maxLength: { value: 5, message: 'name2 maxLength 5' },
        }}
        render={({ field, fieldState }) => (
          <>
            <Input
              className="tw-mb-1"
              ref={field.ref}
              value={field.value}
              disabled={field.disabled}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            {fieldState.error && (
              <div className="tw-text-left tw-text-red">
                {fieldState.error.message}
              </div>
            )}
          </>
        )}
      />
    </>
  );
};

export default FormGroupFiled;

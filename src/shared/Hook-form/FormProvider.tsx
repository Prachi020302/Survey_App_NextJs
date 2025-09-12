// form
import {
  FormProvider as Form,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";

// ----------------------------------------------------------------------

type Props<T extends FieldValues = FieldValues> = {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
  onSubmit?: VoidFunction;
};

export default function FormProvider<T extends FieldValues = FieldValues>({
  children,
  onSubmit,
  methods,
}: Props<T>) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}

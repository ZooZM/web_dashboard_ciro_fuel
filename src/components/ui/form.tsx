import * as React from 'react';
import type { FieldValues, UseFormReturn, Path } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  children: (props: { id: string; error: boolean }) => React.ReactNode;
  className?: string;
}

export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  children,
  className,
}: FormFieldProps<T>) {
  const error = form.formState.errors[name];
  const id = `field-${name}`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children({ id, error: Boolean(error) })}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {String(error.message ?? '')}
        </p>
      ) : null}
    </div>
  );
}

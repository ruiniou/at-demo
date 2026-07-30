import React, { forwardRef } from "react";
import { Textarea, TextareaProps } from "./Textarea";
import { FormItem } from "./FormItem";

export interface FormTextAreaProps extends Omit<TextareaProps, 'className'> {
  label?: string;
  error?: string;
  badge?: React.ReactNode;
  containerClassName?: string;
  className?: string;
}

// Form-wrapped Textarea component
const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ className = "", containerClassName = "", label, error, disabled, required, badge, ...props }, ref) => {
    return (
      <FormItem
        label={label}
        labelClassName="t-small-medium"
        required={required}
        disabled={disabled}
        error={error}
        badge={badge}
        className={containerClassName}
      >
        <Textarea 
          ref={ref} 
          disabled={disabled} 
          required={required} 
          hasError={!!error}
          className={className}
          {...props} 
        />
      </FormItem>
    );
  }
);

FormTextArea.displayName = "FormTextArea";

export { FormTextArea };

import React, { forwardRef } from "react";
import { Input, InputProps } from "./Input";
import { FormItem } from "./FormItem";

export interface FormInputFieldProps extends InputProps {
  label?: string;
  error?: string;
  badge?: React.ReactNode;
}

// Figma 455:672 — Form/Input Field
const FormInputField = forwardRef<HTMLInputElement, FormInputFieldProps>(
  ({ className = "", label, error, disabled, required, badge, ...props }, ref) => {
    return (
      <FormItem
        label={label}
        labelClassName="t-small-medium"
        required={required}
        disabled={disabled}
        error={error}
        badge={badge}
        className={className}
      >
        <Input 
          ref={ref} 
          disabled={disabled} 
          required={required} 
          hasError={!!error}
          {...props} 
        />
      </FormItem>
    );
  }
);
FormInputField.displayName = "FormInputField";

export { FormInputField };

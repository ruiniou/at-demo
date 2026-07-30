import React from "react";

export interface FormItemProps {
  label?: React.ReactNode;
  labelClassName?: string;
  required?: boolean;
  disabled?: boolean;
  badge?: React.ReactNode;
  actionButton?: React.ReactNode;
  error?: string;
  className?: string;
  headerClassName?: string;
  children: React.ReactNode;
}

export function FormItem({
  label,
  labelClassName = "t-small",
  required = false,
  disabled = false,
  badge,
  actionButton,
  error,
  className = "",
  headerClassName = "h-[20px]",
  children,
}: FormItemProps) {
  const labelColor = disabled ? "var(--color-graphite-20)" : "var(--color-text-primary)";

  return (
    <div className={`flex flex-col gap-[4px] w-full text-left ${className}`}>
      {(label || badge || actionButton) && (
        <div className={`flex items-center justify-between ${headerClassName}`}>
          <div className="flex items-center gap-[2px]">
            {label && (
              <span
                className={labelClassName}
                style={{
                  color: labelColor,
                }}
              >
                {label}
              </span>
            )}
            {required && (
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: 12,
                  color: "var(--color-az-danger)",
                }}
              >
                *
              </span>
            )}
            {badge}
          </div>
          {actionButton}
        </div>
      )}

      {children}

      {error && (
        <span
          style={{
            fontFamily: "'PingFang SC', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "20px",
            color: "var(--color-form-error, #E03B3B)",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

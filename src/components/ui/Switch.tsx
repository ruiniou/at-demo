import React from 'react';
import { ConfigProvider, Switch as AntSwitch } from 'antd';

export interface SwitchProps {
  checked: boolean;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel: string;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Switch({
  checked,
  disabled = false,
  loading = false,
  ariaLabel,
  onChange,
  className = '',
}: SwitchProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'var(--color-brand-1)',
          colorPrimaryHover: 'var(--color-brand-1-hover)',
          colorTextQuaternary: 'var(--color-graphite-50)',
          colorText: 'var(--color-text-primary)',
          motionDurationMid: '0.15s',
        },
        components: {
          Switch: {
            trackHeight: 16,
            trackMinWidth: 28,
            trackPadding: 2,
            handleSize: 12,
          },
        },
      }}
    >
      <AntSwitch
        checked={checked}
        disabled={disabled}
        loading={loading}
        aria-label={ariaLabel}
        onChange={onChange}
        className={`atlas-switch ${className}`}
      />
    </ConfigProvider>
  );
}

export default Switch;

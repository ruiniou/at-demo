import React from 'react';

export interface SidebarPrimaryNavItemProps {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function SidebarPrimaryNavItem({ label, icon, selected, onClick }: SidebarPrimaryNavItemProps) {
  return <button
    type="button"
    onClick={onClick}
    aria-current={selected ? 'page' : undefined}
    className={`flex h-8 w-full cursor-pointer items-center gap-2 rounded-sm px-2 transition-colors ${selected
      ? 'bg-az-secondary text-brand-1'
      : 'text-text-primary hover:bg-black/5'}`}
    style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 'calc(var(--spacing) * 5)', fontWeight: selected ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)' }}
  >
    {icon}
    <span>{label}</span>
  </button>;
}

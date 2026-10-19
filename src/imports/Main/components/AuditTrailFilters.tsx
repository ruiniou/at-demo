import React, { useRef, useState } from 'react';
import { OptionList } from '../../../components/ui/OptionList';
import { OptionRow } from '../../../components/ui/OptionRow';
import { Popover } from '../../../components/ui/Popover';
import { DashboardIcon } from './DashboardPrimitives';
import arrowIcon from '../../../icons/arrow-down-s-line.svg';

export function AuditMultiSelect<T extends string>({ label, options, value, onChange }: { label: string; options: T[]; value: T[]; onChange: (value: T[]) => void }) {
  const anchor = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return <div><span className="mb-1 block t-small-medium">{label}</span><button ref={anchor} type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(current => !current)} className="audit-multi-trigger"><span className="truncate">{value.length ? value.join(', ') : 'All'}</span><DashboardIcon src={arrowIcon} className="size-4" /></button><Popover anchorRef={anchor} label={label} open={open} onOpenChange={setOpen}><OptionList multiselectable>{options.map(option => <OptionRow key={option} label={option} selectionMode="multi" selected={value.includes(option)} onSelect={() => onChange(value.includes(option) ? value.filter(item => item !== option) : [...value, option])} />)}</OptionList></Popover></div>;
}

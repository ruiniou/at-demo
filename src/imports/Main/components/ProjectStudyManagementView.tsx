import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { FilterChip } from '../../../components/ui/FilterChip';
import { Switch } from '../../../components/ui/Switch';
import { Tag } from '../../../components/ui/Tag';
import { Tooltip } from '../../../components/ui/Tooltip';
import { ProjectItem, StudyItem, SYSTEM_USERS, UserRole } from '../types/management';
import databaseIconUrl from '../../../icons/database-2-line.svg';
import capsuleIconUrl from '../../../icons/capsule-line.svg';
import stackIconUrl from '../../../icons/stack-line.svg';
import searchIconUrl from '../../../icons/search-line.svg';
import checkIconUrl from '../../../icons/check-line.svg';
import addIconUrl from '../../../icons/add-line.svg';
import microscopeIconUrl from '../../../icons/microscope-line.svg';

function ChevronRightTreeIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-150" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }} aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function MaskIcon({ src, className }: { src: string; className: string }) {
  const mask = `url("${src}") center / contain no-repeat`;
  return <span aria-hidden="true" className={`inline-block shrink-0 bg-current ${className}`} style={{ mask, WebkitMask: mask }} />;
}

function AvailabilitySwitch({ checked, disabled = false, label, onChange }: { checked: boolean; disabled?: boolean; label: string; onChange?: () => void }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className={`min-w-[52px] text-[12px] ${checked ? 'text-text-primary' : 'text-text-secondary'}`}>{checked ? 'Available' : 'Disabled'}</span>
      <Switch checked={checked} disabled={disabled} ariaLabel={label} onChange={() => onChange?.()} />
    </div>
  );
}

function OwnerPicker({ value, onSelect, disabledAppearance = false }: { value: string; onSelect: (owner: string) => void; disabledAppearance?: boolean }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = SYSTEM_USERS.find((user) => user.name === value);
  const filteredUsers = SYSTEM_USERS.filter((user) => {
    const query = search.trim().toLowerCase();
    return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
  });

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = 260;
    const estimatedHeight = 250;
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);
    const openAbove = window.innerHeight - rect.bottom < estimatedHeight && rect.top > estimatedHeight;
    setPosition({ left, top: openAbove ? Math.max(8, rect.top - estimatedHeight - 4) : rect.bottom + 4 });
  }, []);

  useEffect(() => {
    if (!open) { setSearch(''); return; }
    updatePosition();
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !popoverRef.current?.contains(target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  return (
    <div className="relative min-w-0">
      <button ref={buttonRef} type="button" onClick={() => setOpen((current) => !current)} aria-haspopup="dialog" aria-expanded={open} className="flex min-h-[40px] w-full min-w-0 items-center gap-[6px] rounded-[4px] px-[6px] text-left hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-1/20">
        <Avatar name={value || undefined} initials={currentUser?.initials} color={currentUser?.color} level="modal" disabled={disabledAppearance} />
        <span className={`truncate text-[12px] ${disabledAppearance ? 'text-graphite-40' : value ? 'text-text-primary' : 'text-text-secondary'}`}>{value || 'No Assignee'}</span>
      </button>
      {open && position && createPortal(
        <div ref={popoverRef} role="dialog" aria-label="Select Study Owner" style={{ position: 'fixed', top: position.top, left: position.left, width: 260, zIndex: 9999 }} className="flex flex-col gap-[6px] rounded-[8px] border border-graphite-10 bg-white p-[4px] shadow-elevation-overlay">
          <div className="flex h-[32px] items-center gap-[6px] rounded-[4px] border border-border-default px-[8px] focus-within:border-brand-1 focus-within:ring-1 focus-within:ring-brand-1/20">
            <img src={searchIconUrl} alt="" className="h-[13px] w-[13px] opacity-40" />
            <input ref={inputRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people..." className="min-w-0 flex-1 bg-transparent text-[12px] text-text-primary outline-none placeholder:text-text-secondary" />
          </div>
          <div className="max-h-[210px] overflow-y-auto">
            {filteredUsers.length === 0 ? <div className="px-[8px] py-[12px] text-center text-[12px] text-text-tertiary">No matching users</div> : filteredUsers.map((user) => {
              const selected = user.name === value;
              return (
                <button key={user.id} type="button" onClick={() => { if (!selected) onSelect(user.name); setOpen(false); buttonRef.current?.focus(); }} className={`flex min-h-[32px] w-full items-center gap-[8px] rounded-[4px] px-[8px] py-[6px] text-left transition-colors ${selected ? 'bg-az-secondary/60 text-brand-1 font-medium' : 'text-text-primary hover:bg-bg-panel'}`}>
                  <Avatar name={user.name} initials={user.initials} color={user.color} level="menu" />
                  <span className="min-w-0 flex-1 truncate text-[12px]">{user.name}</span>
                  {selected && <img src={checkIconUrl} alt="" className="h-[14px] w-[14px] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>, document.body)}
    </div>
  );
}

interface ProjectStudyManagementViewProps {
  currentRole: UserRole;
  currentUserName: string;
  projects: ProjectItem[];
  onOpenNewProject: () => void;
  onOpenNewStudy: (projectId?: string) => void;
  onChangeOwner: (projectId: string, studyId: string, owner: string) => void;
  onToggleProjectStatus: (projectId: string) => void;
  onToggleStudyStatus: (projectId: string, studyId: string) => void;
}

export const ProjectStudyManagementView: React.FC<ProjectStudyManagementViewProps> = ({ currentRole, currentUserName, projects, onOpenNewProject, onOpenNewStudy, onChangeOwner, onToggleProjectStatus, onToggleStudyStatus }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [taFilter, setTaFilter] = useState('All');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(() => new Set(projects.map((project) => project.id)));
  const previousStudyCounts = useRef(new Map(projects.map((project) => [project.id, project.studies.length])));

  useEffect(() => {
    setExpandedProjects((current) => {
      const next = new Set(current);
      projects.forEach((project) => {
        const previousCount = previousStudyCounts.current.get(project.id);
        if (previousCount === undefined || project.studies.length > previousCount) next.add(project.id);
      });
      return next;
    });
    previousStudyCounts.current = new Map(projects.map((project) => [project.id, project.studies.length]));
  }, [projects]);

  const visibleGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.map((project) => {
      let studies = currentRole === 'owner' ? project.studies.filter((study) => study.owner === currentUserName) : project.studies;
      if (taFilter !== 'All') studies = studies.filter((study) => study.ta === taFilter);
      if (statusFilter !== 'all') studies = studies.filter((study) => {
        const enabled = project.status === 'enabled' && study.status === 'enabled';
        return statusFilter === 'enabled' ? enabled : !enabled;
      });
      const projectMatches = project.name.toLowerCase().includes(query) || project.id.toLowerCase().includes(query);
      if (query && !projectMatches) studies = studies.filter((study) => study.id.toLowerCase().includes(query) || study.owner.toLowerCase().includes(query) || study.ta.toLowerCase().includes(query));
      if (currentRole === 'owner' && studies.length === 0) return null;
      if (query && studies.length === 0 && !projectMatches) return null;
      return { project, studies };
    }).filter((group): group is { project: ProjectItem; studies: StudyItem[] } => group !== null);
  }, [projects, currentRole, currentUserName, search, statusFilter, taFilter]);

  const isAdmin = currentRole === 'admin';
  const isStudyOwner = currentRole === 'owner';
  const hasActiveFilters = search.trim().length > 0 || taFilter !== 'All' || statusFilter !== 'all';
  const resetFilters = () => {
    setSearch('');
    setTaFilter('All');
    setStatusFilter('all');
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[14px] overflow-hidden px-[16px] pb-[20px] pt-[20px] sm:px-[28px]">
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-az-secondary text-brand-1"><MaskIcon src={databaseIconUrl} className="h-[16px] w-[16px]" /></div>
          <h1 className="text-[22px] font-bold leading-[28px] tracking-tight text-text-primary">Projects &amp; Studies</h1>
        </div>
        {isAdmin && <Button variant="primary" onClick={onOpenNewProject} className="shrink-0 whitespace-nowrap px-[14px] py-[6px]">+ New Project</Button>}
      </div>
      <div className="flex shrink-0 flex-col justify-between gap-[12px] sm:flex-row sm:items-center">
        <div className="flex max-w-[620px] flex-1 items-center gap-[10px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search Project/Study" background="light" className="w-full shrink-0 sm:w-[300px] md:w-[340px]" icon={<MaskIcon src={searchIconUrl} className="h-[16px] w-[16px] text-text-secondary" />} />
          <FilterChip type="Dropdown" variant="filter" label={taFilter === 'All' ? 'All TA' : `TA: ${taFilter}`} value={taFilter} onChange={setTaFilter} icon={<MaskIcon src={microscopeIconUrl} className="h-[16px] w-[16px]" />} options={[{ label: 'All TA', value: 'All' }, { label: 'Oncology', value: 'Oncology' }, { label: 'Cardiology', value: 'Cardiology' }, { label: 'Neurology', value: 'Neurology' }, { label: 'Immunology', value: 'Immunology' }]} />
          <FilterChip type="Dropdown" variant="filter" showIcon={false} label={statusFilter === 'all' ? 'All Status' : statusFilter === 'enabled' ? 'Available' : 'Disabled'} value={statusFilter} onChange={(value) => setStatusFilter(value as typeof statusFilter)} options={[{ label: 'All Status', value: 'all' }, { label: 'Available', value: 'enabled' }, { label: 'Disabled', value: 'disabled' }]} />
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[6px] border border-graphite-10 bg-white">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup><col /><col className="w-[240px]" /><col className="w-[180px]" /><col className="w-[80px]" /></colgroup>
          <thead><tr className="border-b border-graphite-10 bg-bg-app text-[12px] text-text-secondary"><th className="px-[16px] py-[10px] font-normal">Project / Study</th><th className="px-[16px] py-[10px] font-normal">Study Owner</th><th className="px-[16px] py-[10px] font-normal">Status</th><th className="px-[16px] py-[10px]" aria-label="Actions" /></tr></thead>
        </table>
        <div className="min-h-0 flex-1 overflow-y-auto">
        {visibleGroups.length === 0 ? <div className="flex h-full min-h-[240px] flex-col items-center justify-center text-center text-text-muted"><img src={databaseIconUrl} alt="" className="mb-[6px] h-[28px] w-[28px] opacity-40" /><span className="text-[13px] font-medium">No matching projects or studies found</span>{hasActiveFilters && <button type="button" onClick={resetFilters} className="mt-[8px] cursor-pointer text-[12px] font-medium text-brand-1 hover:underline">Reset Filters</button>}</div> : (
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup><col /><col className="w-[240px]" /><col className="w-[180px]" /><col className="w-[80px]" /></colgroup>
            <tbody className="divide-y divide-graphite-10 text-[13px]">
              {visibleGroups.map(({ project, studies }) => {
                const expanded = expandedProjects.has(project.id);
                const projectDisabled = project.status === 'disabled';
                return <React.Fragment key={project.id}>
                  <tr className="group/project h-[48px] bg-bg-panel hover:bg-graphite-10/60">
                    <td className="py-0 pl-[16px] pr-[16px]"><div className="flex h-[48px] items-center gap-[16px]">
                      <button type="button" onClick={() => setExpandedProjects((current) => { const next = new Set(current); next.has(project.id) ? next.delete(project.id) : next.add(project.id); return next; })} aria-expanded={expanded} className="flex h-[48px] min-w-0 flex-1 items-center gap-[8px] text-left text-text-secondary">
                        <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center"><ChevronRightTreeIcon isExpanded={expanded} /></span><MaskIcon src={capsuleIconUrl} className={`h-[16px] w-[16px] text-text-secondary ${projectDisabled ? 'opacity-50' : ''}`} /><span className={`truncate font-semibold ${projectDisabled ? 'text-text-secondary' : 'text-text-primary'}`}>{project.name}</span>
                      </button>
                    </div></td>
                    <td className="px-[16px] py-0" />
                    <td className="px-[16px] py-0"><AvailabilitySwitch checked={!projectDisabled} disabled={!isAdmin} label={`${project.name} availability`} onChange={() => onToggleProjectStatus(project.id)} /></td>
                    <td className="w-[80px] px-[16px] py-0 text-right">
                      {isAdmin && !projectDisabled && (
                        <Tooltip label="Add Study">
                          <Button variant="icon" size="icon" type="button" onClick={() => onOpenNewStudy(project.id)} aria-label={`Add study to ${project.name}`} className="text-brand-1 opacity-0 pointer-events-none transition-[opacity,background-color,transform] duration-150 hover:bg-az-secondary hover:text-brand-1 active:scale-[0.96] focus-visible:opacity-100 group-hover/project:opacity-100 group-hover/project:pointer-events-auto group-focus-within/project:opacity-100 group-focus-within/project:pointer-events-auto">
                            <MaskIcon src={addIconUrl} className="h-[14px] w-[14px]" />
                          </Button>
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                  {expanded && studies.map((study) => {
                    const effectiveDisabled = projectDisabled || study.status === 'disabled';
                    const canMaintainOwner = isAdmin || (isStudyOwner && study.owner === currentUserName);
                    return <tr key={study.id} className="h-[48px] bg-white hover:bg-black/[0.02]">
                      <td className="py-0 pl-[40px] pr-[16px]"><div className="flex h-[48px] items-center gap-[8px]"><MaskIcon src={stackIconUrl} className={`h-[16px] w-[16px] text-text-secondary ${effectiveDisabled ? 'opacity-50' : ''}`} /><span className={`font-medium ${effectiveDisabled ? 'text-graphite-40' : 'text-text-primary'}`}>{study.id}</span><Tag className={`h-[20px] py-0 pointer-events-none ${effectiveDisabled ? 'opacity-50' : ''}`}>{study.ta}</Tag></div></td>
                      <td className="px-[10px] py-[4px]">{canMaintainOwner ? <OwnerPicker value={study.owner} disabledAppearance={effectiveDisabled} onSelect={(owner) => onChangeOwner(project.id, study.id, owner)} /> : <div className="flex min-h-[40px] items-center gap-[6px] px-[6px]"><Avatar name={study.owner || undefined} level="modal" disabled={effectiveDisabled} /><span className={`truncate text-[12px] ${effectiveDisabled ? 'text-graphite-40' : study.owner ? 'text-text-primary' : 'text-text-secondary'}`}>{study.owner || 'No Assignee'}</span></div>}</td>
                      <td className="px-[16px] py-0"><AvailabilitySwitch checked={!effectiveDisabled} disabled={!isAdmin || projectDisabled} label={`${study.id} availability`} onChange={() => onToggleStudyStatus(project.id, study.id)} /></td>
                      <td className="w-[80px] px-[16px] py-0" />
                    </tr>;
                  })}
                </React.Fragment>;
              })}
            </tbody>
          </table>
        )}
        </div>
      </div>
    </div>
  );
};

export default ProjectStudyManagementView;

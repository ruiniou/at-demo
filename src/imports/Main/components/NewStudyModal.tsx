import { Avatar } from "../../../components/ui/Avatar";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../../components/ui/Button';
import { Dropdown } from '../../../components/ui/Dropdown';
import { FormInputField } from '../../../components/ui/FormInputField';
import { FormItem } from '../../../components/ui/FormItem';
import { SearchBar } from '../../../components/ui/SearchBar';
import { ProjectItem, SYSTEM_USERS, TA_OPTIONS } from '../types/management';
import closeLineIconUrl from '../../../icons/close-line.svg';
import checkLineIconUrl from '../../../icons/check-line.svg';

interface NewStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  defaultProjectId?: string;
  onCreateStudy: (data: {
    projectId: string;
    studyName: string;
    ta: string;
    owner: string;
  }) => void;
}

export const NewStudyModal: React.FC<NewStudyModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultProjectId,
  onCreateStudy,
}) => {
  const [projectId, setProjectId] = useState('');
  const [studyName, setStudyName] = useState('');
  const [ta, setTa] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [userSearch, setUserSearch] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableProjects = projects.filter((p) => p.status === 'enabled');

  useEffect(() => {
    if (isOpen) {
      setProjectId(
        defaultProjectId && availableProjects.some((p) => p.id === defaultProjectId)
          ? defaultProjectId
          : availableProjects[0]?.id || ''
      );
      setStudyName('');
      setTa(TA_OPTIONS[0]);
      setSelectedOwner(SYSTEM_USERS[0]?.name || '');
      setUserSearch('');
      setErrors({});
    }
  }, [isOpen, defaultProjectId, projects]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUsers = SYSTEM_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  const isFormComplete = Boolean(projectId && studyName.trim() && ta && selectedOwner);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!projectId) newErrors.project = 'Please select a project';
    const trimmedStudy = studyName.trim();
    if (!trimmedStudy) newErrors.study = 'Study Code is required';
    if (!ta) newErrors.ta = 'Please select a TA';
    if (!selectedOwner) newErrors.owner = 'Please assign a Study Owner';

    // Duplicate check
    const duplicateStudy = projects.some((project) =>
      project.studies.some((study) => study.id.toLowerCase() === trimmedStudy.toLowerCase())
    );
    if (duplicateStudy) {
      newErrors.study = `Study Code "${trimmedStudy}" already exists`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreateStudy({
      projectId,
      studyName: trimmedStudy,
      ta,
      owner: selectedOwner,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={onClose} aria-label="Close modal overlay" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-study-dialog-title"
        className="relative flex max-h-[90vh] w-[480px] max-w-[95vw] flex-col overflow-hidden rounded-[8px] border border-graphite-10 bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.14)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-[20px] pb-[14px] pt-[18px]">
          <h2 id="new-study-dialog-title" className="text-[16px] font-semibold leading-[22px] text-text-primary">New Study</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] transition-colors hover:bg-black/5 active:scale-[0.96]"
            aria-label="Close"
          >
            <img src={closeLineIconUrl} alt="" className="h-[14px] w-[14px] opacity-70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-[14px] overflow-y-auto px-[20px] py-[12px]">
            <Dropdown
              label="Belongs to Project"
              required
              value={projectId}
              onChange={(value) => {
                setProjectId(value);
                if (errors.project) setErrors((previous) => ({ ...previous, project: '' }));
              }}
              placeholder="Select a project"
              options={availableProjects.map((project) => ({ label: project.name, value: project.id }))}
            />

            <FormInputField
              label="Study Code"
              required
              value={studyName}
              error={errors.study || undefined}
              onChange={(event) => {
                setStudyName(event.target.value);
                if (errors.study) setErrors((previous) => ({ ...previous, study: '' }));
              }}
              placeholder="e.g. AZE2001-305"
            />

            <Dropdown
              label="Therapeutic Area (TA)"
              required
              value={ta}
              onChange={(value) => {
                setTa(value);
                if (errors.ta) setErrors((previous) => ({ ...previous, ta: '' }));
              }}
              placeholder="Select a therapeutic area"
              options={TA_OPTIONS.map((option) => ({ label: option, value: option }))}
            />

            <FormItem label="Assign Study Owner" labelClassName="t-small-medium" required error={errors.owner || undefined}>
              <div className="flex flex-col gap-[6px]">
                <SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search user by name or email..." background="light" size="compact" />
                <div className="flex max-h-[140px] flex-col gap-[2px] overflow-y-auto rounded-[4px] border border-form-border p-[4px]">
              {filteredUsers.length === 0 ? (
                <div className="p-[12px] text-center text-[12px] text-text-tertiary">
                  No matching users
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedOwner === u.name;
                  return (
                    <button
                      type="button"
                      key={u.id}
                      onClick={() => {
                        setSelectedOwner(u.name);
                        if (errors.owner) setErrors((prev) => ({ ...prev, owner: '' }));
                      }}
                      className={`flex items-center justify-between rounded-[4px] px-[8px] py-[6px] text-left transition-colors ${
                        isSelected
                          ? 'bg-az-secondary text-brand-1 font-medium'
                          : 'hover:bg-bg-panel text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-[8px] min-w-0">
                        <Avatar name={u.name} initials={u.initials} color={u.color} level="menu" />
                        <span className="text-[13px] truncate">{u.name}</span>
                        <span className="text-[11px] text-text-secondary truncate">({u.email})</span>
                      </div>
                      {isSelected && (
                        <img src={checkLineIconUrl} alt="" className="h-[14px] w-[14px] shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
                </div>
              </div>
            </FormItem>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-[10px] border-t border-graphite-10 bg-white px-[20px] py-[14px]">
            <Button variant="ghost" size="default" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="default" type="submit" disabled={!isFormComplete}>
              Create Study
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default NewStudyModal;

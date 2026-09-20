import { Avatar } from "../../../components/ui/Avatar";
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { ProjectItem, SYSTEM_USERS, TA_OPTIONS, SystemUser } from '../types/management';
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

  if (!isOpen) return null;

  const filteredUsers = SYSTEM_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!projectId) newErrors.project = 'Please select a project';
    const trimmedStudy = studyName.trim();
    if (!trimmedStudy) newErrors.study = 'Study Name is required';
    if (!ta) newErrors.ta = 'Please select a TA';
    if (!selectedOwner) newErrors.owner = 'Please assign a Study Owner';

    // Duplicate check
    const currentProj = projects.find((p) => p.id === projectId);
    if (currentProj && currentProj.studies.some((s) => s.id.toLowerCase() === trimmedStudy.toLowerCase())) {
      newErrors.study = `Study "${trimmedStudy}" already exists under ${projectId}`;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-[480px] rounded-[10px] border border-graphite-10 bg-white p-[24px] shadow-card-mulberry animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-[14px] border-b border-border-default shrink-0">
          <div>
            <h2 className="text-[17px] font-semibold text-text-primary">New Study</h2>
            <p className="text-[12px] text-text-secondary mt-[2px]">
              Add a study and assign its sole Study Owner.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-text-secondary hover:bg-black/5 hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Close"
          >
            <img src={closeLineIconUrl} alt="" className="h-[14px] w-[14px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-[16px] flex flex-col gap-[14px] overflow-y-auto min-h-0 flex-1 pr-[2px]">
          {/* Project Select */}
          <div className="flex flex-col gap-[5px]">
            <label className="text-[12px] font-medium text-text-secondary">
              Belongs to Project <span className="text-status-error">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                if (errors.project) setErrors((prev) => ({ ...prev, project: '' }));
              }}
              className="h-[36px] w-full rounded-[6px] border border-border-default px-[10px] text-[13px] text-text-primary bg-white outline-none focus:border-brand-1 focus:ring-1 focus:ring-brand-1"
            >
              {availableProjects.length === 0 ? (
                <option value="">No enabled projects available</option>
              ) : (
                availableProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
            {errors.project && <span className="text-[11px] text-status-error">{errors.project}</span>}
          </div>

          {/* Study Name */}
          <div className="flex flex-col gap-[5px]">
            <label className="text-[12px] font-medium text-text-secondary">
              Study Name <span className="text-status-error">*</span>
            </label>
            <input
              type="text"
              value={studyName}
              onChange={(e) => {
                setStudyName(e.target.value);
                if (errors.study) setErrors((prev) => ({ ...prev, study: '' }));
              }}
              placeholder="e.g. AZE2001-305"
              className={`h-[36px] w-full rounded-[6px] border px-[12px] text-[13px] text-text-primary outline-none transition-colors ${
                errors.study
                  ? 'border-status-error focus:border-status-error'
                  : 'border-border-default focus:border-brand-1 focus:ring-1 focus:ring-brand-1'
              }`}
            />
            {errors.study && <span className="text-[11px] text-status-error">{errors.study}</span>}
          </div>

          {/* Therapeutic Area (TA) */}
          <div className="flex flex-col gap-[5px]">
            <label className="text-[12px] font-medium text-text-secondary">
              Therapeutic Area (TA) <span className="text-status-error">*</span>
            </label>
            <select
              value={ta}
              onChange={(e) => {
                setTa(e.target.value);
                if (errors.ta) setErrors((prev) => ({ ...prev, ta: '' }));
              }}
              className="h-[36px] w-full rounded-[6px] border border-border-default px-[10px] text-[13px] text-text-primary bg-white outline-none focus:border-brand-1 focus:ring-1 focus:ring-brand-1"
            >
              {TA_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.ta && <span className="text-[11px] text-status-error">{errors.ta}</span>}
          </div>

          {/* Study Owner Picker */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-medium text-text-secondary">
                Assign Study Owner <span className="text-status-error">*</span>
              </label>
              <span className="text-[11px] text-text-tertiary">1 owner per study</span>
            </div>

            {/* Quick search input */}
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="h-[32px] w-full rounded-[6px] border border-border-default px-[10px] text-[12px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-1"
            />

            {/* User List */}
            <div className="flex flex-col gap-[2px] rounded-[6px] border border-border-default p-[4px] max-h-[140px] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-[12px] text-center text-[12px] text-text-tertiary">
                  No matching users
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedOwner === u.name;
                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedOwner(u.name);
                        if (errors.owner) setErrors((prev) => ({ ...prev, owner: '' }));
                      }}
                      className={`flex items-center justify-between px-[8px] py-[6px] rounded-[4px] cursor-pointer transition-colors ${
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
                    </div>
                  );
                })
              )}
            </div>
            {errors.owner && <span className="text-[11px] text-status-error">{errors.owner}</span>}
          </div>

          <div className="mt-[16px] flex items-center justify-end gap-[10px] pt-[8px] border-t border-border-default shrink-0">
            <Button variant="secondary" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Create Study
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewStudyModal;

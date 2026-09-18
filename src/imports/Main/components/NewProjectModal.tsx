import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';

import closeLineIconUrl from '../../../icons/close-line.svg';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectName: string) => void;
  existingProjectNames: string[];
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  existingProjectNames,
}) => {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProjectName('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = projectName.trim();
    if (!trimmed) {
      setError('Project Name is required');
      return;
    }
    const duplicate = existingProjectNames.some(
      (name) => name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setError(`Project "${trimmed}" already exists`);
      return;
    }

    onCreateProject(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-[440px] rounded-[10px] border border-graphite-10 bg-white p-[24px] shadow-card-mulberry animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-[14px] border-b border-border-default">
          <h2 className="text-[17px] font-semibold text-text-primary">New Project</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-text-secondary hover:bg-black/5 hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Close"
          >
            <img src={closeLineIconUrl} alt="" className="h-[14px] w-[14px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-text-secondary">
              Project Name <span className="text-status-error">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. PRO005"
              className={`h-[36px] w-full rounded-[6px] border px-[12px] text-[13px] text-text-primary transition-colors outline-none ${
                error
                  ? 'border-status-error focus:border-status-error focus:ring-1 focus:ring-status-error'
                  : 'border-border-default focus:border-brand-1 focus:ring-1 focus:ring-brand-1'
              }`}
            />
            {error && (
              <span className="text-[11px] text-status-error font-medium">{error}</span>
            )}
            <p className="text-[11px] text-text-tertiary mt-[2px]">
              After creating the project, you can add and manage studies under it.
            </p>
          </div>

          <div className="mt-[24px] flex items-center justify-end gap-[10px]">
            <Button variant="secondary" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;

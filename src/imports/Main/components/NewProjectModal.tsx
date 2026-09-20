import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../../components/ui/Button';
import { FormInputField } from '../../../components/ui/FormInputField';

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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={onClose} aria-label="Close modal overlay" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-dialog-title"
        className="relative flex w-[440px] max-w-[95vw] flex-col overflow-hidden rounded-[8px] border border-graphite-10 bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.14)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-[20px] pb-[14px] pt-[18px]">
          <h2 id="new-project-dialog-title" className="text-[16px] font-semibold leading-[22px] text-text-primary">New Project</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[4px] transition-colors hover:bg-black/5 active:scale-[0.96]"
            aria-label="Close"
          >
            <img src={closeLineIconUrl} alt="" className="h-[14px] w-[14px] opacity-70" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[6px] px-[20px] py-[12px]">
            <FormInputField
              label="Project Name"
              required
              autoFocus
              value={projectName}
              error={error || undefined}
              onChange={(event) => {
                setProjectName(event.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. PRO005"
            />
            <p className="text-[12px] leading-[18px] text-text-secondary">
              After creating the project, you can add and manage studies under it.
            </p>
          </div>

          <div className="flex items-center justify-end gap-[10px] border-t border-graphite-10 bg-white px-[20px] py-[14px]">
            <Button variant="ghost" size="default" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="default" type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default NewProjectModal;

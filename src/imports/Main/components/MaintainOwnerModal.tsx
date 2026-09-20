import { Avatar } from "../../../components/ui/Avatar";
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { SYSTEM_USERS, StudyItem } from '../types/management';
import closeLineIconUrl from '../../../icons/close-line.svg';
import checkLineIconUrl from '../../../icons/check-line.svg';

interface MaintainOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  study: StudyItem | null;
  projectId: string;
  isStudyOwnerRole: boolean;
  onSaveOwner: (projectId: string, studyId: string, newOwner: string) => void;
}

export const MaintainOwnerModal: React.FC<MaintainOwnerModalProps> = ({
  isOpen,
  onClose,
  study,
  projectId,
  isStudyOwnerRole,
  onSaveOwner,
}) => {
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && study) {
      setSelectedOwner(study.owner);
      setSearch('');
      setError(null);
    }
  }, [isOpen, study]);

  if (!isOpen || !study) return null;

  const filteredUsers = SYSTEM_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOwner) {
      setError('Please select an owner');
      return;
    }
    if (selectedOwner === study.owner) {
      onClose();
      return;
    }

    onSaveOwner(projectId, study.id, selectedOwner);
    onClose();
  };

  const title = isStudyOwnerRole ? 'Transfer Study Owner' : 'Maintain Study Owner';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-[460px] rounded-[10px] border border-graphite-10 bg-white p-[24px] shadow-card-mulberry animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-[14px] border-b border-border-default">
          <div>
            <h2 className="text-[17px] font-semibold text-text-primary">{title}</h2>
            <p className="text-[12px] text-text-secondary mt-[2px]">
              {isStudyOwnerRole
                ? 'Transferring ownership will revoke your ownership privileges for this study immediately.'
                : 'Configure or transfer the sole owner for this study.'}
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

        {/* Study Info Card */}
        <div className="mt-[16px] rounded-[6px] bg-bg-app border border-graphite-10 p-[12px] flex items-center justify-between text-[12px]">
          <div>
            <span className="text-text-secondary">Study: </span>
            <span className="font-semibold text-text-primary">{study.id}</span>
            <span className="text-text-tertiary ml-[6px]">({projectId})</span>
          </div>
          <div>
            <span className="text-text-secondary">Current Owner: </span>
            <span className="font-medium text-brand-1">{study.owner}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pt-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-medium text-text-secondary">
              Select New Owner <span className="text-status-error">*</span>
            </label>

            {/* Quick search input */}
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[34px] w-full rounded-[6px] border border-border-default px-[10px] text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-brand-1"
            />

            {/* User List */}
            <div className="flex flex-col gap-[2px] rounded-[6px] border border-border-default p-[4px] max-h-[180px] overflow-y-auto mt-[4px]">
              {filteredUsers.length === 0 ? (
                <div className="p-[12px] text-center text-[12px] text-text-tertiary">
                  No matching users found
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedOwner === u.name;
                  const isCurrent = study.owner === u.name;
                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedOwner(u.name);
                        if (error) setError(null);
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
                        {isCurrent && (
                          <span className="text-[10px] px-[5px] py-[1px] rounded bg-black/5 text-text-secondary">
                            Current
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <img src={checkLineIconUrl} alt="" className="h-[14px] w-[14px] shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
            {error && <span className="text-[11px] text-status-error">{error}</span>}
          </div>

          <div className="mt-[24px] flex items-center justify-end gap-[10px]">
            <Button variant="secondary" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              {isStudyOwnerRole ? 'Confirm Transfer' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintainOwnerModal;

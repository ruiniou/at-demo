import React, { useState, useMemo } from 'react';
import { ProjectItem, StudyItem, UserRole } from '../types/management';
import { OwnerAvatar } from './TreeFilterPopover';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/ui/SearchBar';
import { FilterChip } from '../../../components/ui/FilterChip';
import databaseIconUrl from '../../../icons/database-2-line.svg';
import informationIconUrl from '../../../icons/information-line.svg';
import capsuleIconUrl from '../../../icons/capsule-line.svg';
import stackIconUrl from '../../../icons/stack-line.svg';

// Local SVG icons
function ChevronRightTreeIcon({ isExpanded, color = '#888E8E' }: { isExpanded: boolean; color?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-150"
      style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CapsuleIcon({ color = '#888E8E' }: { color?: string }) {
  return (
    <img src={capsuleIconUrl} alt="" className="h-[15px] w-[15px] shrink-0" style={{ filter: color === '#A1A1AA' ? 'grayscale(1) opacity(0.5)' : undefined }} />
  );
}

function StackIcon({ color = '#888E8E' }: { color?: string }) {
  return (
    <img src={stackIconUrl} alt="" className="h-[14px] w-[14px] shrink-0" style={{ filter: color === '#A1A1AA' ? 'grayscale(1) opacity(0.5)' : undefined }} />
  );
}

interface ProjectStudyManagementViewProps {
  currentRole: UserRole;
  currentUserName: string;
  projects: ProjectItem[];
  onOpenNewProject: () => void;
  onOpenNewStudy: (projectId?: string) => void;
  onOpenMaintainOwner: (projectId: string, study: StudyItem) => void;
  onToggleProjectStatus: (projectId: string) => void;
  onToggleStudyStatus: (projectId: string, studyId: string) => void;
}

export const ProjectStudyManagementView: React.FC<ProjectStudyManagementViewProps> = ({
  currentRole,
  currentUserName,
  projects,
  onOpenNewProject,
  onOpenNewStudy,
  onOpenMaintainOwner,
  onToggleProjectStatus,
  onToggleStudyStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [taFilter, setTaFilter] = useState<string>('All');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    () => new Set(projects.map((p) => p.id))
  );

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter projects & studies based on role and filters
  const visibleGroups = useMemo(() => {
    const q = search.trim().toLowerCase();

    return projects
      .map((proj) => {
        // Study Owner data isolation: Only show studies owned by current user
        let relevantStudies = proj.studies;
        if (currentRole === 'owner') {
          relevantStudies = relevantStudies.filter((s) => s.owner === currentUserName);
        }

        // TA filter
        if (taFilter !== 'All') {
          relevantStudies = relevantStudies.filter((s) => s.ta === taFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
          relevantStudies = relevantStudies.filter((s) => {
            const isEffectiveEnabled = proj.status === 'enabled' && s.status === 'enabled';
            return statusFilter === 'enabled' ? isEffectiveEnabled : !isEffectiveEnabled;
          });
        }

        // Search filter
        if (q) {
          const matchProj = proj.name.toLowerCase().includes(q) || proj.id.toLowerCase().includes(q);
          if (!matchProj) {
            relevantStudies = relevantStudies.filter(
              (s) =>
                s.id.toLowerCase().includes(q) ||
                s.owner.toLowerCase().includes(q) ||
                s.ta.toLowerCase().includes(q)
            );
          }
        }

        // If Study Owner role and has no studies in this project, hide the project entirely
        if (currentRole === 'owner' && relevantStudies.length === 0) {
          return null;
        }

        // If Admin search filter and no studies and proj doesn't match, hide
        if (q && relevantStudies.length === 0 && !proj.name.toLowerCase().includes(q)) {
          return null;
        }

        return {
          project: proj,
          studies: relevantStudies,
          totalStudiesInProject: proj.studies.length,
        };
      })
      .filter((g): g is { project: ProjectItem; studies: StudyItem[]; totalStudiesInProject: number } => g !== null);
  }, [projects, currentRole, currentUserName, search, statusFilter, taFilter]);

  const isAdmin = currentRole === 'admin';
  const isStudyOwner = currentRole === 'owner';

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[14px] px-[16px] sm:px-[28px] pt-[20px] pb-[20px] overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-[10px]">
          <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-az-secondary shrink-0">
            <img src={databaseIconUrl} alt="" className="h-[16px] w-[16px]" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-text-primary tracking-tight leading-[28px]">
              Projects &amp; Studies
            </h1>
          </div>
        </div>

        {/* Action Button: Admin only */}
        {isAdmin && (
          <Button
            variant="primary"
            onClick={onOpenNewProject}
            className="gap-[6px] px-[14px] py-[6px] whitespace-nowrap shrink-0"
          >
            <span>+ New Project</span>
          </Button>
        )}
      </div>

      {/* Note Banner for Role awareness */}
      <div className="flex items-start gap-[8px] rounded-[8px] border border-az-secondary-border bg-az-secondary/60 px-[12px] py-[8px] text-[12.5px] text-text-primary shrink-0">
        <img src={informationIconUrl} alt="" className="h-[15px] w-[15px] shrink-0 mt-[1px]" />
        <div className="flex-1">
          {isAdmin ? (
            <span>
              <b>Admin View:</b> View and manage all Projects and Studies. Disabling a Project cascades to all its Studies and restricts new Event creation. Historical Events remain accessible.
            </span>
          ) : (
            <span>
              <b>Study Owner View:</b> Data is strictly isolated to Studies you own, along with their parent Project information (other Studies in the same Project are hidden). You can transfer ownership, but cannot create or disable Projects and Studies.
            </span>
          )}
        </div>
      </div>

      {/* Toolbar: Search + FilterChip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] shrink-0">
        <div className="flex items-center gap-[10px] flex-1 max-w-[620px]">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Project / Study / Owner..."
            background="light"
            className="w-full sm:w-[300px] md:w-[340px] shrink-0"
          />

          <FilterChip
            type="Dropdown"
            variant="filter"
            label={taFilter === 'All' ? 'All TA' : `TA: ${taFilter}`}
            value={taFilter}
            onChange={setTaFilter}
            options={[
              { label: 'All TA', value: 'All' },
              { label: 'Oncology', value: 'Oncology' },
              { label: 'Cardiology', value: 'Cardiology' },
              { label: 'Neurology', value: 'Neurology' },
              { label: 'Immunology', value: 'Immunology' },
            ]}
          />

          <FilterChip
            type="Dropdown"
            variant="filter"
            label={
              statusFilter === 'all'
                ? 'All Status'
                : statusFilter === 'enabled'
                ? 'Enabled'
                : 'Disabled'
            }
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as any)}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Enabled Only', value: 'enabled' },
              { label: 'Disabled Only', value: 'disabled' },
            ]}
          />
        </div>

        <div className="text-[12px] text-text-secondary shrink-0">
          Showing {visibleGroups.reduce((acc, g) => acc + g.studies.length, 0)} studies across{' '}
          {visibleGroups.length} projects
        </div>
      </div>

      {/* Hierarchical Table Container */}
      <div className="flex-1 overflow-auto rounded-[6px] border border-graphite-10 bg-white">
        {visibleGroups.length === 0 ? (
          <div className="flex h-[240px] flex-col items-center justify-center gap-[6px] text-center text-text-muted">
            <img src={databaseIconUrl} alt="" className="h-[28px] w-[28px] opacity-40" />
            <span className="text-[13px] font-medium">No matching projects or studies found</span>
            <span className="text-[12px] text-text-tertiary">
              {isStudyOwner
                ? 'You currently do not own any studies matching this criteria'
                : 'Try adjusting your search or filters'}
            </span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-graphite-10 bg-bg-app text-[12px] font-normal text-text-secondary tracking-normal sticky top-0 z-10">
                <th className="px-[16px] py-[10px] font-normal">Project / Study Name</th>
                <th className="px-[16px] py-[10px] font-normal w-[200px]">Owner</th>
                <th className="px-[16px] py-[10px] font-normal w-[150px]">Status</th>
                <th className="px-[16px] py-[10px] font-normal w-[120px]">Events</th>
                <th className="px-[16px] py-[10px] font-normal text-right w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite-10 text-[13px]">
              {visibleGroups.map(({ project, studies, totalStudiesInProject }) => {
                const isExpanded = expandedProjects.has(project.id);
                const isProjectDisabled = project.status === 'disabled';

                return (
                  <React.Fragment key={project.id}>
                    {/* Level 1: Project Header Row */}
                    <tr
                      onClick={() => toggleProject(project.id)}
                      className="bg-bg-app/80 hover:bg-black/[0.03] cursor-pointer transition-colors select-none group"
                    >
                      {/* Name & Arrow */}
                      <td className="py-[9px] pl-[16px] pr-[16px]">
                        <div className="flex items-center gap-[8px]">
                          <span className="flex h-[16px] w-[16px] items-center justify-center text-text-secondary shrink-0">
                            <ChevronRightTreeIcon isExpanded={isExpanded} color="#888E8E" />
                          </span>
                          <CapsuleIcon color={isProjectDisabled ? '#A1A1AA' : '#888E8E'} />
                          <span
                            className={`text-[13px] font-semibold ${
                              isProjectDisabled ? 'text-text-secondary line-through' : 'text-text-primary'
                            }`}
                          >
                            {project.name}
                          </span>
                          <span className="text-[11px] text-text-tertiary ml-[2px]">
                            ({studies.length}
                            {isStudyOwner && studies.length < totalStudiesInProject
                              ? ` of ${totalStudiesInProject} owned`
                              : ' studies'}
                            )
                          </span>
                        </div>
                      </td>

                      {/* Project Owner: Not applicable in Atlas PRD */}
                      <td className="px-[16px] py-[9px] text-[12px] text-text-tertiary">
                        —
                      </td>

                      {/* Project Status */}
                      <td className="px-[16px] py-[9px]">
                        {isProjectDisabled ? (
                          <span className="inline-flex items-center px-[8px] py-[1px] rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            Disabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-[8px] py-[1px] rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Enabled
                          </span>
                        )}
                      </td>

                      {/* Events column for Project */}
                      <td className="px-[16px] py-[9px] text-[12px] text-text-secondary">
                        {studies.reduce((sum, s) => sum + (s.eventsCount || 0), 0)} events
                      </td>

                      {/* Project Actions */}
                      <td
                        className="px-[16px] py-[9px] text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {isAdmin && (
                          <div className="flex items-center justify-end gap-[10px]">
                            {!isProjectDisabled && (
                              <button
                                type="button"
                                onClick={() => onOpenNewStudy(project.id)}
                                className="text-[12px] font-medium text-brand-1 hover:underline cursor-pointer"
                              >
                                + Add Study
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onToggleProjectStatus(project.id)}
                              className={`text-[12px] font-medium cursor-pointer transition-colors ${
                                isProjectDisabled
                                  ? 'text-emerald-700 hover:text-emerald-800'
                                  : 'text-status-error hover:underline'
                              }`}
                            >
                              {isProjectDisabled ? 'Enable Project' : 'Disable Project'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* Level 2: Studies under Project */}
                    {isExpanded &&
                      studies.map((std) => {
                        const isStudyDisabled = std.status === 'disabled';
                        const isCascadedDisabled = isProjectDisabled;

                        return (
                          <tr
                            key={std.id}
                            className="bg-[#FCFCFC] hover:bg-black/[0.02] transition-colors"
                          >
                            {/* Study Name & TA */}
                            <td className="py-[8px] pl-[44px] pr-[16px]">
                              <div className="flex items-center gap-[8px]">
                                <StackIcon color={isStudyDisabled || isCascadedDisabled ? '#A1A1AA' : '#888E8E'} />
                                <span
                                  className={`text-[13px] font-medium ${
                                    isStudyDisabled || isCascadedDisabled
                                      ? 'text-text-secondary line-through'
                                      : 'text-text-primary'
                                  }`}
                                >
                                  {std.id}
                                </span>
                                <span className="text-[10px] px-[6px] py-[0.5px] rounded-full bg-black/5 text-text-secondary border border-graphite-10">
                                  {std.ta}
                                </span>
                              </div>
                            </td>

                            {/* Study Owner */}
                            <td className="px-[16px] py-[8px]">
                              <div className="flex items-center gap-[6px]">
                                <OwnerAvatar owner={std.owner} size={18} />
                                <span className="text-[13px] text-text-primary font-medium">
                                  {std.owner}
                                </span>
                              </div>
                            </td>

                            {/* Study Status */}
                            <td className="px-[16px] py-[8px]">
                              {isCascadedDisabled ? (
                                <span
                                  className="inline-flex items-center px-[8px] py-[1px] rounded-full text-[11px] font-medium bg-gray-100 text-gray-500 border border-gray-200"
                                  title="Inherited from disabled parent Project"
                                >
                                  Project Disabled
                                </span>
                              ) : isStudyDisabled ? (
                                <span className="inline-flex items-center px-[8px] py-[1px] rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                  Disabled
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-[8px] py-[1px] rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Enabled
                                </span>
                              )}
                            </td>

                            {/* Events Count */}
                            <td className="px-[16px] py-[8px] text-[12px] text-text-secondary">
                              {std.eventsCount || 0} events
                            </td>

                            {/* Study Actions */}
                            <td className="px-[16px] py-[8px] text-right">
                              <div className="flex items-center justify-end gap-[12px]">
                                {/* Maintain / Transfer Owner */}
                                {(isAdmin || (isStudyOwner && std.owner === currentUserName)) && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenMaintainOwner(project.id, std)}
                                    className="text-[12px] font-medium text-text-secondary hover:text-brand-1 cursor-pointer transition-colors"
                                  >
                                    {isStudyOwner ? 'Transfer Owner' : 'Maintain Owner'}
                                  </button>
                                )}

                                {/* Disable/Enable Study (Admin only; hidden if Project is disabled per PRD) */}
                                {isAdmin && !isCascadedDisabled && (
                                  <button
                                    type="button"
                                    onClick={() => onToggleStudyStatus(project.id, std.id)}
                                    className={`text-[12px] font-medium cursor-pointer transition-colors ${
                                      isStudyDisabled
                                        ? 'text-emerald-700 hover:text-emerald-800'
                                        : 'text-status-error hover:underline'
                                    }`}
                                  >
                                    {isStudyDisabled ? 'Enable' : 'Disable'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProjectStudyManagementView;

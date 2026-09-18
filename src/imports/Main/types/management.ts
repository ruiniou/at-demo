export type StatusType = 'enabled' | 'disabled';

export type UserRole = 'admin' | 'owner' | 'member';

export interface StudyItem {
  id: string;
  name?: string;
  ta: string;
  owner: string; // user name matching MOCK_USER_POOL
  status: StatusType;
  eventsCount?: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  status: StatusType;
  studies: StudyItem[];
}

export interface SystemUser {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
}

export const SYSTEM_USERS: SystemUser[] = [
  { id: 'u_sarah', name: 'Sarah Chen', initials: 'SC', color: '#f0ab00', email: 'sarah.chen@taimei.com' },
  { id: 'u_tom', name: 'Tom Chen', initials: 'TC', color: '#0077b6', email: 'tom.chen@taimei.com' },
  { id: 'u_james', name: 'James Park', initials: 'JP', color: '#830051', email: 'james.park@taimei.com' },
  { id: 'u_priya', name: 'Priya Sharma', initials: 'PS', color: '#d0006f', email: 'priya.sharma@taimei.com' },
  { id: 'u_alex', name: 'Alex Kim', initials: 'AK', color: '#7c8db0', email: 'alex.kim@taimei.com' },
  { id: 'u_emily', name: 'Emily Liu', initials: 'EL', color: '#2d6a4f', email: 'emily.liu@taimei.com' },
];

export const TA_OPTIONS = [
  'Oncology',
  'Cardiology',
  'Neurology',
  'Immunology',
  'Infectious Disease',
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'PRO001',
    name: 'PRO001',
    status: 'enabled',
    studies: [
      { id: 'AZE2001-301', ta: 'Oncology', owner: 'Tom Chen', status: 'enabled', eventsCount: 5 },
      { id: 'AZE2001-302', ta: 'Oncology', owner: 'Sarah Chen', status: 'enabled', eventsCount: 2 },
      { id: 'AZE2001-303', ta: 'Oncology', owner: 'James Park', status: 'enabled', eventsCount: 1 },
    ],
  },
  {
    id: 'PRO002',
    name: 'PRO002',
    status: 'enabled',
    studies: [
      { id: 'CVD3001-201', ta: 'Cardiology', owner: 'Alex Kim', status: 'enabled', eventsCount: 2 },
      { id: 'CVD3002-110', ta: 'Neurology', owner: 'Emily Liu', status: 'disabled', eventsCount: 1 },
    ],
  },
  {
    id: 'PRO003',
    name: 'PRO003',
    status: 'enabled',
    studies: [
      { id: 'AZE2001-401', ta: 'Oncology', owner: 'Emily Liu', status: 'enabled', eventsCount: 1 },
    ],
  },
  {
    id: 'PRO004',
    name: 'PRO004',
    status: 'disabled',
    studies: [
      { id: 'AZE2001-402', ta: 'Immunology', owner: 'Sarah Chen', status: 'enabled', eventsCount: 1 },
    ],
  },
];

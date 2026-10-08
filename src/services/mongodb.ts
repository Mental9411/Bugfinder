// =====================================================
// MONGODB SERVICE LAYER (Simulated with localStorage)
// In production, replace with actual MongoDB/Mongoose calls
// =====================================================

import { User, Program, BugReport, Comment, PlatformStats, UserRole } from '../types';

const genId = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);

const KEYS = {
  users: 'bb_users',
  programs: 'bb_programs',
  reports: 'bb_reports',
  session: 'bb_session',
  init: 'bb_init',
};

function read<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ==================== SEED DATA ====================
const seedUsers: User[] = [
  { _id: 'admin_001', username: 'admin', email: 'admin@bugbounty.com', password: 'admin123', role: 'admin', bio: 'Platform administrator', reputation: 999, isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { _id: 'comp_001', username: 'TechCorp', email: 'security@techcorp.com', password: 'company123', role: 'company', bio: 'Leading tech company committed to security.', reputation: 0, isActive: true, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { _id: 'comp_002', username: 'SecureBank', email: 'security@securebank.com', password: 'bank123', role: 'company', bio: 'Financial institution with top-tier security.', reputation: 0, isActive: true, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z' },
  { _id: 'hack_001', username: 'security_ninja', email: 'ninja@hacker.com', password: 'hacker123', role: 'hacker', bio: 'Full-stack security researcher, 5+ years experience.', reputation: 850, isActive: true, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-20T00:00:00Z' },
  { _id: 'hack_002', username: 'bug_hunter', email: 'hunter@hacker.com', password: 'hunter123', role: 'hacker', bio: 'Specializing in web application security.', reputation: 620, isActive: true, createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-02-10T00:00:00Z' },
];

const seedPrograms: Program[] = [
  { _id: 'prog_001', companyId: 'comp_001', companyName: 'TechCorp', title: 'TechCorp Web Application Security', description: 'Help us find vulnerabilities in our main web application and APIs. We value all security researchers who help make our platform safer.', scope: ['*.techcorp.com', 'api.techcorp.com', 'app.techcorp.com', 'auth.techcorp.com'], outOfScope: ['Third-party integrations', 'Physical security', 'Social engineering'], rewards: { critical: '$5,000 - $15,000', high: '$2,000 - $5,000', medium: '$500 - $2,000', low: '$100 - $500' }, status: 'active', submissionCount: 45, createdAt: '2024-01-20T00:00:00Z', updatedAt: '2024-01-20T00:00:00Z' },
  { _id: 'prog_002', companyId: 'comp_002', companyName: 'SecureBank', title: 'SecureBank Mobile & API Security', description: 'We are looking for researchers to test our mobile banking application and backend APIs. Critical vulnerabilities are rewarded generously.', scope: ['mobile.securebank.com', 'api.securebank.com', 'SecureBank iOS App', 'SecureBank Android App'], outOfScope: ['ATM locations', 'Branch security', 'Employee phishing'], rewards: { critical: '$10,000 - $25,000', high: '$5,000 - $10,000', medium: '$1,000 - $5,000', low: '$200 - $1,000' }, status: 'active', submissionCount: 28, createdAt: '2024-02-05T00:00:00Z', updatedAt: '2024-02-05T00:00:00Z' },
  { _id: 'prog_003', companyId: 'comp_001', companyName: 'TechCorp', title: 'TechCorp IoT Device Security', description: 'Test our new line of IoT devices for security vulnerabilities. Focus on firmware, API, and network communications.', scope: ['SmartHub Device', 'IoT Cloud Platform', 'Device Management Portal'], outOfScope: ['Physical device tampering', 'Supply chain attacks'], rewards: { critical: '$8,000 - $20,000', high: '$3,000 - $8,000', medium: '$800 - $3,000', low: '$150 - $800' }, status: 'active', submissionCount: 12, createdAt: '2024-02-15T00:00:00Z', updatedAt: '2024-02-15T00:00:00Z' },
];

const seedReports: BugReport[] = [
  { _id: 'rpt_001', programId: 'prog_001', programTitle: 'TechCorp Web Application Security', hackerId: 'hack_001', hackerUsername: 'security_ninja', title: 'SQL Injection in User Search Function', description: 'The user search functionality is vulnerable to SQL injection attacks through the search parameter.', stepsToReproduce: '1. Navigate to /users/search\n2. Enter payload: \' OR 1=1 --\n3. Observe all users returned', impact: 'An attacker can extract sensitive user data including emails and personal information.', severity: 'critical', status: 'resolved', reward: 8000, rewardPaid: true, comments: [{ _id: 'cmt_001', userId: 'comp_001', username: 'TechCorp', userRole: 'company', content: 'Thank you for this critical finding. We have patched this vulnerability.', createdAt: '2024-02-03T09:00:00Z' }], createdAt: '2024-02-01T10:30:00Z', updatedAt: '2024-02-05T14:20:00Z' },
  { _id: 'rpt_002', programId: 'prog_001', programTitle: 'TechCorp Web Application Security', hackerId: 'hack_002', hackerUsername: 'bug_hunter', title: 'Stored XSS in Comment Section', description: 'Stored XSS vulnerability in the comment section allows execution of arbitrary JavaScript.', stepsToReproduce: '1. Go to any blog post\n2. Add comment with script tag\n3. View the post to trigger XSS', impact: 'Session hijacking, cookie theft, and potential account takeover.', severity: 'high', status: 'under_review', reward: 0, rewardPaid: false, comments: [], createdAt: '2024-02-10T15:45:00Z', updatedAt: '2024-02-10T15:45:00Z' },
  { _id: 'rpt_003', programId: 'prog_002', programTitle: 'SecureBank Mobile & API Security', hackerId: 'hack_001', hackerUsername: 'security_ninja', title: 'Insecure Direct Object Reference in Account API', description: 'The account API endpoint allows access to other users account information by changing the account ID parameter.', stepsToReproduce: '1. Login to mobile app\n2. Intercept API call to /api/accounts/{id}\n3. Change ID to another users ID\n4. Observe unauthorized data access', impact: 'Unauthorized access to sensitive financial information of other users.', severity: 'critical', status: 'pending', reward: 0, rewardPaid: false, comments: [], createdAt: '2024-02-15T08:20:00Z', updatedAt: '2024-02-15T08:20:00Z' },
  { _id: 'rpt_004', programId: 'prog_002', programTitle: 'SecureBank Mobile & API Security', hackerId: 'hack_002', hackerUsername: 'bug_hunter', title: 'Missing Rate Limiting on Login Endpoint', description: 'The login endpoint does not implement rate limiting, allowing brute force attacks.', stepsToReproduce: '1. Send multiple login requests with wrong password\n2. Observe no lockout or rate limiting\n3. Can attempt unlimited logins', impact: 'Enables brute force attacks against user accounts.', severity: 'medium', status: 'resolved', reward: 1500, rewardPaid: false, comments: [{ _id: 'cmt_002', userId: 'comp_002', username: 'SecureBank', userRole: 'company', content: 'Fixed. We implemented rate limiting and account lockout after 5 failed attempts.', createdAt: '2024-02-12T16:30:00Z' }], createdAt: '2024-02-08T11:00:00Z', updatedAt: '2024-02-12T16:30:00Z' },
  { _id: 'rpt_005', programId: 'prog_003', programTitle: 'TechCorp IoT Device Security', hackerId: 'hack_001', hackerUsername: 'security_ninja', title: 'Hardcoded Credentials in Firmware', description: 'The device firmware contains hardcoded credentials for the cloud API.', stepsToReproduce: '1. Download firmware update\n2. Extract and analyze binary\n3. Find embedded API keys and credentials', impact: 'Full compromise of cloud infrastructure if firmware is obtained.', severity: 'high', status: 'pending', reward: 0, rewardPaid: false, comments: [], createdAt: '2024-02-18T14:00:00Z', updatedAt: '2024-02-18T14:00:00Z' },
];

// ==================== INIT ====================
export function initDB() {
  if (!localStorage.getItem(KEYS.init)) {
    write(KEYS.users, seedUsers);
    write(KEYS.programs, seedPrograms);
    write(KEYS.reports, seedReports);
    localStorage.setItem(KEYS.init, 'true');
  }
}

// ==================== USER COLLECTION ====================
export const UserDB = {
  findAll: (): User[] => read<User>(KEYS.users),
  findById: (_id: string): User | undefined => read<User>(KEYS.users).find(u => u._id === _id),
  findByEmail: (email: string): User | undefined => read<User>(KEYS.users).find(u => u.email.toLowerCase() === email.toLowerCase()),
  findByUsername: (username: string): User | undefined => read<User>(KEYS.users).find(u => u.username.toLowerCase() === username.toLowerCase()),
  findByRole: (role: UserRole): User[] => read<User>(KEYS.users).filter(u => u.role === role),

  create: (data: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): User => {
    const users = read<User>(KEYS.users);
    const doc: User = { ...data, _id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    users.push(doc);
    write(KEYS.users, users);
    return doc;
  },

  update: (_id: string, data: Partial<User>): void => {
    const users = read<User>(KEYS.users);
    const idx = users.findIndex(u => u._id === _id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...data, updatedAt: new Date().toISOString() }; write(KEYS.users, users); }
  },

  delete: (_id: string): void => {
    write(KEYS.users, read<User>(KEYS.users).filter(u => u._id !== _id));
  },
};

// ==================== PROGRAM COLLECTION ====================
export const ProgramDB = {
  findAll: (): Program[] => read<Program>(KEYS.programs),
  findById: (_id: string): Program | undefined => read<Program>(KEYS.programs).find(p => p._id === _id),
  findByCompany: (companyId: string): Program[] => read<Program>(KEYS.programs).filter(p => p.companyId === companyId),
  findActive: (): Program[] => read<Program>(KEYS.programs).filter(p => p.status === 'active'),

  create: (data: Omit<Program, '_id' | 'createdAt' | 'updatedAt' | 'submissionCount'>): Program => {
    const programs = read<Program>(KEYS.programs);
    const doc: Program = { ...data, _id: genId(), submissionCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    programs.push(doc);
    write(KEYS.programs, programs);
    return doc;
  },

  update: (_id: string, data: Partial<Program>): void => {
    const programs = read<Program>(KEYS.programs);
    const idx = programs.findIndex(p => p._id === _id);
    if (idx !== -1) { programs[idx] = { ...programs[idx], ...data, updatedAt: new Date().toISOString() }; write(KEYS.programs, programs); }
  },

  delete: (_id: string): void => {
    write(KEYS.programs, read<Program>(KEYS.programs).filter(p => p._id !== _id));
  },
};

// ==================== REPORT COLLECTION ====================
export const ReportDB = {
  findAll: (): BugReport[] => read<BugReport>(KEYS.reports),
  findById: (_id: string): BugReport | undefined => read<BugReport>(KEYS.reports).find(r => r._id === _id),
  findByHacker: (hackerId: string): BugReport[] => read<BugReport>(KEYS.reports).filter(r => r.hackerId === hackerId),
  findByProgram: (programId: string): BugReport[] => read<BugReport>(KEYS.reports).filter(r => r.programId === programId),

  findByCompany: (companyId: string): BugReport[] => {
    const programIds = ProgramDB.findByCompany(companyId).map(p => p._id);
    return read<BugReport>(KEYS.reports).filter(r => programIds.includes(r.programId));
  },

  create: (data: Omit<BugReport, '_id' | 'createdAt' | 'updatedAt' | 'comments' | 'rewardPaid' | 'reward'>): BugReport => {
    const reports = read<BugReport>(KEYS.reports);
    const doc: BugReport = { ...data, _id: genId(), reward: 0, rewardPaid: false, comments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    reports.push(doc);
    write(KEYS.reports, reports);
    // Increment program submission count
    const programs = read<Program>(KEYS.programs);
    const pIdx = programs.findIndex(p => p._id === data.programId);
    if (pIdx !== -1) { programs[pIdx].submissionCount += 1; write(KEYS.programs, programs); }
    return doc;
  },

  update: (_id: string, data: Partial<BugReport>): void => {
    const reports = read<BugReport>(KEYS.reports);
    const idx = reports.findIndex(r => r._id === _id);
    if (idx !== -1) { reports[idx] = { ...reports[idx], ...data, updatedAt: new Date().toISOString() }; write(KEYS.reports, reports); }
  },

  delete: (_id: string): void => {
    write(KEYS.reports, read<BugReport>(KEYS.reports).filter(r => r._id !== _id));
  },

  addComment: (reportId: string, comment: Omit<Comment, '_id'>): void => {
    const reports = read<BugReport>(KEYS.reports);
    const idx = reports.findIndex(r => r._id === reportId);
    if (idx !== -1) {
      reports[idx].comments.push({ ...comment, _id: genId() });
      reports[idx].updatedAt = new Date().toISOString();
      write(KEYS.reports, reports);
    }
  },
};

// ==================== SESSION MANAGEMENT ====================
export const SessionDB = {
  get: (): User | null => {
    try { const d = localStorage.getItem(KEYS.session); return d ? JSON.parse(d) : null; } catch { return null; }
  },
  set: (user: User | null) => {
    if (user) localStorage.setItem(KEYS.session, JSON.stringify(user));
    else localStorage.removeItem(KEYS.session);
  },
};

// ==================== AGGREGATION / STATS ====================
export function getPlatformStats(): PlatformStats {
  const users = UserDB.findAll();
  const programs = ProgramDB.findAll();
  const reports = ReportDB.findAll();
  return {
    totalUsers: users.length,
    totalHackers: users.filter(u => u.role === 'hacker').length,
    totalCompanies: users.filter(u => u.role === 'company').length,
    totalPrograms: programs.length,
    activePrograms: programs.filter(p => p.status === 'active').length,
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    resolvedReports: reports.filter(r => r.status === 'resolved').length,
    totalRewardsPaid: reports.reduce((s, r) => s + (r.rewardPaid ? r.reward : 0), 0),
  };
}

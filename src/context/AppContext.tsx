import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Program, BugReport, ReportStatus, PlatformStats } from '../types';
import { initDB, UserDB, ProgramDB, ReportDB, SessionDB, getPlatformStats } from '../services/mongodb';

interface AppCtx {
  user: User | null;
  users: User[];
  programs: Program[];
  reports: BugReport[];
  stats: PlatformStats;
  isLoggedIn: boolean;
  login: (email: string, pw: string) => { ok: boolean; msg: string };
  register: (username: string, email: string, pw: string, role: 'hacker' | 'company') => { ok: boolean; msg: string };
  logout: () => void;
  refresh: () => void;
  // User ops
  toggleUserActive: (id: string, active: boolean) => void;
  removeUser: (id: string) => void;
  // Program ops
  createProgram: (data: Omit<Program, '_id' | 'createdAt' | 'updatedAt' | 'submissionCount'>) => void;
  updateProgram: (id: string, data: Partial<Program>) => void;
  removeProgram: (id: string) => void;
  // Report ops
  submitReport: (data: Omit<BugReport, '_id' | 'createdAt' | 'updatedAt' | 'comments' | 'rewardPaid' | 'reward'>) => void;
  updateReport: (id: string, data: Partial<BugReport>) => void;
  removeReport: (id: string) => void;
  setReportStatus: (id: string, status: ReportStatus) => void;
  setReward: (id: string, amount: number) => void;
  addComment: (reportId: string, content: string) => void;
  // Helpers
  hackerReports: () => BugReport[];
  companyPrograms: () => Program[];
  companyReports: () => BugReport[];
}

const Ctx = createContext<AppCtx | null>(null);
export const useApp = () => { const c = useContext(Ctx); if (!c) throw new Error('useApp outside provider'); return c; };

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [reports, setReports] = useState<BugReport[]>([]);
  const [stats, setStats] = useState<PlatformStats>({ totalUsers: 0, totalHackers: 0, totalCompanies: 0, totalPrograms: 0, activePrograms: 0, totalReports: 0, pendingReports: 0, resolvedReports: 0, totalRewardsPaid: 0 });

  const refresh = () => {
    setUsers(UserDB.findAll());
    setPrograms(ProgramDB.findAll());
    setReports(ReportDB.findAll());
    setStats(getPlatformStats());
  };

  useEffect(() => {
    initDB();
    const s = SessionDB.get();
    if (s) {
      const fresh = UserDB.findById(s._id);
      if (fresh && fresh.isActive) setUser(fresh); else SessionDB.set(null);
    }
    refresh();
  }, []);

  const login = (email: string, pw: string) => {
    const u = UserDB.findByEmail(email);
    if (!u) return { ok: false, msg: 'User not found.' };
    if (u.password !== pw) return { ok: false, msg: 'Invalid password.' };
    if (!u.isActive) return { ok: false, msg: 'Account deactivated.' };
    SessionDB.set(u); setUser(u); refresh();
    return { ok: true, msg: 'Login successful!' };
  };

  const register = (username: string, email: string, pw: string, role: 'hacker' | 'company') => {
    if (UserDB.findByEmail(email)) return { ok: false, msg: 'Email already registered.' };
    if (UserDB.findByUsername(username)) return { ok: false, msg: 'Username already taken.' };
    const u = UserDB.create({ username, email, password: pw, role, bio: '', reputation: role === 'hacker' ? 0 : 0, isActive: true });
    SessionDB.set(u); setUser(u); refresh();
    return { ok: true, msg: 'Registration successful!' };
  };

  const logout = () => { SessionDB.set(null); setUser(null); };

  const toggleUserActive = (id: string, active: boolean) => { UserDB.update(id, { isActive: active }); refresh(); };
  const removeUser = (id: string) => { UserDB.delete(id); refresh(); };

  const createProgram = (data: Omit<Program, '_id' | 'createdAt' | 'updatedAt' | 'submissionCount'>) => { ProgramDB.create(data); refresh(); };
  const updateProgram = (id: string, data: Partial<Program>) => { ProgramDB.update(id, data); refresh(); };
  const removeProgram = (id: string) => { ProgramDB.delete(id); refresh(); };

  const submitReport = (data: Omit<BugReport, '_id' | 'createdAt' | 'updatedAt' | 'comments' | 'rewardPaid' | 'reward'>) => { ReportDB.create(data); refresh(); };
  const updateReport = (id: string, data: Partial<BugReport>) => { ReportDB.update(id, data); refresh(); };
  const removeReport = (id: string) => { ReportDB.delete(id); refresh(); };
  const setReportStatus = (id: string, status: ReportStatus) => { ReportDB.update(id, { status }); refresh(); };
  const setReward = (id: string, amount: number) => { ReportDB.update(id, { reward: amount }); refresh(); };

  const addComment = (reportId: string, content: string) => {
    if (!user) return;
    ReportDB.addComment(reportId, { userId: user._id, username: user.username, userRole: user.role, content, createdAt: new Date().toISOString() });
    refresh();
  };

  const hackerReports = () => user ? ReportDB.findByHacker(user._id) : [];
  const companyPrograms = () => user ? ProgramDB.findByCompany(user._id) : [];
  const companyReports = () => user ? ReportDB.findByCompany(user._id) : [];

  return (
    <Ctx.Provider value={{
      user, users, programs, reports, stats, isLoggedIn: !!user,
      login, register, logout, refresh,
      toggleUserActive, removeUser,
      createProgram, updateProgram, removeProgram,
      submitReport, updateReport, removeReport, setReportStatus, setReward, addComment,
      hackerReports, companyPrograms, companyReports,
    }}>
      {children}
    </Ctx.Provider>
  );
}

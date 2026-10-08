// =====================================================
// BUG BOUNTY PRO - TYPE DEFINITIONS
// Mirrors MongoDB document schemas
// =====================================================

export type UserRole = 'hacker' | 'company' | 'admin';
export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'rejected';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ProgramStatus = 'draft' | 'active' | 'paused' | 'closed';

// MongoDB-style User document
export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  bio: string;
  reputation: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// MongoDB-style Program document
export interface Program {
  _id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  scope: string[];
  outOfScope: string[];
  rewards: Record<Severity, string>;
  status: ProgramStatus;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

// MongoDB-style BugReport document
export interface BugReport {
  _id: string;
  programId: string;
  programTitle: string;
  hackerId: string;
  hackerUsername: string;
  title: string;
  description: string;
  stepsToReproduce: string;
  impact: string;
  severity: Severity;
  status: ReportStatus;
  reward: number;
  rewardPaid: boolean;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

// Embedded comment sub-document
export interface Comment {
  _id: string;
  userId: string;
  username: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
}

// Dashboard statistics aggregation
export interface PlatformStats {
  totalUsers: number;
  totalHackers: number;
  totalCompanies: number;
  totalPrograms: number;
  activePrograms: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  totalRewardsPaid: number;
}

import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import { LoginPage, RegisterPage } from './components/Auth';
import { HackerDashboard, CompanyDashboard, AdminDashboard } from './components/Dashboards';
import { ProgramList, CreateProgram, ProgramDetail } from './components/Programs';
import { SubmitBug, ReportList, ReportDetail } from './components/Reports';
import { AdminUsers, AdminPrograms, AdminReports } from './components/Admin';
import { Program, BugReport } from './types';

function Landing({ nav }: { nav: (p: string) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-2xl shadow-emerald-500/25 mb-8">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">BugBounty <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Pro</span></h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">The premier platform connecting security researchers with organizations. Find vulnerabilities, earn rewards, and make the digital world safer.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => nav('register')} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:-translate-y-1">🚀 Start Hunting</button>
              <button onClick={() => nav('programs')} className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-1">🔍 Browse Programs</button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16"><h2 className="text-3xl font-bold text-white mb-4">Why BugBounty Pro?</h2><p className="text-slate-400 max-w-2xl mx-auto">A comprehensive platform for security researchers and organizations.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ i: '🛡️', t: 'For Researchers', d: 'Find vulnerabilities in real-world applications and earn competitive rewards.', c: 'emerald' }, { i: '🏢', t: 'For Companies', d: 'Launch bug bounty programs and leverage the security community.', c: 'purple' }, { i: '💰', t: 'Secure Rewards', d: 'Transparent reward system with clear severity classifications.', c: 'cyan' }].map(f => (
            <div key={f.t} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
              <div className={`w-14 h-14 bg-${f.c}-500/20 rounded-xl flex items-center justify-center mb-6`}><span className="text-3xl">{f.i}</span></div>
              <h3 className="text-xl font-semibold text-white mb-3">{f.t}</h3>
              <p className="text-slate-400">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-800/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[{ v: '500+', l: 'Researchers' }, { v: '100+', l: 'Programs' }, { v: '$2M+', l: 'Rewards Paid' }, { v: '10K+', l: 'Bugs Found' }].map(s => (
              <div key={s.l}><div className="text-4xl font-bold text-emerald-400 mb-2">{s.v}</div><div className="text-slate-400">{s.l}</div></div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-3xl p-12 text-center border border-emerald-500/30">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Join thousands of security researchers making the internet safer.</p>
          <button onClick={() => nav('register')} className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">Create Free Account</button>
        </div>
      </div>
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
            <span className="text-xl font-bold text-white">BugBounty Pro</span>
          </div>
          <div className="text-slate-500 text-sm">© 2024 BugBounty Pro. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

function AppContent() {
  const { user, isLoggedIn } = useApp();
  const [page, setPage] = useState('home');
  const [data, setData] = useState<any>(null);

  const nav = (p: string, d?: any) => { setPage(p); setData(d || null); window.scrollTo(0, 0); };

  useEffect(() => {
    if (isLoggedIn && (page === 'login' || page === 'register' || page === 'home')) {
      setPage(user?.role === 'admin' ? 'admin-dash' : user?.role === 'company' ? 'company-dash' : 'hacker-dash');
    }
  }, [isLoggedIn, user]);

  const render = () => {
    if (!isLoggedIn) {
      switch (page) {
        case 'login': return <LoginPage nav={nav} />;
        case 'register': return <RegisterPage nav={nav} />;
        case 'programs': return <ProgramList nav={nav} />;
        case 'program-detail': return data ? <ProgramDetail program={data as Program} nav={nav} /> : <ProgramList nav={nav} />;
        default: return <Landing nav={nav} />;
      }
    }
    switch (user?.role) {
      case 'admin':
        switch (page) {
          case 'admin-users': return <AdminUsers nav={nav} />;
          case 'admin-programs': return <AdminPrograms nav={nav} />;
          case 'admin-reports': return <AdminReports nav={nav} />;
          case 'report-detail': return data ? <ReportDetail report={data as BugReport} nav={nav} /> : <AdminDashboard nav={nav} />;
          case 'program-detail': return data ? <ProgramDetail program={data as Program} nav={nav} /> : <AdminDashboard nav={nav} />;
          default: return <AdminDashboard nav={nav} />;
        }
      case 'company':
        switch (page) {
          case 'company-programs': return <ProgramList nav={nav} company />;
          case 'create-program': return <CreateProgram nav={nav} />;
          case 'company-reports': return <ReportList nav={nav} filter="company" />;
          case 'program-detail': return data ? <ProgramDetail program={data as Program} nav={nav} /> : <CompanyDashboard nav={nav} />;
          case 'report-detail': return data ? <ReportDetail report={data as BugReport} nav={nav} /> : <CompanyDashboard nav={nav} />;
          default: return <CompanyDashboard nav={nav} />;
        }
      default:
        switch (page) {
          case 'programs': return <ProgramList nav={nav} />;
          case 'my-reports': return <ReportList nav={nav} filter="hacker" />;
          case 'submit-bug': return <SubmitBug nav={nav} preselect={data as Program | undefined} />;
          case 'program-detail': return data ? <ProgramDetail program={data as Program} nav={nav} /> : <HackerDashboard nav={nav} />;
          case 'report-detail': return data ? <ReportDetail report={data as BugReport} nav={nav} /> : <HackerDashboard nav={nav} />;
          default: return <HackerDashboard nav={nav} />;
        }
    }
  };

  const noNav = ['login', 'register'];
  const showNav = !noNav.includes(page) || isLoggedIn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {showNav && <Navbar page={page} nav={nav} />}
      <main>{render()}</main>
    </div>
  );
}

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}

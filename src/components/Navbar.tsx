import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar({ page, nav }: { page: string; nav: (p: string) => void }) {
  const { user, isLoggedIn, logout } = useApp();
  const [mob, setMob] = useState(false);
  const [prof, setProf] = useState(false);

  const items = () => {
    if (!isLoggedIn) return [
      { id: 'programs', label: 'Programs', icon: '🔍' },
      { id: 'login', label: 'Login', icon: '🔑' },
      { id: 'register', label: 'Register', icon: '📝' },
    ];
    switch (user?.role) {
      case 'admin': return [
        { id: 'admin-dash', label: 'Dashboard', icon: '📊' },
        { id: 'admin-users', label: 'Users', icon: '👥' },
        { id: 'admin-programs', label: 'Programs', icon: '📋' },
        { id: 'admin-reports', label: 'Reports', icon: '🐛' },
      ];
      case 'company': return [
        { id: 'company-dash', label: 'Dashboard', icon: '📊' },
        { id: 'company-programs', label: 'Programs', icon: '📋' },
        { id: 'create-program', label: 'New Program', icon: '➕' },
        { id: 'company-reports', label: 'Reports', icon: '🐛' },
      ];
      default: return [
        { id: 'hacker-dash', label: 'Dashboard', icon: '📊' },
        { id: 'programs', label: 'Browse', icon: '🔍' },
        { id: 'my-reports', label: 'My Reports', icon: '🐛' },
        { id: 'submit-bug', label: 'Submit Bug', icon: '➕' },
      ];
    }
  };

  const doLogout = () => { logout(); nav('home'); setProf(false); };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => nav(isLoggedIn ? `${user?.role}-dash` : 'home')} className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">BugBounty Pro</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {items().map(i => (
              <button key={i.id} onClick={() => nav(i.id)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === i.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <span className="mr-1.5">{i.icon}</span>{i.label}
              </button>
            ))}
          </div>

          {isLoggedIn && (
            <div className="hidden md:block relative">
              <button onClick={() => setProf(!prof)} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-all">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">{user?.username[0].toUpperCase()}</div>
                <div className="text-left"><div className="text-sm font-medium text-white">{user?.username}</div><div className="text-xs text-slate-400 capitalize">{user?.role}</div></div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${prof ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {prof && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-700"><div className="text-xs text-slate-400">Signed in as</div><div className="text-sm text-white truncate">{user?.email}</div></div>
                  <button onClick={doLogout} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors">🚪 Sign Out</button>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setMob(!mob)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mob ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {mob && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 space-y-1">
          {items().map(i => (
            <button key={i.id} onClick={() => { nav(i.id); setMob(false); }} className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all ${page === i.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-700'}`}>
              <span className="mr-3">{i.icon}</span>{i.label}
            </button>
          ))}
          {isLoggedIn && <button onClick={doLogout} className="w-full px-4 py-3 rounded-lg text-left font-medium text-red-400 hover:bg-red-500/10">🚪 Sign Out</button>}
        </div>
      )}
    </nav>
  );
}

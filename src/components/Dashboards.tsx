import { useApp } from '../context/AppContext';
import { BugReport } from '../types';

const sevColor = (s: string) => s === 'critical' ? 'bg-red-500/20 text-red-400' : s === 'high' ? 'bg-orange-500/20 text-orange-400' : s === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400';
const statColor = (s: string) => s === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : s === 'under_review' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : s === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';

function ReportRow({ r, onClick }: { r: BugReport; onClick: () => void }) {
  return (
    <div onClick={onClick} className="p-4 hover:bg-slate-700/30 cursor-pointer transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-white font-medium truncate">{r.title}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${sevColor(r.severity)}`}>{r.severity}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>{r.programTitle}</span><span>•</span><span>{new Date(r.createdAt).toLocaleDateString()}</span>
            {r.reward > 0 && <><span>•</span><span className="text-emerald-400 font-medium">${r.reward.toLocaleString()}</span></>}
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${statColor(r.status)}`}>{r.status.replace('_', ' ')}</span>
      </div>
    </div>
  );
}

export function HackerDashboard({ nav }: { nav: (p: string, d?: any) => void }) {
  const { user, hackerReports, programs } = useApp();
  const mine = hackerReports();
  const pend = mine.filter(r => r.status === 'pending').length;
  const review = mine.filter(r => r.status === 'under_review').length;
  const done = mine.filter(r => r.status === 'resolved').length;
  const earned = mine.reduce((s, r) => s + r.reward, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.username}! 👋</h1><p className="text-slate-400">Your security research activity overview.</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[{ l: 'Pending', v: pend, i: '⏳', c: 'bg-yellow-500/20' }, { l: 'Under Review', v: review, i: '🔍', c: 'bg-blue-500/20' }, { l: 'Resolved', v: done, i: '✅', c: 'bg-emerald-500/20' }, { l: 'Earned', v: `$${earned.toLocaleString()}`, i: '💰', c: 'bg-emerald-500/30', g: true }].map(s => (
          <div key={s.l} className={`${s.g ? 'bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700/50'} rounded-2xl p-6 border`}>
            <div className="flex items-center justify-between mb-4"><div className={`w-12 h-12 ${s.c} rounded-xl flex items-center justify-center`}><span className="text-2xl">{s.i}</span></div></div>
            <div className={`text-3xl font-bold mb-1 ${s.g ? 'text-emerald-400' : 'text-white'}`}>{s.v}</div>
            <div className="text-sm text-slate-400">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <button onClick={() => nav('submit-bug')} className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 hover:from-emerald-600/30 hover:to-cyan-600/30 rounded-2xl p-6 border border-emerald-500/30 text-left transition-all group">
          <div className="flex items-center gap-4"><div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-3xl">🐛</span></div><div><h3 className="text-lg font-semibold text-white">Submit New Bug</h3><p className="text-sm text-slate-400">Report a vulnerability</p></div></div>
        </button>
        <button onClick={() => nav('programs')} className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 rounded-2xl p-6 border border-purple-500/30 text-left transition-all group">
          <div className="flex items-center gap-4"><div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-3xl">🔍</span></div><div><h3 className="text-lg font-semibold text-white">Browse Programs</h3><p className="text-sm text-slate-400">{programs.filter(p => p.status === 'active').length} active bounties</p></div></div>
        </button>
        <button onClick={() => nav('my-reports')} className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 rounded-2xl p-6 border border-blue-500/30 text-left transition-all group">
          <div className="flex items-center gap-4"><div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-3xl">📋</span></div><div><h3 className="text-lg font-semibold text-white">All Reports</h3><p className="text-sm text-slate-400">{mine.length} submissions</p></div></div>
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Submissions</h2>
          <button onClick={() => nav('my-reports')} className="text-sm text-emerald-400 hover:text-emerald-300">View All →</button>
        </div>
        {mine.length === 0 ? (
          <div className="p-12 text-center"><div className="text-3xl mb-4">🔍</div><h3 className="text-lg font-medium text-white mb-2">No submissions yet</h3><p className="text-slate-400 mb-4">Start by browsing programs!</p><button onClick={() => nav('programs')} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">Browse Programs</button></div>
        ) : <div className="divide-y divide-slate-700/50">{mine.slice(0, 5).map(r => <ReportRow key={r._id} r={r} onClick={() => nav('report-detail', r)} />)}</div>}
      </div>
    </div>
  );
}

export function CompanyDashboard({ nav }: { nav: (p: string, d?: any) => void }) {
  const { user, companyPrograms, companyReports } = useApp();
  const progs = companyPrograms();
  const reps = companyReports();
  const active = progs.filter(p => p.status === 'active').length;
  const pend = reps.filter(r => r.status === 'pending').length;
  const done = reps.filter(r => r.status === 'resolved').length;
  const paid = reps.filter(r => r.rewardPaid).reduce((s, r) => s + r.reward, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.username}! 🏢</h1><p className="text-slate-400">Manage your bug bounty programs and review submissions.</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[{ l: 'Active Programs', v: active, i: '📋', c: 'bg-purple-500/20' }, { l: 'Awaiting Triage', v: pend, i: '⏳', c: 'bg-yellow-500/20' }, { l: 'Resolved', v: done, i: '✅', c: 'bg-emerald-500/20' }, { l: 'Rewards Paid', v: `$${paid.toLocaleString()}`, i: '💰', c: 'bg-orange-500/30', g: true }].map(s => (
          <div key={s.l} className={`${s.g ? 'bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-500/30' : 'bg-slate-800/50 border-slate-700/50'} rounded-2xl p-6 border`}>
            <div className="flex items-center justify-between mb-4"><div className={`w-12 h-12 ${s.c} rounded-xl flex items-center justify-center`}><span className="text-2xl">{s.i}</span></div></div>
            <div className={`text-3xl font-bold mb-1 ${s.g ? 'text-orange-400' : 'text-white'}`}>{s.v}</div>
            <div className="text-sm text-slate-400">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <button onClick={() => nav('create-program')} className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 hover:from-emerald-600/30 hover:to-cyan-600/30 rounded-2xl p-6 border border-emerald-500/30 text-left transition-all group">
          <div className="flex items-center gap-4"><div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-3xl">➕</span></div><div><h3 className="text-lg font-semibold text-white">Create Program</h3><p className="text-sm text-slate-400">Launch a new bounty</p></div></div>
        </button>
        <button onClick={() => nav('company-programs')} className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 rounded-2xl p-6 border border-purple-500/30 text-left transition-all group">
          <div className="flex items-center gap-4"><div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-3xl">📋</span></div><div><h3 className="text-lg font-semibold text-white">Manage Programs</h3><p className="text-sm text-slate-400">{progs.length} total</p></div></div>
        </button>
        <button onClick={() => nav('company-reports')} className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 rounded-2xl p-6 border border-blue-500/30 text-left transition-all group">
          <div className="flex items-center gap-4"><div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-3xl">🐛</span></div><div><h3 className="text-lg font-semibold text-white">Review Reports</h3><p className="text-sm text-slate-400">{reps.length} submissions</p></div></div>
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Pending Reports</h2>
          <button onClick={() => nav('company-reports')} className="text-sm text-emerald-400 hover:text-emerald-300">View All →</button>
        </div>
        {reps.filter(r => r.status === 'pending').length === 0 ? (
          <div className="p-12 text-center"><div className="text-3xl mb-4">✨</div><h3 className="text-lg font-medium text-white mb-2">All caught up!</h3><p className="text-slate-400">No pending reports.</p></div>
        ) : <div className="divide-y divide-slate-700/50">{reps.filter(r => r.status === 'pending').slice(0, 5).map(r => <ReportRow key={r._id} r={r} onClick={() => nav('report-detail', r)} />)}</div>}
      </div>
    </div>
  );
}

export function AdminDashboard({ nav }: { nav: (p: string, d?: any) => void }) {
  const { users, reports, stats } = useApp();
  const roleColor = (r: string) => r === 'admin' ? 'bg-red-500/20 text-red-400' : r === 'company' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard 👑</h1><p className="text-slate-400">Platform overview and management.</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[{ l: 'Users', v: stats.totalUsers, s: `${stats.totalHackers} hackers, ${stats.totalCompanies} companies`, i: '👥', c: 'bg-blue-500/20' }, { l: 'Programs', v: stats.totalPrograms, s: `${stats.activePrograms} active`, i: '📋', c: 'bg-purple-500/20' }, { l: 'Reports', v: stats.totalReports, s: `${stats.pendingReports} pending`, i: '🐛', c: 'bg-yellow-500/20' }, { l: 'Rewards Paid', v: `$${stats.totalRewardsPaid.toLocaleString()}`, s: 'Total paid out', i: '💰', c: 'bg-emerald-500/30', g: true }].map(s => (
          <div key={s.l} className={`${s.g ? 'bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700/50'} rounded-2xl p-6 border`}>
            <div className="flex items-center justify-between mb-4"><div className={`w-12 h-12 ${s.c} rounded-xl flex items-center justify-center`}><span className="text-2xl">{s.i}</span></div></div>
            <div className={`text-3xl font-bold mb-1 ${s.g ? 'text-emerald-400' : 'text-white'}`}>{s.v}</div>
            <div className="text-sm text-slate-400">{s.s}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <button onClick={() => nav('admin-users')} className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 rounded-2xl p-6 border border-blue-500/30 text-left transition-all group">
          <div className="flex items-center gap-4"><div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-3xl">👥</span></div><div><h3 className="text-lg font-semibold text-white">Manage Users</h3><p className="text-sm text-slate-400">View and moderate users</p></div></div>
        </button>
        <button onClick={() => nav('admin-programs')} className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 rounded-2xl p-6 border border-purple-500/30 text-left transition-all group">
          <div className="flex items-center gap-4"><div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-3xl">📋</span></div><div><h3 className="text-lg font-semibold text-white">Review Programs</h3><p className="text-sm text-slate-400">Moderate programs</p></div></div>
        </button>
        <button onClick={() => nav('admin-reports')} className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 hover:from-emerald-600/30 hover:to-cyan-600/30 rounded-2xl p-6 border border-emerald-500/30 text-left transition-all group">
          <div className="flex items-center gap-4"><div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-3xl">🐛</span></div><div><h3 className="text-lg font-semibold text-white">All Reports</h3><p className="text-sm text-slate-400">Monitor submissions</p></div></div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between"><h2 className="text-xl font-semibold text-white">Recent Users</h2><button onClick={() => nav('admin-users')} className="text-sm text-emerald-400 hover:text-emerald-300">View All →</button></div>
          <div className="divide-y divide-slate-700/50">
            {users.slice(-5).reverse().map(u => (
              <div key={u._id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">{u.username[0].toUpperCase()}</div>
                  <div><div className="text-white font-medium">{u.username}</div><div className="text-sm text-slate-400">{u.email}</div></div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${roleColor(u.role)}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between"><h2 className="text-xl font-semibold text-white">Recent Reports</h2><button onClick={() => nav('admin-reports')} className="text-sm text-emerald-400 hover:text-emerald-300">View All →</button></div>
          <div className="divide-y divide-slate-700/50">
            {reports.slice(-5).reverse().map(r => <ReportRow key={r._id} r={r} onClick={() => nav('report-detail', r)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function AdminUsers({ nav }: { nav: (p: string) => void }) {
  const { users, user: me, toggleUserActive, removeUser } = useApp();
  const [search, setSearch] = useState('');
  const [roleF, setRoleF] = useState('all');
  const [delId, setDelId] = useState<string | null>(null);
  const filtered = users.filter(u => {
    const ms = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return ms && (roleF === 'all' || u.role === roleF) && u._id !== me?._id;
  });
  const roleColor = (r: string) => r === 'admin' ? 'bg-red-500/20 text-red-400 border-red-500/30' : r === 'company' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => nav('admin-dash')} className="flex items-center text-slate-400 hover:text-white mb-4"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back</button>
      <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
      <p className="text-slate-400 mb-8">Manage all platform users.</p>
      <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>
          <select value={roleF} onChange={e => setRoleF(e.target.value)} className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="all">All Roles</option><option value="hacker">Hackers</option><option value="company">Companies</option><option value="admin">Admins</option></select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-cyan-400">{users.filter(u => u.role === 'hacker').length}</div><div className="text-sm text-slate-400">Hackers</div></div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-purple-400">{users.filter(u => u.role === 'company').length}</div><div className="text-sm text-slate-400">Companies</div></div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-white">{users.filter(u => u.isActive).length}</div><div className="text-sm text-slate-400">Active</div></div>
      </div>
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50"><tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Joined</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map(u => (
                <tr key={u._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${u.role === 'admin' ? 'bg-red-500' : u.role === 'company' ? 'bg-purple-500' : 'bg-cyan-500'}`}>{u.username[0].toUpperCase()}</div><div className="ml-4"><div className="text-white font-medium">{u.username}</div><div className="text-sm text-slate-400">{u.email}</div></div></div></td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${roleColor(u.role)}`}>{u.role}</span></td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${u.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}><span className={`w-2 h-2 rounded-full mr-2 ${u.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>{u.isActive ? 'Active' : 'Blocked'}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2">
                    <button onClick={() => toggleUserActive(u._id, !u.isActive)} className={`px-3 py-1 text-xs font-medium rounded-lg ${u.isActive ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}>{u.isActive ? 'Block' : 'Unblock'}</button>
                    <button onClick={() => setDelId(u._id)} className="px-3 py-1 text-xs font-medium rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-12 text-center text-slate-400">No users found.</div>}
      </div>
      {delId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
            <h3 className="text-xl font-semibold text-white text-center mb-2">Delete User?</h3>
            <p className="text-slate-400 text-center mb-6">This cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDelId(null)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Cancel</button>
              <button onClick={() => { removeUser(delId); setDelId(null); }} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminPrograms({ nav }: { nav: (p: string, d?: any) => void }) {
  const { programs, updateProgram, removeProgram } = useApp();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [delId, setDelId] = useState<string | null>(null);
  const filtered = programs.filter(p => {
    const ms = p.title.toLowerCase().includes(search.toLowerCase()) || p.companyName.toLowerCase().includes(search.toLowerCase());
    return ms && (statusF === 'all' || p.status === statusF);
  });
  const stColor = (s: string) => s === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : s === 'paused' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : s === 'closed' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => nav('admin-dash')} className="flex items-center text-slate-400 hover:text-white mb-4"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back</button>
      <h1 className="text-3xl font-bold text-white mb-2">Program Management</h1>
      <p className="text-slate-400 mb-8">Manage all bug bounty programs.</p>
      <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search programs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>
          <select value={statusF} onChange={e => setStatusF(e.target.value)} className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="all">All Status</option><option value="active">Active</option><option value="paused">Paused</option><option value="closed">Closed</option><option value="draft">Draft</option></select>
        </div>
      </div>
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50"><tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Program</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Company</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Submissions</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map(p => (
                <tr key={p._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center"><div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">{p.companyName[0]}</div><div className="ml-4"><div className="text-white font-medium max-w-xs truncate">{p.title}</div><div className="text-sm text-slate-400">{p.scope.length} targets</div></div></div></td>
                  <td className="px-6 py-4 text-slate-300">{p.companyName}</td>
                  <td className="px-6 py-4"><select value={p.status} onChange={e => updateProgram(p._id, { status: e.target.value as any })} className={`px-3 py-1 text-xs font-medium rounded-full border capitalize cursor-pointer ${stColor(p.status)}`}><option value="active">Active</option><option value="paused">Paused</option><option value="closed">Closed</option></select></td>
                  <td className="px-6 py-4 text-slate-300">{p.submissionCount}</td>
                  <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2">
                    <button onClick={() => nav('program-detail', p)} className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">View</button>
                    <button onClick={() => setDelId(p._id)} className="px-3 py-1 text-xs font-medium rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-12 text-center text-slate-400">No programs found.</div>}
      </div>
      {delId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white text-center mb-2">Delete Program?</h3>
            <p className="text-slate-400 text-center mb-6">This cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDelId(null)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Cancel</button>
              <button onClick={() => { removeProgram(delId); setDelId(null); }} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminReports({ nav }: { nav: (p: string, d?: any) => void }) {
  const { reports, removeReport, setReportStatus } = useApp();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [sevF, setSevF] = useState('all');
  const [delId, setDelId] = useState<string | null>(null);
  const filtered = reports.filter(r => {
    const ms = r.title.toLowerCase().includes(search.toLowerCase()) || r.hackerUsername.toLowerCase().includes(search.toLowerCase());
    return ms && (statusF === 'all' || r.status === statusF) && (sevF === 'all' || r.severity === sevF);
  });
  const stColor = (s: string) => s === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : s === 'under_review' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : s === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
  const sevColor = (s: string) => s === 'critical' ? 'bg-red-500/20 text-red-400' : s === 'high' ? 'bg-orange-500/20 text-orange-400' : s === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => nav('admin-dash')} className="flex items-center text-slate-400 hover:text-white mb-4"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back</button>
      <h1 className="text-3xl font-bold text-white mb-2">Report Management</h1>
      <p className="text-slate-400 mb-8">Manage all vulnerability reports.</p>
      <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>
          <select value={statusF} onChange={e => setStatusF(e.target.value)} className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="all">All Status</option><option value="pending">Pending</option><option value="under_review">Under Review</option><option value="resolved">Resolved</option><option value="rejected">Rejected</option></select>
          <select value={sevF} onChange={e => setSevF(e.target.value)} className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="all">All Severity</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-white">{reports.length}</div><div className="text-sm text-slate-400">Total</div></div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-yellow-400">{reports.filter(r => r.status === 'pending').length}</div><div className="text-sm text-slate-400">Pending</div></div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-emerald-400">{reports.filter(r => r.status === 'resolved').length}</div><div className="text-sm text-slate-400">Resolved</div></div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-red-400">{reports.filter(r => r.severity === 'critical').length}</div><div className="text-sm text-slate-400">Critical</div></div>
      </div>
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50"><tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Report</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Researcher</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Severity</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map(r => (
                <tr key={r._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4"><div className="max-w-xs"><div className="text-white font-medium truncate">{r.title}</div>{r.reward > 0 && <div className="text-sm text-emerald-400">${r.reward.toLocaleString()}</div>}</div></td>
                  <td className="px-6 py-4 text-slate-300">{r.hackerUsername}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${sevColor(r.severity)}`}>{r.severity}</span></td>
                  <td className="px-6 py-4"><select value={r.status} onChange={e => setReportStatus(r._id, e.target.value as any)} className={`px-2 py-1 text-xs font-medium rounded-full border capitalize cursor-pointer ${stColor(r.status)}`}><option value="pending">Pending</option><option value="under_review">Under Review</option><option value="resolved">Resolved</option><option value="rejected">Rejected</option></select></td>
                  <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2">
                    <button onClick={() => nav('report-detail', r)} className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">View</button>
                    <button onClick={() => setDelId(r._id)} className="px-3 py-1 text-xs font-medium rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-12 text-center text-slate-400">No reports found.</div>}
      </div>
      {delId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white text-center mb-2">Delete Report?</h3>
            <p className="text-slate-400 text-center mb-6">This cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDelId(null)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Cancel</button>
              <button onClick={() => { removeReport(delId); setDelId(null); }} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

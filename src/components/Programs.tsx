import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Program, Severity } from '../types';

export function ProgramList({ nav, company }: { nav: (p: string, d?: any) => void; company?: boolean }) {
  const { programs, companyPrograms, user } = useApp();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const list = company ? companyPrograms() : programs.filter(p => p.status === 'active');
  const filtered = list.filter(p => {
    const ms = p.title.toLowerCase().includes(search.toLowerCase()) || p.companyName.toLowerCase().includes(search.toLowerCase());
    const mst = statusF === 'all' || p.status === statusF;
    return ms && mst;
  });

  const stColor = (s: string) => s === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : s === 'paused' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : s === 'closed' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white mb-2">{company ? 'My Programs' : 'Bug Bounty Programs'}</h1><p className="text-slate-400">{company ? 'Manage your programs' : 'Browse active security programs'}</p></div>
        {company && user?.role === 'company' && <button onClick={() => nav('create-program')} className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">➕ New Program</button>}
      </div>
      <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search programs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>
          {company && <select value={statusF} onChange={e => setStatusF(e.target.value)} className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="all">All Status</option><option value="active">Active</option><option value="paused">Paused</option><option value="closed">Closed</option><option value="draft">Draft</option></select>}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center"><div className="text-3xl mb-4">📋</div><h3 className="text-lg font-medium text-white mb-2">No programs found</h3></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p._id} onClick={() => nav('program-detail', p)} className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-emerald-500/50 transition-all cursor-pointer group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">{p.companyName[0]}</div>
                  {company && <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${stColor(p.status)}`}>{p.status}</span>}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{p.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between text-sm"><span className="text-slate-500">by {p.companyName}</span><span className="text-slate-500">{p.submissionCount} submissions</span></div>
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div><div className="text-xs text-slate-500 mb-1">Critical Reward</div><div className="text-emerald-400 font-semibold">{p.rewards.critical}</div></div>
                    <div className="text-xs text-slate-500">{p.scope.length} targets</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CreateProgram({ nav }: { nav: (p: string) => void }) {
  const { createProgram, user } = useApp();
  const [form, setForm] = useState({ title: '', description: '', scope: '', outOfScope: '', critical: '', high: '', medium: '', low: '', status: 'active' as 'draft' | 'active' });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (!form.title || !form.description || !form.scope) { setErr('Fill required fields'); return; }
    createProgram({
      companyId: user!._id, companyName: user!.username, title: form.title, description: form.description,
      scope: form.scope.split('\n').filter(s => s.trim()), outOfScope: form.outOfScope.split('\n').filter(s => s.trim()),
      rewards: { critical: form.critical || 'TBD', high: form.high || 'TBD', medium: form.medium || 'TBD', low: form.low || 'TBD' },
      status: form.status,
    });
    setDone(true); setTimeout(() => nav('company-programs'), 1500);
  };

  if (done) return <div className="max-w-2xl mx-auto px-4 py-16"><div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center"><div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div><h2 className="text-2xl font-bold text-white mb-2">Program Created!</h2><p className="text-slate-400">Redirecting...</p></div></div>;

  const inputCls = "w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => nav('company-programs')} className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back</button>
      <h1 className="text-3xl font-bold text-white mb-2">Create New Program</h1>
      <p className="text-slate-400 mb-8">Set up your bug bounty program.</p>
      <form onSubmit={submit} className="space-y-6">
        {err && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{err}</div>}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Info</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Title *</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="e.g., My Company Bug Bounty" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Description *</label><textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="Describe your program..." /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'draft' | 'active' })} className={inputCls}><option value="active">Active (Visible)</option><option value="draft">Draft (Hidden)</option></select></div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Scope</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-300 mb-2">In Scope (one per line) *</label><textarea rows={4} value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })} className={`${inputCls} resize-none font-mono text-sm`} placeholder={"*.example.com\napi.example.com"} /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Out of Scope</label><textarea rows={3} value={form.outOfScope} onChange={e => setForm({ ...form, outOfScope: e.target.value })} className={`${inputCls} resize-none font-mono text-sm`} placeholder={"Third-party services\nSocial engineering"} /></div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{ k: 'critical', l: '🔴 Critical', ph: '$5,000 - $15,000' }, { k: 'high', l: '🟠 High', ph: '$2,000 - $5,000' }, { k: 'medium', l: '🟡 Medium', ph: '$500 - $2,000' }, { k: 'low', l: '🟢 Low', ph: '$100 - $500' }].map(f => (
              <div key={f.k}><label className="block text-sm font-medium text-slate-300 mb-2">{f.l}</label><input type="text" value={form[f.k as keyof typeof form] as string} onChange={e => setForm({ ...form, [f.k]: e.target.value })} className={inputCls} placeholder={f.ph} /></div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => nav('company-programs')} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl">Cancel</button>
          <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">Create Program</button>
        </div>
      </form>
    </div>
  );
}

export function ProgramDetail({ program, nav }: { program: Program; nav: (p: string, d?: any) => void }) {
  const { reports, user, updateProgram } = useApp();
  const progReports = reports.filter(r => r.programId === program._id);
  const isOwner = user?._id === program.companyId;
  const stColor = (s: string) => s === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : s === 'paused' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : s === 'closed' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => nav('programs')} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back</button>
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">{program.companyName[0]}</div>
            <div><h1 className="text-2xl font-bold text-white mb-1">{program.title}</h1><p className="text-slate-400">by {program.companyName}</p></div>
          </div>
          <span className={`px-4 py-2 text-sm font-medium rounded-full border capitalize ${stColor(program.status)}`}>{program.status}</span>
        </div>
        {isOwner && (
          <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center gap-3">
            <span className="text-sm text-slate-400">Status:</span>
            {(['active', 'paused', 'closed'] as const).map(s => (
              <button key={s} onClick={() => updateProgram(program._id, { status: s })} className={`px-4 py-2 text-sm rounded-lg transition-colors ${program.status === s ? s === 'active' ? 'bg-emerald-500 text-white' : s === 'paused' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        )}
        {user?.role === 'hacker' && program.status === 'active' && (
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <button onClick={() => nav('submit-bug', program)} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">🐛 Submit Vulnerability Report</button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-white">{program.submissionCount}</div><div className="text-sm text-slate-400">Submissions</div></div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-white">{program.scope.length}</div><div className="text-sm text-slate-400">Targets</div></div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center"><div className="text-2xl font-bold text-emerald-400">{program.rewards.critical.split(' - ')[0]}</div><div className="text-sm text-slate-400">Max Critical</div></div>
      </div>
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6"><h2 className="text-lg font-semibold text-white mb-4">Description</h2><p className="text-slate-300 whitespace-pre-wrap">{program.description}</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">✅ In Scope</h2>
          <ul className="space-y-2">{program.scope.map((s, i) => <li key={i} className="flex items-center text-slate-300"><span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>{s}</li>)}</ul>
        </div>
        {program.outOfScope.length > 0 && <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6"><h2 className="text-lg font-semibold text-white mb-4">❌ Out of Scope</h2><ul className="space-y-2">{program.outOfScope.map((s, i) => <li key={i} className="flex items-center text-slate-300"><span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>{s}</li>)}</ul></div>}
      </div>
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Reward Ranges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['critical', 'high', 'medium', 'low'] as Severity[]).map(s => (
            <div key={s} className={`${s === 'critical' ? 'bg-red-500/10 border-red-500/20' : s === 'high' ? 'bg-orange-500/10 border-orange-500/20' : s === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20'} rounded-xl p-4 border`}>
              <div className={`text-sm mb-1 ${s === 'critical' ? 'text-red-400' : s === 'high' ? 'text-orange-400' : s === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</div>
              <div className="text-lg font-semibold text-white">{program.rewards[s]}</div>
            </div>
          ))}
        </div>
      </div>
      {isOwner && progReports.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50"><h2 className="text-lg font-semibold text-white">Submissions</h2></div>
          <div className="divide-y divide-slate-700/50">{progReports.slice(0, 5).map(r => (
            <div key={r._id} onClick={() => nav('report-detail', r)} className="p-4 hover:bg-slate-700/30 cursor-pointer flex items-center justify-between">
              <div><div className="text-white font-medium">{r.title}</div><div className="text-sm text-slate-400">by {r.hackerUsername}</div></div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : r.status === 'under_review' ? 'bg-blue-500/20 text-blue-400' : r.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{r.status.replace('_', ' ')}</span>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );
}

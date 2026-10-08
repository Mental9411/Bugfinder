import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BugReport, Program, Severity, ReportStatus } from '../types';

export function SubmitBug({ nav, preselect }: { nav: (p: string) => void; preselect?: Program }) {
  const { programs, submitReport, user } = useApp();
  const active = programs.filter(p => p.status === 'active');
  const [form, setForm] = useState({ programId: preselect?._id || '', title: '', description: '', steps: '', impact: '', severity: 'medium' as Severity });
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (!form.programId || !form.title || !form.description || !form.steps || !form.impact) { setErr('Fill all required fields'); return; }
    const prog = programs.find(p => p._id === form.programId);
    if (!prog) { setErr('Select a valid program'); return; }
    submitReport({ programId: form.programId, programTitle: prog.title, hackerId: user!._id, hackerUsername: user!.username, title: form.title, description: form.description, stepsToReproduce: form.steps, impact: form.impact, severity: form.severity, status: 'pending' });
    setDone(true); setTimeout(() => nav('my-reports'), 2000);
  };

  const sevInfo: Record<Severity, { color: string; desc: string }> = {
    critical: { color: 'bg-red-500/20 text-red-400 border-red-500/30', desc: 'RCE, SQL injection with data access, auth bypass' },
    high: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', desc: 'Stored XSS, IDOR, privilege escalation' },
    medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', desc: 'Reflected XSS, CSRF, info disclosure' },
    low: { color: 'bg-green-500/20 text-green-400 border-green-500/30', desc: 'Missing headers, verbose errors, minor leaks' },
  };

  if (done) return <div className="max-w-2xl mx-auto px-4 py-16"><div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center"><div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div><h2 className="text-2xl font-bold text-white mb-2">Report Submitted!</h2><p className="text-slate-400">Redirecting...</p></div></div>;

  const cls = "w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => nav('hacker-dash')} className="flex items-center text-slate-400 hover:text-white mb-4"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back</button>
      <h1 className="text-3xl font-bold text-white mb-2">Submit Vulnerability Report</h1>
      <p className="text-slate-400 mb-8">Provide detailed information about the vulnerability.</p>
      <form onSubmit={submit} className="space-y-6">
        {err && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{err}</div>}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Select Program</h2>
          <select value={form.programId} onChange={e => setForm({ ...form, programId: e.target.value })} className={cls} disabled={!!preselect}>
            <option value="">Select a program...</option>
            {active.map(p => <option key={p._id} value={p._id}>{p.title} - {p.companyName}</option>)}
          </select>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Vulnerability Details</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Title *</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={cls} placeholder="e.g., SQL Injection in Search" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Description *</label><textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${cls} resize-none`} placeholder="Describe the vulnerability..." /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Steps to Reproduce *</label><textarea rows={4} value={form.steps} onChange={e => setForm({ ...form, steps: e.target.value })} className={`${cls} resize-none font-mono text-sm`} placeholder={"1. Navigate to...\n2. Enter payload...\n3. Observe..."} /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Impact *</label><textarea rows={3} value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value })} className={`${cls} resize-none`} placeholder="What could an attacker achieve?" /></div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Severity</h2>
          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(sevInfo) as Severity[]).map(s => (
              <button key={s} type="button" onClick={() => setForm({ ...form, severity: s })} className={`p-4 rounded-xl border-2 text-left transition-all ${form.severity === s ? sevInfo[s].color + ' border-current' : 'border-slate-600 hover:border-slate-500'}`}>
                <div className={`font-semibold mb-1 ${form.severity === s ? '' : 'text-white'}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</div>
                <div className="text-xs text-slate-400">{sevInfo[s].desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => nav('hacker-dash')} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl">Cancel</button>
          <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">Submit Report</button>
        </div>
      </form>
    </div>
  );
}

export function ReportList({ nav, filter }: { nav: (p: string, d?: any) => void; filter: 'hacker' | 'company' | 'all' }) {
  const { reports, hackerReports, companyReports, user } = useApp();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [sevF, setSevF] = useState('all');

  const list = filter === 'hacker' ? hackerReports() : filter === 'company' ? companyReports() : reports;
  const filtered = list.filter(r => {
    const ms = r.title.toLowerCase().includes(search.toLowerCase()) || r.hackerUsername.toLowerCase().includes(search.toLowerCase());
    return ms && (statusF === 'all' || r.status === statusF) && (sevF === 'all' || r.severity === sevF);
  });

  const stColor = (s: string) => s === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : s === 'under_review' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : s === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
  const sevColor = (s: string) => s === 'critical' ? 'bg-red-500/20 text-red-400' : s === 'high' ? 'bg-orange-500/20 text-orange-400' : s === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400';

  const title = filter === 'hacker' ? 'My Reports' : filter === 'company' ? 'Received Reports' : 'All Reports';
  const desc = filter === 'hacker' ? 'Track your submissions.' : filter === 'company' ? 'Review researcher submissions.' : 'All platform reports.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white mb-2">{title}</h1><p className="text-slate-400">{desc}</p></div>
        {filter === 'hacker' && user?.role === 'hacker' && <button onClick={() => nav('submit-bug')} className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">➕ Submit New Bug</button>}
      </div>
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
      <div className="mb-4 text-sm text-slate-400">Showing {filtered.length} of {list.length} reports</div>
      {filtered.length === 0 ? (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center"><div className="text-3xl mb-4">🐛</div><h3 className="text-lg font-medium text-white mb-2">No reports found</h3></div>
      ) : (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="divide-y divide-slate-700/50">
            {filtered.map(r => (
              <div key={r._id} onClick={() => nav('report-detail', r)} className="p-6 hover:bg-slate-700/30 cursor-pointer transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-white truncate">{r.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize flex-shrink-0 ${sevColor(r.severity)}`}>{r.severity}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                      <span>{r.programTitle}</span>
                      {filter !== 'hacker' && <><span className="hidden sm:inline">•</span><span>by {r.hackerUsername}</span></>}
                      <span className="hidden sm:inline">•</span><span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      {r.reward > 0 && <><span className="hidden sm:inline">•</span><span className="text-emerald-400 font-medium">${r.reward.toLocaleString()}</span></>}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border capitalize flex-shrink-0 ${stColor(r.status)}`}>{r.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ReportDetail({ report, nav }: { report: BugReport; nav: (p: string) => void }) {
  const { user, setReportStatus, setReward, addComment, programs } = useApp();
  const [comment, setComment] = useState('');
  const [rewardAmt, setRewardAmt] = useState('');
  const [showReward, setShowReward] = useState(false);

  const prog = programs.find(p => p._id === report.programId);
  const isCompany = user?.role === 'company' && prog?.companyId === user?._id;
  const isAdmin = user?.role === 'admin';
  const canManage = isCompany || isAdmin;

  const stColor = (s: string) => s === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : s === 'under_review' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : s === 'resolved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
  const sevColor = (s: string) => s === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : s === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : s === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30';

  const doComment = (e: React.FormEvent) => { e.preventDefault(); if (comment.trim()) { addComment(report._id, comment); setComment(''); } };
  const doReward = () => { const a = parseFloat(rewardAmt); if (!isNaN(a) && a > 0) { setReward(report._id, a); setShowReward(false); setRewardAmt(''); } };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => nav(user?.role === 'hacker' ? 'my-reports' : user?.role === 'company' ? 'company-reports' : 'admin-reports')} className="flex items-center text-slate-400 hover:text-white mb-6"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back</button>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border capitalize ${sevColor(report.severity)}`}>{report.severity}</span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border capitalize ${stColor(report.status)}`}>{report.status.replace('_', ' ')}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{report.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
              <span>📋 {report.programTitle}</span><span>👤 {report.hackerUsername}</span><span>📅 {new Date(report.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {report.reward > 0 && (
            <div className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/30">
              <div className="text-sm text-emerald-400 mb-1">Reward</div>
              <div className="text-2xl font-bold text-emerald-400">${report.reward.toLocaleString()}</div>
              <div className="text-xs text-slate-400">{report.rewardPaid ? '✅ Paid' : '⏳ Pending'}</div>
            </div>
          )}
        </div>
        {canManage && (
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-400">Status:</span>
              {(['under_review', 'resolved', 'rejected'] as ReportStatus[]).map(s => (
                <button key={s} onClick={() => setReportStatus(report._id, s)} className={`px-4 py-2 text-sm rounded-lg transition-colors ${report.status === s ? s === 'under_review' ? 'bg-blue-500 text-white' : s === 'resolved' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                  {s === 'under_review' ? '🔍 Under Review' : s === 'resolved' ? '✅ Resolve' : '❌ Reject'}
                </button>
              ))}
              <button onClick={() => setShowReward(true)} className="px-4 py-2 text-sm rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">💰 {report.reward > 0 ? 'Update' : 'Add'} Reward</button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6"><h2 className="text-lg font-semibold text-white mb-4">Description</h2><p className="text-slate-300 whitespace-pre-wrap">{report.description}</p></div>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6"><h2 className="text-lg font-semibold text-white mb-4">Steps to Reproduce</h2><pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm bg-slate-900/50 rounded-xl p-4 overflow-x-auto">{report.stepsToReproduce}</pre></div>
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6"><h2 className="text-lg font-semibold text-white mb-4">Impact</h2><p className="text-slate-300 whitespace-pre-wrap">{report.impact}</p></div>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Report Info</h2>
            <dl className="space-y-4">
              <div><dt className="text-sm text-slate-400">ID</dt><dd className="text-white font-mono text-sm">{report._id}</dd></div>
              <div><dt className="text-sm text-slate-400">Program</dt><dd className="text-white">{report.programTitle}</dd></div>
              <div><dt className="text-sm text-slate-400">Researcher</dt><dd className="text-white">{report.hackerUsername}</dd></div>
              <div><dt className="text-sm text-slate-400">Submitted</dt><dd className="text-white">{new Date(report.createdAt).toLocaleString()}</dd></div>
              <div><dt className="text-sm text-slate-400">Updated</dt><dd className="text-white">{new Date(report.updatedAt).toLocaleString()}</dd></div>
            </dl>
          </div>
          {prog && (
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Reward Range</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-red-400">Critical:</span><span className="text-white">{prog.rewards.critical}</span></div>
                <div className="flex justify-between"><span className="text-orange-400">High:</span><span className="text-white">{prog.rewards.high}</span></div>
                <div className="flex justify-between"><span className="text-yellow-400">Medium:</span><span className="text-white">{prog.rewards.medium}</span></div>
                <div className="flex justify-between"><span className="text-green-400">Low:</span><span className="text-white">{prog.rewards.low}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50"><h2 className="text-lg font-semibold text-white">Comments ({report.comments.length})</h2></div>
        {report.comments.length > 0 && (
          <div className="divide-y divide-slate-700/50">
            {report.comments.map(c => (
              <div key={c._id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${c.userRole === 'company' ? 'bg-purple-500' : c.userRole === 'admin' ? 'bg-red-500' : 'bg-cyan-500'}`}>{c.username[0].toUpperCase()}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{c.username}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${c.userRole === 'company' ? 'bg-purple-500/20 text-purple-400' : c.userRole === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>{c.userRole}</span>
                      <span className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-300 whitespace-pre-wrap">{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={doComment} className="p-6 bg-slate-900/30">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${user?.role === 'company' ? 'bg-purple-500' : user?.role === 'admin' ? 'bg-red-500' : 'bg-cyan-500'}`}>{user?.username[0].toUpperCase()}</div>
            <div className="flex-1">
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." rows={3} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none" />
              <button type="submit" disabled={!comment.trim()} className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg">Post Comment</button>
            </div>
          </div>
        </form>
      </div>

      {showReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Add Reward</h3>
            <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label><input type="number" value={rewardAmt} onChange={e => setRewardAmt(e.target.value)} placeholder="Enter amount" className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReward(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Cancel</button>
              <button onClick={doReward} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">Add Reward</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

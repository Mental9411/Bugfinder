import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function LoginPage({ nav }: { nav: (p: string) => void }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    if (!email || !pw) { setErr('Fill in all fields'); setLoading(false); return; }
    const r = login(email, pw);
    if (r.ok) {
      const u = JSON.parse(localStorage.getItem('bb_session') || '{}');
      nav(u.role === 'admin' ? 'admin-dash' : u.role === 'company' ? 'company-dash' : 'hacker-dash');
    } else setErr(r.msg);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-xl shadow-emerald-500/20 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to BugBounty Pro</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <form onSubmit={submit} className="space-y-5">
            {err && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{err}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-400">No account? <button onClick={() => nav('register')} className="text-emerald-400 hover:text-emerald-300 font-medium">Create one</button></p>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[{ r: 'Admin', e: 'admin@bugbounty.com', p: 'admin123', c: 'text-emerald-400' }, { r: 'Company', e: 'security@techcorp.com', p: 'company123', c: 'text-purple-400' }, { r: 'Hacker', e: 'ninja@hacker.com', p: 'hacker123', c: 'text-cyan-400' }].map(d => (
                <div key={d.r} className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <div className={`${d.c} font-medium`}>{d.r}</div>
                  <div className="text-slate-500 truncate">{d.e}</div>
                  <div className="text-slate-500">{d.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage({ nav }: { nav: (p: string) => void }) {
  const { register } = useApp();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', role: 'hacker' as 'hacker' | 'company' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    if (!form.username || !form.email || !form.password || !form.confirm) { setErr('Fill in all fields'); setLoading(false); return; }
    if (form.password.length < 6) { setErr('Password must be 6+ characters'); setLoading(false); return; }
    if (form.password !== form.confirm) { setErr('Passwords do not match'); setLoading(false); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Invalid email'); setLoading(false); return; }
    const r = register(form.username, form.email, form.password, form.role);
    if (r.ok) nav(form.role === 'hacker' ? 'hacker-dash' : 'company-dash');
    else setErr(r.msg);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-xl shadow-emerald-500/20 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join BugBounty Pro</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <form onSubmit={submit} className="space-y-5">
            {err && <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">{err}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Join as</label>
              <div className="grid grid-cols-2 gap-3">
                {(['hacker', 'company'] as const).map(r => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, role: r })} className={`p-4 rounded-xl border-2 transition-all ${form.role === r ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-600 hover:border-slate-500'}`}>
                    <div className="text-2xl mb-1">{r === 'hacker' ? '🛡️' : '🏢'}</div>
                    <div className={`font-semibold ${form.role === r ? 'text-emerald-400' : 'text-white'}`}>{r === 'hacker' ? 'Researcher' : 'Company'}</div>
                    <div className="text-xs text-slate-400 mt-1">{r === 'hacker' ? 'Find bugs & earn' : 'Launch programs'}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Choose a username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="6+ characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-slate-400">Have an account? <button onClick={() => nav('login')} className="text-emerald-400 hover:text-emerald-300 font-medium">Sign in</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

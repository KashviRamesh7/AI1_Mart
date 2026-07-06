import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function UserAuth() {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', confirm:'' });
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast('Welcome back!', 'success');
        navigate('/store');
      } else {
        if (form.password !== form.confirm) { toast('Passwords do not match', 'error'); setLoading(false); return; }
        if (form.password.length < 6) { toast('Password must be at least 6 characters', 'error'); setLoading(false); return; }
        await register(form);
        toast('Account created! Welcome to AI1 Mart', 'success');
        navigate('/store');
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Something went wrong', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex' }}>
      {/* Left panel */}
      <div style={{ flex:1, background:'linear-gradient(160deg,#0C1A2E,#0EA5E9)', display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
        <div style={{ color:'#fff', maxWidth:380 }}>
          <div style={{ cursor:'pointer', color:'rgba(255,255,255,0.55)', fontSize:13, marginBottom:28, display:'flex', alignItems:'center', gap:6, fontWeight:600 }} onClick={() => navigate('/')}>
            ← Back to home
          </div>
          <div style={{ fontFamily:'Poppins', fontSize:42, fontWeight:900, marginBottom:8, lineHeight:1.1 }}>
            AI<span style={{ color:'#F59E0B' }}>1</span><br/>
            <span style={{ color:'#BAE6FD' }}>Mart</span>
          </div>
          <p style={{ fontSize:13, opacity:.55, marginBottom:4, fontWeight:600 }}>ALL IN ONE MART</p>
          <p style={{ fontSize:17, opacity:.8, lineHeight:1.7, marginBottom:32 }}>Your ultimate destination for everything you love — all in one place.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              ['🛍️', 'Millions of products across 50+ categories'],
              ['🚚', 'Fast & reliable delivery to your doorstep'],
              ['💳', 'Secure payments — Cards, UPI, Net Banking, COD'],
              ['🔄', 'Easy returns and 24/7 customer support'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:12, fontSize:14, opacity:.85 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40, background:'var(--bg)' }}>
        <div style={{ background:'var(--surface)', borderRadius:24, padding:40, width:'100%', maxWidth:440, boxShadow:'var(--shadow-lg)', border:'1.5px solid var(--border)' }}>

          <div className="tab-bar" style={{ marginBottom:28 }}>
            <button className={`tab-btn ${mode==='login'?'active':''}`} onClick={() => setMode('login')}>Sign In</button>
            <button className={`tab-btn ${mode==='register'?'active':''}`} onClick={() => setMode('register')}>Create Account</button>
          </div>

          <h2 style={{ fontFamily:'Poppins', fontSize:22, marginBottom:4 }}>
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:24 }}>
            {mode === 'login' ? 'Sign in to continue shopping' : 'Join AI1 Mart and start shopping today'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input className="form-control" placeholder="John" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input className="form-control" placeholder="Doe" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="username" />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-control" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <div style={{ position:'relative' }}>
                <input className="form-control" type={showPass?'text':'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required autoComplete={mode==='login'?'current-password':'new-password'} style={{ paddingRight:44 }} />
                <button type="button" onClick={() => setShowPass(p=>!p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:16 }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input className="form-control" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} required autoComplete="new-password" />
              </div>
            )}

            {mode === 'login' && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--text-muted)', cursor:'pointer', margin:0, fontWeight:600 }}>
                  <input type="checkbox" style={{ accentColor:'var(--primary)' }} /> Remember me
                </label>
                <span style={{ fontSize:13, color:'var(--primary)', cursor:'pointer', fontWeight:700 }}>Forgot password?</span>
              </div>
            )}

            {mode === 'register' && (
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:13, color:'var(--text-muted)', cursor:'pointer', margin:0 }}>
                  <input type="checkbox" required style={{ marginTop:2, accentColor:'var(--primary)' }} />
                  I agree to AI1 Mart's Terms of Service and Privacy Policy
                </label>
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width:'100%', height:48, fontSize:15, justifyContent:'center', borderRadius:12 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, color:'var(--text-muted)', marginTop:20 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span style={{ color:'var(--primary)', cursor:'pointer', fontWeight:700 }} onClick={() => setMode(mode==='login'?'register':'login')}>
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

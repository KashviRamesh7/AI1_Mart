import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function StaffAuth() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast('Please fill in all fields', 'error'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'customer') { toast('Please use the Customer Portal', 'error'); setLoading(false); return; }
      toast(`Welcome back, ${user.firstName}!`, 'success');
      navigate('/admin');
    } catch (err) {
      toast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0C1A2E 0%,#0284C7 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:24, padding:'44px 40px', width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>

        <div style={{ cursor:'pointer', color:'var(--text-muted)', fontSize:13, marginBottom:28, display:'flex', alignItems:'center', gap:6, fontWeight:600 }} onClick={() => navigate('/')}>
          ← Back to portals
        </div>

        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:'Poppins', fontSize:32, fontWeight:900 }}>
            AI<span style={{ color:'#F59E0B' }}>1</span><span style={{ color:'var(--primary)' }}> Mart</span>
          </div>
          <p style={{ color:'var(--text-muted)', fontSize:14, marginTop:6, fontWeight:600 }}>Staff Management Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Staff Email Address</label>
            <input className="form-control" type="email" placeholder="your.email@company.com" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="username" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position:'relative' }}>
              <input className="form-control" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={e => set('password', e.target.value)} required autoComplete="current-password" style={{ paddingRight:44 }} />
              <button type="button" onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:16 }}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--text-muted)', cursor:'pointer', margin:0, fontWeight:600 }}>
              <input type="checkbox" style={{ accentColor:'var(--primary)' }} /> Remember me
            </label>
            <span style={{ fontSize:13, color:'var(--primary)', cursor:'pointer', fontWeight:700 }}>Forgot password?</span>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width:'100%', height:48, fontSize:15, justifyContent:'center', borderRadius:12 }}>
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign:'center', marginTop:20 }}>
          <p style={{ fontSize:12, color:'var(--text-light)' }}>All staff sessions are secured and monitored</p>
          <p style={{ fontSize:12, color:'var(--text-light)', marginTop:4 }}>Access level is determined by your account role</p>
        </div>
      </div>
    </div>
  );
}

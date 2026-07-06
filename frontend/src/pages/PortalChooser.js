import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PortalChooser() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'customer') navigate('/store');
      else navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0C1A2E 0%,#0EA5E9 60%,#6366F1 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>

      {/* Logo */}
      <div style={{ textAlign:'center', marginBottom:52 }}>
        <div style={{ fontFamily:'Poppins,sans-serif', fontSize:56, fontWeight:900, color:'#fff', letterSpacing:-2, lineHeight:1 }}>
          AI<span style={{ color:'#F59E0B' }}>1</span>
          <span style={{ color:'#BAE6FD' }}> Mart</span>
        </div>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:17, marginTop:10, fontWeight:500 }}>All In One Mart</p>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:4 }}>Your complete shopping & management solution</p>
      </div>

      {/* Portal Cards */}
      <div style={{ display:'flex', gap:28, flexWrap:'wrap', justifyContent:'center', padding:'0 20px' }}>

        {/* Customer */}
        <div
          onClick={() => navigate('/login')}
          style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(12px)', border:'1.5px solid rgba(255,255,255,0.18)', borderRadius:24, padding:'44px 48px', cursor:'pointer', transition:'all .25s', minWidth:260, textAlign:'center' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.16)'; e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; }}
        >
          <div style={{ width:72, height:72, borderRadius:20, background:'rgba(245,158,11,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:36 }}>🛍️</div>
          <h2 style={{ fontFamily:'Poppins', color:'#fff', fontSize:22, marginBottom:10 }}>Customer Portal</h2>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14, lineHeight:1.6, marginBottom:24 }}>Browse & shop millions of products, track orders, and manage your account</p>
          <div style={{ background:'#F59E0B', color:'#fff', padding:'11px 28px', borderRadius:12, fontWeight:700, fontSize:14, display:'inline-block' }}>
            Shop Now →
          </div>
        </div>

        {/* Staff */}
        <div
          onClick={() => navigate('/staff-login')}
          style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(12px)', border:'1.5px solid rgba(255,255,255,0.18)', borderRadius:24, padding:'44px 48px', cursor:'pointer', transition:'all .25s', minWidth:260, textAlign:'center' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.16)'; e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; }}
        >
          <div style={{ width:72, height:72, borderRadius:20, background:'rgba(14,165,233,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:36 }}>🏢</div>
          <h2 style={{ fontFamily:'Poppins', color:'#fff', fontSize:22, marginBottom:10 }}>Staff Portal</h2>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:14, lineHeight:1.6, marginBottom:24 }}>Access dashboards for Admin, Manager & Staff roles with full management tools</p>
          <div style={{ background:'var(--primary)', color:'#fff', padding:'11px 28px', borderRadius:12, fontWeight:700, fontSize:14, display:'inline-block' }}>
            Staff Login →
          </div>
        </div>
      </div>

      {/* Feature strip */}
      <div style={{ display:'flex', gap:32, marginTop:52, flexWrap:'wrap', justifyContent:'center' }}>
        {[['🛒','Millions of Products'],['🚚','Fast Delivery'],['🔒','Secure Payments'],['⭐','Best Prices Guaranteed'],['📦','Easy Returns']].map(([icon, label]) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.5)', fontSize:13 }}>
            <span>{icon}</span><span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

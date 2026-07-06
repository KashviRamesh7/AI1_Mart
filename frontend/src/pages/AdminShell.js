import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { socket } from '../utils/api';
import API from '../utils/api';

const ROLE_COLORS = { superadmin:'#EF4444', admin:'#0EA5E9', manager:'#6366F1', staff:'#10B981' };
const ROLE_NAMES  = { superadmin:'Super Admin', admin:'Admin', manager:'Manager', staff:'Staff' };

const NAV = {
  superadmin:[
    { section:'Overview',  items:[{icon:'📊',label:'Dashboard',page:'dashboard'},{icon:'📈',label:'Analytics',page:'analytics'}] },
    { section:'Catalog',   items:[{icon:'📦',label:'Products',page:'products'},{icon:'🏷️',label:'Categories',page:'categories'},{icon:'💰',label:'Pricing',page:'pricing'}] },
    { section:'Operations',items:[{icon:'🛒',label:'Orders',page:'orders'},{icon:'🚚',label:'Deliveries',page:'deliveries'},{icon:'👥',label:'Customers',page:'customers'}] },
    { section:'Admin',     items:[{icon:'👔',label:'Staff',page:'staff'},{icon:'🔒',label:'Access Control',page:'access'},{icon:'⚙️',label:'Settings',page:'settings'}] },
  ],
  admin:[
    { section:'Overview',  items:[{icon:'📊',label:'Dashboard',page:'dashboard'}] },
    { section:'Operations',items:[{icon:'🛒',label:'Orders',page:'orders'},{icon:'🚚',label:'Deliveries',page:'deliveries'},{icon:'👥',label:'Customers',page:'customers'}] },
    { section:'Staff',     items:[{icon:'👔',label:'Staff',page:'staff'},{icon:'🌴',label:'Holidays',page:'holidays'},{icon:'❓',label:'Queries',page:'queries'}] },
  ],
  manager:[
    { section:'Overview',      items:[{icon:'📊',label:'Dashboard',page:'dashboard'}] },
    { section:'Staff Mgmt',    items:[{icon:'👔',label:'My Team',page:'staff'},{icon:'🌴',label:'Holidays',page:'holidays'},{icon:'❓',label:'Queries',page:'queries'},{icon:'⏰',label:'Timesheets',page:'timesheets'}] },
  ],
  staff:[
    { section:'My Space', items:[{icon:'📊',label:'My Dashboard',page:'dashboard'},{icon:'🌴',label:'Request Leave',page:'holidays'},{icon:'❓',label:'My Queries',page:'queries'},{icon:'⏰',label:'My Schedule',page:'timesheets'}] },
  ],
};

export default function AdminShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [page, setPage] = useState('dashboard');
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    socket.on('new_order',       d => { setNotifs(p => [{ msg:`New order from ${d.customer}`, t:Date.now() }, ...p.slice(0,9)]); toast(`New order from ${d.customer}!`, 'info'); });
    socket.on('holiday_request', d => { setNotifs(p => [{ msg:`Leave request: ${d.staffName}`, t:Date.now() }, ...p.slice(0,9)]); toast(`Leave request: ${d.staffName}`, 'info'); });
    socket.on('new_query',       () => toast('New staff query submitted', 'info'));
    return () => { socket.off('new_order'); socket.off('holiday_request'); socket.off('new_query'); };
  }, []);

  const nav = NAV[user?.role] || NAV.staff;
  const rColor = ROLE_COLORS[user?.role] || '#0EA5E9';

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* Sidebar */}
      <aside style={{ width:240, background:'linear-gradient(180deg,#0C1A2E 0%,#0F2D4A 100%)', color:'#fff', display:'flex', flexDirection:'column', position:'fixed', left:0, top:0, bottom:0, zIndex:50 }}>
        <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily:'Poppins', fontSize:20, fontWeight:900 }}>AI<span style={{ color:'#F59E0B' }}>1</span><span style={{ color:'#BAE6FD' }}> Mart</span></div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#10B981' }}/>
            <span style={{ fontSize:11, background:rColor, borderRadius:6, padding:'2px 8px', color:'#fff', fontWeight:700 }}>{ROLE_NAMES[user?.role]}</span>
          </div>
        </div>
        <nav style={{ flex:1, padding:'12px 8px', overflowY:'auto' }}>
          {nav.map(section => (
            <div key={section.section}>
              <div style={{ fontSize:10, letterSpacing:1.5, color:'rgba(255,255,255,0.3)', padding:'10px 8px 4px', textTransform:'uppercase', fontWeight:800 }}>{section.section}</div>
              {section.items.map(item => (
                <div key={item.page} onClick={() => setPage(item.page)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, cursor:'pointer', marginBottom:2, transition:'all .15s',
                    background: page===item.page?'rgba(14,165,233,0.25)':'transparent',
                    color: page===item.page?'#BAE6FD':'rgba(255,255,255,0.65)',
                    borderLeft: page===item.page?'3px solid #0EA5E9':'3px solid transparent' }}>
                  <span style={{ fontSize:16, width:20, textAlign:'center' }}>{item.icon}</span>
                  <span style={{ fontSize:14, fontWeight:600 }}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 16px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:rColor, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>{user?.firstName?.[0]}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{user?.email}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px 18px', cursor:'pointer', color:'rgba(255,255,255,0.45)', fontSize:13, fontWeight:600 }} onClick={() => { logout(); navigate('/'); }}>
          🚪 Logout
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft:240, flex:1, minHeight:'100vh', display:'flex', flexDirection:'column' }}>
        {/* Topbar */}
        <div style={{ background:'var(--surface)', borderBottom:'2px solid var(--border)', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:40, boxShadow:'var(--shadow)' }}>
          <h1 style={{ fontFamily:'Poppins', fontSize:18, fontWeight:700, textTransform:'capitalize' }}>{page.replace(/_/g,' ')}</h1>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ position:'relative' }}>
              <button className="icon-btn" style={{ fontSize:18, position:'relative' }} onClick={() => setShowNotifs(p => !p)}>
                🔔
                {notifs.length > 0 && <span style={{ position:'absolute', top:-4, right:-4, background:'var(--danger)', color:'#fff', borderRadius:'50%', width:16, height:16, fontSize:9, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>{Math.min(notifs.length,9)}</span>}
              </button>
              {showNotifs && (
                <div style={{ position:'absolute', right:0, top:44, width:300, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:14, boxShadow:'var(--shadow-lg)', zIndex:200, overflow:'hidden' }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>Notifications</span>
                    <span style={{ fontSize:12, color:'var(--primary)', cursor:'pointer' }} onClick={() => setNotifs([])}>Clear all</span>
                  </div>
                  {notifs.length === 0 ? <div style={{ padding:20, textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No notifications</div>
                    : notifs.map((n,i) => <div key={i} style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', fontSize:13, color:'var(--text)' }}>{n.msg}</div>)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:24, flex:1 }}>
          <AdminContent page={page} role={user?.role} toast={toast} setPage={setPage} />
        </div>
      </div>
    </div>
  );
}

/* ── Content Router ── */
function AdminContent({ page, role, toast, setPage }) {
  const [data, setData] = useState({});
  const [busy, setBusy] = useState(true);

  useEffect(() => { load(); }, [page]);

  const load = async () => {
    setBusy(true);
    try {
      if (page==='dashboard')  { const r = await API.get('/dashboard/stats'); setData(r.data); }
      if (page==='products')   { const r = await API.get('/products/admin/all'); setData({ products: r.data }); }
      if (page==='orders')     { const r = await API.get('/orders/all'); setData({ orders: r.data }); }
      if (page==='customers')  { const r = await API.get('/users'); setData({ users: r.data }); }
      if (page==='staff')      { const r = await API.get('/staff'); setData({ staff: r.data }); }
      if (page==='holidays')   { const r = await API.get('/holidays'); setData({ holidays: r.data }); }
      if (page==='queries')    { const r = await API.get('/queries'); setData({ queries: r.data }); }
    } catch (e) { console.error(e); }
    setBusy(false);
  };

  if (busy) return <div className="loading-page"><div className="spinner"/><p style={{ color:'var(--text-muted)' }}>Loading...</p></div>;

  if (page==='dashboard')    return <Dashboard stats={data} role={role} setPage={setPage} />;
  if (page==='products')     return <ProductsPage products={data.products||[]} role={role} toast={toast} onRefresh={load} />;
  if (page==='orders')       return <OrdersPage orders={data.orders||[]} toast={toast} onRefresh={load} />;
  if (page==='customers')    return <CustomersPage users={data.users||[]} toast={toast} onRefresh={load} />;
  if (page==='staff')        return <StaffPage staff={data.staff||[]} role={role} toast={toast} onRefresh={load} />;
  if (page==='holidays')     return <HolidaysPage holidays={data.holidays||[]} role={role} toast={toast} onRefresh={load} />;
  if (page==='queries')      return <QueriesPage queries={data.queries||[]} role={role} toast={toast} onRefresh={load} />;
  if (page==='analytics')    return <Analytics />;
  if (page==='pricing')      return <PricingPage toast={toast} />;
  if (page==='access')       return <AccessControl />;
  if (page==='timesheets')   return <Timesheets />;
  if (page==='settings')     return <Settings toast={toast} />;
  if (page==='deliveries')   return <Deliveries toast={toast} />;
  if (page==='categories')   return <Categories toast={toast} />;
  return <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}><div style={{ fontSize:56, marginBottom:12 }}>🚧</div><h2>Coming Soon</h2></div>;
}

/* ── Dashboard ── */
function Dashboard({ stats, role, setPage }) {
  return (
    <div className="fade-in">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))', gap:16, marginBottom:24 }}>
        {[
          { l:'Total Revenue',    v:`₹${((stats.revenue||0)/1000).toFixed(1)}K`, icon:'💰', c:'var(--primary)',   sub:'▲ 12.4% this month' },
          { l:'Total Orders',     v:stats.totalOrders||0,                        icon:'🛒', c:'var(--secondary)', sub:'▲ 8.1% this week' },
          { l:'Products',         v:stats.products||0,                           icon:'📦', c:'var(--success)',   sub:'2 added today' },
          { l:'Customers',        v:stats.customers||0,                          icon:'👥', c:'#F59E0B',          sub:'▲ 4.2%' },
          ...(role!=='staff'?[{ l:'Staff Members', v:stats.staff||0, icon:'👔', c:'var(--secondary)', sub:'Online now' }]:[]),
          { l:'Pending Leaves',   v:stats.pendingHolidays||0,                   icon:'🌴', c:'#F59E0B',          sub:'Need review' },
          { l:'Open Queries',     v:stats.openQueries||0,                        icon:'❓', c:'var(--danger)',    sub:'Need attention' },
          { l:'Delivered Today',  v:stats.delivered||0,                          icon:'✅', c:'var(--success)',   sub:'Delivered' },
        ].map(s => (
          <div key={s.l} className="stat-card" style={{ cursor:'default' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <div className="stat-label">{s.l}</div>
            <div className="stat-value" style={{ color:s.c, fontSize:24 }}>{s.v}</div>
            <div className="stat-sub" style={{ color:s.sub.includes('▲')?'var(--success)':'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div className="card">
          <h3 style={{ marginBottom:14, color:'var(--primary)', fontFamily:'Poppins' }}>📊 Sales by Category</h3>
          {[{c:'Electronics',p:42},{c:'Fashion',p:28},{c:'Home',p:15},{c:'Sports',p:8},{c:'Others',p:7}].map(({c,p}) => (
            <div key={c} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4, fontWeight:700 }}><span>{c}</span><span>{p}%</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width:`${p}%` }}/></div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ marginBottom:14, color:'var(--primary)', fontFamily:'Poppins' }}>⚡ Quick Actions</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[['➕ Add Product','products'],['🛒 Orders','orders'],['👥 Customers','customers'],['👔 Staff','staff'],['🌴 Holidays','holidays'],['❓ Queries','queries']].map(([l,p]) => (
              <div key={l} style={{ padding:12, border:'1.5px solid var(--border)', borderRadius:10, cursor:'pointer', textAlign:'center', fontSize:13, fontWeight:700, color:'var(--primary)', background:'var(--primary-xlight)', transition:'all .15s' }}
                onClick={() => setPage(p)}
                onMouseEnter={e => { e.currentTarget.style.background='var(--primary)'; e.currentTarget.style.color='#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background='var(--primary-xlight)'; e.currentTarget.style.color='var(--primary)'; }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Products Page with real images ── */
function ProductsPage({ products, role, toast, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name:'', category:'Electronics', brand:'', price:'', salePrice:'', stock:'', sku:'', emoji:'📦', imageUrl:'', description:'', status:'active' });
  const canEdit = role === 'superadmin';
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const openAdd  = () => { setEditing(null); setForm({ name:'', category:'Electronics', brand:'', price:'', salePrice:'', stock:'', sku:'', emoji:'📦', imageUrl:'', description:'', status:'active' }); setModal(true); };
  const openEdit = (p) => { setEditing(p._id); setForm({ name:p.name, category:p.category, brand:p.brand||'', price:p.price, salePrice:p.salePrice||'', stock:p.stock, sku:p.sku||'', emoji:p.emoji||'📦', imageUrl:p.imageUrl||'', description:p.description||'', status:p.status }); setModal(true); };

  const save = async () => {
    if (!form.name || !form.price) { toast('Name and price required', 'error'); return; }
    try {
      const payload = { ...form, price:+form.price, salePrice:+form.salePrice||undefined, stock:+form.stock };
      if (editing) await API.put(`/products/${editing}`, payload);
      else         await API.post('/products', payload);
      toast(editing?'Product updated!':'Product added!', 'success');
      setModal(false); onRefresh();
    } catch(e) { toast(e.response?.data?.message||'Error', 'error'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await API.delete(`/products/${id}`);
    toast('Product deleted', 'success'); onRefresh();
  };

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in">
      <div style={{ display:'flex', gap:12, marginBottom:16, alignItems:'center' }}>
        <div style={{ flex:1, maxWidth:320, display:'flex', alignItems:'center', gap:10, background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:10, padding:'8px 14px' }}>
          <span>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{ border:'none', outline:'none', background:'transparent', fontSize:14, flex:1, fontFamily:'Nunito' }}/>
        </div>
        <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:600 }}>{filtered.length} products</span>
        {canEdit && <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>}
      </div>

      {/* Product grid with real images */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16 }}>
        {filtered.map(p => <AdminProductCard key={p._id} p={p} canEdit={canEdit} onEdit={() => openEdit(p)} onDelete={() => del(p._id)} />)}
      </div>

      {modal && (
        <div className="overlay">
          <div className="modal" style={{ maxWidth:580 }}>
            <div className="modal-header"><h2>{editing?'Edit Product':'Add New Product'}</h2><button className="close-btn" onClick={() => setModal(false)}>✕</button></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Product Name *</label><input className="form-control" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. iPhone 15 Pro Max"/></div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Image URL (paste Unsplash or any image link)</label><input className="form-control" value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} placeholder="https://images.unsplash.com/..."/></div>
              {form.imageUrl && <div style={{ gridColumn:'1/-1', marginBottom:8 }}><img src={form.imageUrl} alt="" style={{ height:120, borderRadius:10, objectFit:'cover' }} onError={e=>e.target.style.display='none'}/></div>}
              <div className="form-group"><label>Category</label><select className="form-control" value={form.category} onChange={e=>set('category',e.target.value)}>{['Electronics','Fashion','Home','Sports','Books','Beauty','Toys','Food'].map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="form-group"><label>Brand</label><input className="form-control" value={form.brand} onChange={e=>set('brand',e.target.value)}/></div>
              <div className="form-group"><label>Price (₹) *</label><input className="form-control" type="number" value={form.price} onChange={e=>set('price',e.target.value)}/></div>
              <div className="form-group"><label>Sale Price (₹)</label><input className="form-control" type="number" value={form.salePrice} onChange={e=>set('salePrice',e.target.value)}/></div>
              <div className="form-group"><label>Stock Qty</label><input className="form-control" type="number" value={form.stock} onChange={e=>set('stock',e.target.value)}/></div>
              <div className="form-group"><label>SKU</label><input className="form-control" value={form.sku} onChange={e=>set('sku',e.target.value)} placeholder="e.g. APL-IP15P"/></div>
              <div className="form-group"><label>Emoji (fallback)</label><input className="form-control" value={form.emoji} onChange={e=>set('emoji',e.target.value)} placeholder="📱"/></div>
              <div className="form-group"><label>Status</label><select className="form-control" value={form.status} onChange={e=>set('status',e.target.value)}><option value="active">Active</option><option value="draft">Draft</option><option value="out_of_stock">Out of Stock</option></select></div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Description</label><textarea className="form-control" rows={3} value={form.description} onChange={e=>set('description',e.target.value)}/></div>
            </div>
            <div className="modal-footer"><button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save Product</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminProductCard({ p, canEdit, onEdit, onDelete }) {
  const [imgErr, setImgErr] = useState(false);
  const discPct = p.salePrice && p.salePrice < p.price ? Math.round((1-p.salePrice/p.price)*100) : 0;
  return (
    <div style={{ background:'var(--surface)', borderRadius:14, overflow:'hidden', border:'1.5px solid var(--border)', transition:'box-shadow .2s' }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow-lg)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
      <div style={{ height:160, position:'relative', overflow:'hidden', background:'var(--primary-xlight)' }}>
        {p.imageUrl && !imgErr
          ? <img src={p.imageUrl} alt={p.name} onError={() => setImgErr(true)} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:52 }}>{p.emoji||'📦'}</div>
        }
        {discPct > 0 && <div style={{ position:'absolute', top:8, left:8, background:'var(--danger)', color:'#fff', fontSize:10, padding:'2px 6px', borderRadius:5, fontWeight:800 }}>{discPct}% OFF</div>}
        <span className={`badge ${p.status==='active'?'badge-green':p.status==='draft'?'badge-gray':'badge-red'}`} style={{ position:'absolute', top:8, right:8 }}>{p.status}</span>
      </div>
      <div style={{ padding:12 }}>
        <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:700, marginBottom:2 }}>{p.brand} · {p.category}</div>
        <div style={{ fontSize:13, fontWeight:800, marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
          <span style={{ fontFamily:'Poppins', fontWeight:900, color:'var(--primary)' }}>₹{(p.salePrice||p.price)?.toLocaleString()}</span>
          {p.salePrice && <span style={{ fontSize:11, color:'var(--text-light)', textDecoration:'line-through' }}>₹{p.price?.toLocaleString()}</span>}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <span style={{ fontSize:12, fontWeight:700, color:p.stock<10?'var(--danger)':p.stock<30?'#F59E0B':'var(--success)' }}>Stock: {p.stock}</span>
        </div>
        {canEdit && (
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={onEdit} style={{ flex:1, padding:'7px 0', borderRadius:8, border:'1.5px solid var(--primary)', background:'var(--primary-xlight)', color:'var(--primary)', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito' }}>Edit</button>
            <button onClick={onDelete} style={{ flex:1, padding:'7px 0', borderRadius:8, border:'1.5px solid var(--border)', background:'#FEE2E2', color:'var(--danger)', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Nunito' }}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Orders ── */
function OrdersPage({ orders, toast, onRefresh }) {
  const STATUS_OPTS = ['pending','confirmed','processing','packed','shipped','out_for_delivery','delivered','cancelled'];
  const STATUS_BADGE = { delivered:'badge-green', shipped:'badge-blue', out_for_delivery:'badge-blue', pending:'badge-amber', cancelled:'badge-red', confirmed:'badge-sky', processing:'badge-purple', packed:'badge-purple' };

  const updateStatus = async (id, status) => {
    try { await API.put(`/orders/${id}/status`, { status }); toast('Order updated!', 'success'); onRefresh(); }
    catch { toast('Error', 'error'); }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom:12, fontSize:13, color:'var(--text-muted)', fontWeight:600 }}>{orders.length} orders total</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td style={{ fontWeight:700, color:'var(--primary)' }}>#{o._id?.slice(-8).toUpperCase()}</td>
                <td><div style={{ fontWeight:700 }}>{o.user?.firstName} {o.user?.lastName}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>{o.user?.email}</div></td>
                <td>
                  <div style={{ display:'flex', gap:4 }}>
                    {o.items?.slice(0,3).map((item,i) => (
                      <div key={i} style={{ width:36, height:36, borderRadius:6, overflow:'hidden', background:'var(--primary-xlight)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                        {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/> : item.emoji}
                      </div>
                    ))}
                  </div>
                </td>
                <td style={{ fontWeight:800 }}>₹{o.total?.toLocaleString()}</td>
                <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td><span className={`badge ${STATUS_BADGE[o.status]||'badge-gray'}`}>{o.status?.replace(/_/g,' ')}</span></td>
                <td>
                  <select className="form-control" style={{ width:'auto', padding:'4px 8px', fontSize:12 }} value={o.status} onChange={e => updateStatus(o._id, e.target.value)}>
                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Customers ── */
function CustomersPage({ users, toast, onRefresh }) {
  const toggle = async (id) => { await API.put(`/users/${id}/toggle`); toast('Status updated', 'success'); onRefresh(); };
  return (
    <div className="fade-in">
      <div className="table-wrap">
        <table>
          <thead><tr><th>Customer</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>{u.firstName?.[0]}</div>
                    <div><div style={{ fontWeight:700 }}>{u.firstName} {u.lastName}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>{u.email}</div></div>
                  </div>
                </td>
                <td style={{ color:'var(--text-muted)' }}>{u.phone||'—'}</td>
                <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td><span className={`badge ${u.isActive?'badge-green':'badge-red'}`}>{u.isActive?'Active':'Suspended'}</span></td>
                <td><button className="icon-btn danger" onClick={() => toggle(u._id)} title={u.isActive?'Suspend':'Activate'}>{u.isActive?'🚫':'✅'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Staff ── */
function StaffPage({ staff, role, toast, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', role:'staff' });
  const canManage = ['admin','superadmin'].includes(role);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const add = async () => {
    try { await API.post('/staff', form); toast('Staff added!', 'success'); setModal(false); onRefresh(); }
    catch(e) { toast(e.response?.data?.message||'Error', 'error'); }
  };
  const remove = async (id) => { if(!window.confirm('Remove?')) return; await API.delete(`/staff/${id}`); toast('Removed', 'success'); onRefresh(); };
  const ROLE_BADGE = { superadmin:'badge-red', admin:'badge-blue', manager:'badge-purple', staff:'badge-gray' };
  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:600 }}>{staff.length} staff members</span>
        {canManage && <button className="btn btn-primary" onClick={() => setModal(true)}>+ Add Staff</button>}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Staff Member</th><th>Role</th><th>Status</th><th>Last Login</th>{canManage&&<th>Actions</th>}</tr></thead>
          <tbody>
            {staff.map(s => (
              <tr key={s._id}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', background:ROLE_COLORS[s.role]||'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>{s.firstName?.[0]}</div>
                    <div><div style={{ fontWeight:700 }}>{s.firstName} {s.lastName}</div><div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.email}</div></div>
                  </div>
                </td>
                <td><span className={`badge ${ROLE_BADGE[s.role]||'badge-gray'}`}>{ROLE_NAMES[s.role]||s.role}</span></td>
                <td><span className={`badge ${s.isActive?'badge-green':'badge-red'}`}>{s.isActive?'Active':'Inactive'}</span></td>
                <td style={{ fontSize:12, color:'var(--text-muted)' }}>{s.lastLogin ? new Date(s.lastLogin).toLocaleDateString() : 'Never'}</td>
                {canManage&&<td>{role==='superadmin'&&<button className="icon-btn danger" onClick={() => remove(s._id)}>🗑</button>}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header"><h2>Add Staff Member</h2><button className="close-btn" onClick={() => setModal(false)}>✕</button></div>
            <div className="form-row"><div className="form-group"><label>First Name</label><input className="form-control" value={form.firstName} onChange={e=>set('firstName',e.target.value)}/></div><div className="form-group"><label>Last Name</label><input className="form-control" value={form.lastName} onChange={e=>set('lastName',e.target.value)}/></div></div>
            <div className="form-group"><label>Email</label><input className="form-control" type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></div>
            <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={e=>set('phone',e.target.value)}/></div>
            <div className="form-group"><label>Password</label><input className="form-control" type="password" value={form.password} onChange={e=>set('password',e.target.value)}/></div>
            <div className="form-group"><label>Role</label><select className="form-control" value={form.role} onChange={e=>set('role',e.target.value)}><option value="staff">Staff</option><option value="manager">Manager</option>{role==='superadmin'&&<option value="admin">Admin</option>}</select></div>
            <div className="modal-footer"><button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={add}>Add Staff</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Holidays ── */
function HolidaysPage({ holidays, role, toast, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type:'Annual', from:'', to:'', reason:'', contact:'' });
  const isManager = ['manager','admin','superadmin'].includes(role);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const submit = async () => {
    try { await API.post('/holidays', form); toast('Leave request submitted! 🌴', 'success'); setModal(false); onRefresh(); }
    catch(e) { toast(e.response?.data?.message||'Error', 'error'); }
  };
  const updateStatus = async (id, status) => { await API.put(`/holidays/${id}/status`, { status }); toast(`Leave ${status}!`, 'success'); onRefresh(); };
  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ display:'flex', gap:8 }}>
          <span className="badge badge-green">Approved: {holidays.filter(h=>h.status==='approved').length}</span>
          <span className="badge badge-amber">Pending: {holidays.filter(h=>h.status==='pending').length}</span>
          <span className="badge badge-red">Rejected: {holidays.filter(h=>h.status==='rejected').length}</span>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Request Leave</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Staff</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th>{isManager&&<th>Actions</th>}</tr></thead>
          <tbody>
            {holidays.map(h => (
              <tr key={h._id}>
                <td style={{ fontWeight:700 }}>{h.staffName||(h.staff?.firstName+' '+h.staff?.lastName)}</td>
                <td>{h.type}</td>
                <td>{new Date(h.from).toLocaleDateString()}</td>
                <td>{new Date(h.to).toLocaleDateString()}</td>
                <td style={{ fontWeight:700 }}>{h.days}</td>
                <td><span className={`badge ${h.status==='approved'?'badge-green':h.status==='pending'?'badge-amber':'badge-red'}`}>{h.status}</span></td>
                {isManager&&<td>{h.status==='pending'&&<div style={{ display:'flex', gap:6 }}>
                  <button style={{ padding:'4px 10px', borderRadius:6, border:'none', background:'var(--success)', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:12 }} onClick={() => updateStatus(h._id,'approved')}>Approve</button>
                  <button style={{ padding:'4px 10px', borderRadius:6, border:'none', background:'var(--danger)', color:'#fff', cursor:'pointer', fontWeight:700, fontSize:12 }} onClick={() => updateStatus(h._id,'rejected')}>Reject</button>
                </div>}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header"><h2>Request Leave 🌴</h2><button className="close-btn" onClick={() => setModal(false)}>✕</button></div>
            <div className="form-group"><label>Leave Type</label><select className="form-control" value={form.type} onChange={e=>set('type',e.target.value)}><option>Annual</option><option>Sick</option><option>Emergency</option><option>Unpaid</option></select></div>
            <div className="form-row"><div className="form-group"><label>From</label><input className="form-control" type="date" value={form.from} onChange={e=>set('from',e.target.value)}/></div><div className="form-group"><label>To</label><input className="form-control" type="date" value={form.to} onChange={e=>set('to',e.target.value)}/></div></div>
            <div className="form-group"><label>Reason</label><textarea className="form-control" rows={3} value={form.reason} onChange={e=>set('reason',e.target.value)}/></div>
            <div className="form-group"><label>Emergency Contact</label><input className="form-control" value={form.contact} onChange={e=>set('contact',e.target.value)}/></div>
            <div className="modal-footer"><button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={submit}>Submit</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Queries ── */
function QueriesPage({ queries, role, toast, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type:'HR', subject:'', description:'', priority:'Normal' });
  const isManager = ['manager','admin','superadmin'].includes(role);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const submit = async () => { try { await API.post('/queries', form); toast('Query submitted!', 'success'); setModal(false); onRefresh(); } catch { toast('Error','error'); } };
  const update = async (id, status) => { await API.put(`/queries/${id}`, { status }); toast('Updated!', 'success'); onRefresh(); };
  const STATUS_BADGE = { open:'badge-red', in_progress:'badge-blue', resolved:'badge-green' };
  const PRI_BADGE = { Urgent:'badge-red', Normal:'badge-sky', Low:'badge-gray' };
  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', gap:8 }}>
          <span className="badge badge-red">Open: {queries.filter(q=>q.status==='open').length}</span>
          <span className="badge badge-blue">In Progress: {queries.filter(q=>q.status==='in_progress').length}</span>
          <span className="badge badge-green">Resolved: {queries.filter(q=>q.status==='resolved').length}</span>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Query</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Staff</th><th>Type</th><th>Subject</th><th>Priority</th><th>Date</th><th>Status</th>{isManager&&<th>Update</th>}</tr></thead>
          <tbody>
            {queries.map(q => (
              <tr key={q._id}>
                <td style={{ fontWeight:700 }}>{q.staffName}</td>
                <td><span className="badge badge-gray">{q.type}</span></td>
                <td style={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{q.subject}</td>
                <td><span className={`badge ${PRI_BADGE[q.priority]||'badge-gray'}`}>{q.priority}</span></td>
                <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(q.createdAt).toLocaleDateString()}</td>
                <td><span className={`badge ${STATUS_BADGE[q.status]||'badge-gray'}`}>{q.status?.replace(/_/g,' ')}</span></td>
                {isManager&&<td><select className="form-control" style={{ width:'auto', padding:'4px 8px', fontSize:12 }} value={q.status} onChange={e=>update(q._id,e.target.value)}><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option></select></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header"><h2>Submit a Query</h2><button className="close-btn" onClick={() => setModal(false)}>✕</button></div>
            <div className="form-group"><label>Type</label><select className="form-control" value={form.type} onChange={e=>set('type',e.target.value)}><option>HR</option><option>Payroll</option><option>Technical</option><option>Schedule</option><option>Other</option></select></div>
            <div className="form-group"><label>Subject</label><input className="form-control" value={form.subject} onChange={e=>set('subject',e.target.value)}/></div>
            <div className="form-group"><label>Description</label><textarea className="form-control" rows={4} value={form.description} onChange={e=>set('description',e.target.value)}/></div>
            <div className="form-group"><label>Priority</label><select className="form-control" value={form.priority} onChange={e=>set('priority',e.target.value)}><option>Normal</option><option>Urgent</option><option>Low</option></select></div>
            <div className="modal-footer"><button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={submit}>Submit</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Simple remaining pages ── */
function Analytics() {
  return (
    <div className="fade-in">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:16, marginBottom:24 }}>
        {[{l:'Monthly Revenue',v:'₹4.2L',sub:'▲ 18%',c:'var(--primary)'},{l:'Conversion',v:'3.8%',sub:'▲ 0.4%',c:'var(--success)'},{l:'Avg Order',v:'₹2,340',sub:'▼ 2.1%',c:'#F59E0B'},{l:'Return Rate',v:'4.2%',sub:'Improving',c:'var(--secondary)'}].map(s=>(
          <div key={s.l} className="stat-card"><div className="stat-label">{s.l}</div><div className="stat-value" style={{ color:s.c,fontSize:22 }}>{s.v}</div><div className="stat-sub">{s.sub}</div></div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card">
          <h3 style={{ marginBottom:16, color:'var(--primary)', fontFamily:'Poppins' }}>Weekly Sales</h3>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => { const h=[60,75,45,80,90,100,70][i]; return (
            <div key={d} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <span style={{ width:32, fontSize:12, color:'var(--text-muted)', fontWeight:700 }}>{d}</span>
              <div style={{ flex:1, height:24, background:'var(--primary-xlight)', borderRadius:6, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${h}%`, background:'linear-gradient(90deg,var(--primary),var(--secondary))', borderRadius:6, display:'flex', alignItems:'center', paddingLeft:8 }}>
                  <span style={{ fontSize:11, color:'#fff', fontWeight:800 }}>{h}%</span>
                </div>
              </div>
            </div>
          );})}
        </div>
        <div className="card">
          <h3 style={{ marginBottom:16, color:'var(--primary)', fontFamily:'Poppins' }}>Category Split</h3>
          {[{c:'Electronics',p:42},{c:'Fashion',p:28},{c:'Home',p:15},{c:'Sports',p:8},{c:'Others',p:7}].map(({c,p}) => (
            <div key={c} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4, fontWeight:700 }}><span>{c}</span><span>{p}%</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width:`${p}%` }}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingPage({ toast }) {
  return (
    <div className="fade-in">
      <div style={{ background:'var(--primary-xlight)', border:'1.5px solid var(--border)', borderRadius:10, padding:'10px 16px', marginBottom:16, fontSize:14, color:'var(--primary-dark)', fontWeight:600 }}>
        ⚠️ Only Super Admin can change prices. Changes are real-time.
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Product</th><th>Original Price</th><th>Sale Price</th><th>Discount</th><th>Stock</th></tr></thead>
          <tbody>
            {[{e:'📱',n:'iPhone 15 Pro Max',p:159900,s:149900,st:40},{e:'👟',n:'Nike Air Max 270',p:12995,s:9999,st:80},{e:'📚',n:'Atomic Habits',p:799,s:499,st:300},{e:'🎧',n:'Sony WH-1000XM5',p:29990,s:24990,st:80}].map(pr => (
              <tr key={pr.n}>
                <td><div style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:20 }}>{pr.e}</span><span style={{ fontWeight:700 }}>{pr.n}</span></div></td>
                <td style={{ textDecoration:'line-through', color:'var(--text-muted)' }}>₹{pr.p.toLocaleString()}</td>
                <td style={{ fontWeight:800, color:'var(--success)' }}>₹{pr.s.toLocaleString()}</td>
                <td><span className="badge badge-red">{Math.round((1-pr.s/pr.p)*100)}% OFF</span></td>
                <td style={{ color:pr.st<20?'var(--danger)':'var(--success)', fontWeight:700 }}>{pr.st}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AccessControl() {
  const PERMS = [['View Products','✅','✅','✅','✅'],['Edit Products','❌','❌','❌','✅'],['Add/Delete Products','❌','❌','❌','✅'],['Adjust Pricing','❌','❌','❌','✅'],['View Orders','❌','✅','✅','✅'],['Manage Deliveries','❌','❌','✅','✅'],['View Customers','❌','❌','✅','✅'],['Suspend Customers','❌','❌','✅','✅'],['Manage Staff','❌','⚠️','⚠️','✅'],['Approve Holidays','❌','✅','✅','✅'],['Manage Queries','❌','✅','✅','✅'],['System Settings','❌','❌','❌','✅']];
  return (
    <div className="fade-in">
      <div className="table-wrap">
        <table>
          <thead><tr><th>Permission</th><th>Staff</th><th>Manager</th><th>Admin</th><th>Super Admin</th></tr></thead>
          <tbody>{PERMS.map(([p,...vals]) => <tr key={p}><td style={{ fontWeight:700 }}>{p}</td>{vals.map((v,i) => <td key={i} style={{ textAlign:'center', fontSize:16 }}>{v}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:12 }}>✅ Full · ⚠️ Partial · ❌ No access</p>
    </div>
  );
}

function Timesheets() {
  const [time, setTime] = useState(new Date());
  const [clocked, setClocked] = useState(false);
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="fade-in">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[{l:'Hours This Week',v:'38.5h',c:'var(--primary)'},{l:'This Month',v:'142h',c:'var(--secondary)'},{l:'Overtime',v:'6.5h',c:'#F59E0B'},{l:'Leave Balance',v:'12 days',c:'var(--success)'}].map(s => (
          <div key={s.l} className="stat-card"><div className="stat-label">{s.l}</div><div className="stat-value" style={{ color:s.c, fontSize:22 }}>{s.v}</div></div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card">
          <h3 style={{ marginBottom:16, color:'var(--primary)', fontFamily:'Poppins' }}>This Week</h3>
          {['Monday','Tuesday','Wednesday','Thursday','Friday'].map((d,i) => (
            <div key={d} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <span style={{ width:90, fontSize:13, fontWeight:700 }}>{d}</span>
              <span className={`badge ${i===2?'badge-amber':'badge-green'}`}>{i===2?'Day Off':'Working'}</span>
              <span style={{ marginLeft:'auto', fontSize:13, fontWeight:700, color:'var(--text-muted)' }}>{i===2?'—':'9AM–6PM · 8h'}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ textAlign:'center' }}>
          <h3 style={{ marginBottom:20, color:'var(--primary)', fontFamily:'Poppins' }}>Clock In / Out</h3>
          <div style={{ fontFamily:'Poppins', fontSize:46, fontWeight:900, color:'var(--primary)', marginBottom:8 }}>{time.toLocaleTimeString()}</div>
          <div style={{ color:'var(--text-muted)', fontSize:14, marginBottom:24 }}>{time.toDateString()}</div>
          <button className="btn btn-primary btn-lg" onClick={() => { setClocked(p => !p); }} style={{ background: clocked?'var(--danger)':'var(--primary)' }}>
            {clocked ? 'Clock Out 🚪' : 'Clock In 👋'}
          </button>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:12 }}>Last clock-in: 9:02 AM today</p>
        </div>
      </div>
    </div>
  );
}

function Deliveries({ toast }) {
  const data = [{id:'DEL-5521',order:'NX-88234',customer:'Rahul Kumar',items:'📱',status:'Out for Delivery',eta:'Today 3PM',agent:'Mohan D.'},{id:'DEL-5520',order:'NX-77123',customer:'Priya Nair',items:'👟',status:'Shipped',eta:'Tomorrow',agent:'Kumar S.'},{id:'DEL-5519',order:'NX-65432',customer:'Amit Shah',items:'📚',status:'Processing',eta:'May 10',agent:'Unassigned'},{id:'DEL-5518',order:'NX-54321',customer:'Sunita Rao',items:'🫕',status:'Delivered',eta:'Done',agent:'Ravi M.'}];
  const STATUS_BADGE = { Delivered:'badge-green','Out for Delivery':'badge-blue', Shipped:'badge-amber', Processing:'badge-gray' };
  return (
    <div className="fade-in">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 }}>
        {[{l:'Out for Delivery',v:12,c:'var(--primary)'},{l:'Shipped',v:22,c:'#F59E0B'},{l:'Delivered Today',v:48,c:'var(--success)'},{l:'Delayed',v:5,c:'var(--danger)'}].map(s=>(
          <div key={s.l} className="stat-card"><div className="stat-label">{s.l}</div><div className="stat-value" style={{ color:s.c }}>{s.v}</div></div>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Delivery ID</th><th>Order</th><th>Customer</th><th>Items</th><th>Agent</th><th>ETA</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight:700 }}>{d.id}</td>
                <td style={{ color:'var(--primary)', fontWeight:700 }}>{d.order}</td>
                <td>{d.customer}</td>
                <td style={{ fontSize:22 }}>{d.items}</td>
                <td>{d.agent}</td>
                <td style={{ fontWeight:700 }}>{d.eta}</td>
                <td><span className={`badge ${STATUS_BADGE[d.status]||'badge-gray'}`}>{d.status}</span></td>
                <td><button className="btn btn-outline btn-sm" onClick={() => toast(`Tracking ${d.id}`, 'info')}>Track</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Categories({ toast }) {
  const cats = [{n:'Electronics',p:18,e:'📱',c:'#0EA5E9'},{n:'Fashion',p:12,e:'👕',c:'#6366F1'},{n:'Home',p:9,e:'🏠',c:'#10B981'},{n:'Sports',p:8,e:'⚽',c:'#F59E0B'},{n:'Books',p:4,e:'📚',c:'#EF4444'},{n:'Beauty',p:6,e:'💄',c:'#EC4899'},{n:'Toys',p:4,e:'🧸',c:'#8B5CF6'},{n:'Food',p:5,e:'🍕',c:'#F97316'}];
  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <button className="btn btn-primary" onClick={() => toast('Add category', 'info')}>+ Add Category</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:16 }}>
        {cats.map(c => (
          <div key={c.n} className="card" style={{ textAlign:'center', cursor:'pointer', transition:'all .2s', borderTop:`4px solid ${c.c}` }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow='var(--shadow-lg)'}
            onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
            <div style={{ fontSize:40, marginBottom:10 }}>{c.e}</div>
            <div style={{ fontFamily:'Poppins', fontWeight:700, marginBottom:4 }}>{c.n}</div>
            <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:6 }}>{c.p} products</div>
            <span className="badge badge-green">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings({ toast }) {
  return (
    <div className="fade-in">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card">
          <h3 style={{ marginBottom:16, color:'var(--primary)', fontFamily:'Poppins' }}>Store Settings</h3>
          <div className="form-group"><label>Store Name</label><input className="form-control" defaultValue="AI1 Mart"/></div>
          <div className="form-group"><label>Support Email</label><input className="form-control" defaultValue="support@ai1mart.com"/></div>
          <div className="form-group"><label>Currency</label><select className="form-control"><option>INR (₹)</option><option>USD ($)</option></select></div>
          <div className="form-group"><label>GST Rate (%)</label><input className="form-control" type="number" defaultValue={18}/></div>
          <button className="btn btn-primary btn-sm" onClick={() => toast('Settings saved!', 'success')}>Save Settings</button>
        </div>
        <div className="card">
          <h3 style={{ marginBottom:16, color:'var(--primary)', fontFamily:'Poppins' }}>Change Password</h3>
          <div className="form-group"><label>Current Password</label><input className="form-control" type="password"/></div>
          <div className="form-group"><label>New Password</label><input className="form-control" type="password"/></div>
          <div className="form-group"><label>Confirm Password</label><input className="form-control" type="password"/></div>
          <button className="btn btn-primary btn-sm" onClick={() => toast('Password updated!', 'success')}>Update Password</button>
        </div>
      </div>
    </div>
  );
}

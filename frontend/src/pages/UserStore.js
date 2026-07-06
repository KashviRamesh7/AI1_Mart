import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { socket } from '../utils/api';
import API from '../utils/api';

const ALL_CATEGORIES = [
  { name:'All', icon:'🏠', sub:[] },
  { name:'Electronics', icon:'📱', sub:['Mobiles','Laptops','Headphones','TVs','Cameras'] },
  { name:'Fashion', icon:'👗', sub:["Men's Clothing","Women's Clothing","Kids' Clothing"] },
  { name:'Shoes', icon:'👟', sub:['Sports Shoes','Casual Shoes','Boots','Formal Shoes'] },
  { name:'Handbags', icon:'👜', sub:['Handbags','Accessories'] },
  { name:'Books', icon:'📚', sub:['Self Help','Finance','Business','Fiction','Biography'] },
  { name:'Home & Kitchen', icon:'🏡', sub:['Cooking Appliances','Cookware','Kitchen Tools'] },
  { name:'Furniture', icon:'🪑', sub:['Beds','Chairs','Tables'] },
  { name:'Grocery & Gourmet', icon:'🍽️', sub:['Chocolates','Tea & Coffee','Snacks','Spices'] },
  { name:'Beauty & Personal Care', icon:'💄', sub:['Skincare','Makeup','Haircare'] },
  { name:'Health & Household', icon:'💊', sub:['Health','Household Supplies'] },
  { name:'Baby Products', icon:'🍼', sub:['Baby Care','Baby Toys'] },
  { name:'Toys & Games', icon:'🧸', sub:['LEGO','Die-Cast Vehicles','Board Games'] },
  { name:'Sports & Fitness', icon:'⚽', sub:['Football','Cricket','Badminton','Basketball','Yoga','Gym Equipment','Running','Swimming'] },
  { name:'Watches & Jewellery', icon:'⌚', sub:['Smartwatches','Gold Jewellery','Casual Watches'] },
  { name:'Appliances', icon:'🌀', sub:['Refrigerators','Washing Machines','Air Conditioners','Vacuum Cleaners'] },
  { name:'Software & Video Games', icon:'🎮', sub:['Gaming Consoles','Video Games'] },
  { name:'Pet Supplies', icon:'🐕', sub:['Dog Food','Cat Food','Pet Accessories'] },
  { name:'Musical Instruments', icon:'🎸', sub:['Guitars','Pianos & Keyboards'] },
  { name:'Car & Motorbike', icon:'🚗', sub:['Tyres','Car Accessories'] },
  { name:'Office Products', icon:'🖨️', sub:['Printers','Stationery'] },
  { name:'Gardening', icon:'🌱', sub:['Seeds','Gardening Kits'] },
  { name:'Industrial & Scientific', icon:'🔧', sub:['Power Tools'] },
];

const BRANDS = ['Apple','Samsung','Nike','Adidas','Sony','Dell','HP','OnePlus','Google','Canon',
  "Levi's",'Tommy Hilfiger','Zara','Bosch','IKEA','Godrej','Philips','LG','JBL','Dyson',
  'Mamaearth','Himalaya','Nivia','Yonex','Cosco','Cadbury','Milton','Tata','Nescafe','Liforme'];

const PRICE_RANGES = [
  { l:'Under ₹500',      min:0,     max:500 },
  { l:'₹500 – ₹2,000',  min:500,   max:2000 },
  { l:'₹2,000 – ₹10,000', min:2000,max:10000 },
  { l:'₹10,000 – ₹50,000',min:10000,max:50000 },
  { l:'Above ₹50,000',  min:50000, max:9999999 },
];

const CHAT_KB = {
  'hello|hi|hey|namaste': "Hi! I'm AI1 Bot 🤖 I can help you find products, track orders, and answer any questions. What are you looking for today?",
  'iphone|ios|apple phone': "🍎 Apple iPhones available:\n• iPhone 15 Pro Max 256GB – ₹1,49,900\n• iPhone 15 Pro 128GB – ₹1,24,900\n• iPhone SE 3rd Gen – ₹43,900\nClick Electronics → Mobiles to see all!",
  'samsung|galaxy|s24': "📱 Samsung Galaxy phones:\n• Galaxy S24 Ultra – ₹1,19,999\n• Galaxy S24+ – ₹89,999\n• Galaxy A54 5G – ₹27,999\nBrowse Electronics → Mobiles!",
  'laptop|macbook|dell|hp laptop': "💻 Top laptops:\n• MacBook Pro 14\" M3 – ₹1,89,900\n• Dell XPS 15 i9 – ₹1,79,900\n• HP Spectre x360 – ₹1,39,900\n• HP Pavilion Gaming – ₹54,990\nSee Electronics → Laptops!",
  'headphone|airpods|sony wh|earphone|earbuds': "🎧 Best headphones:\n• Sony WH-1000XM5 ANC – ₹24,990\n• Apple AirPods Pro 2 – ₹22,900\n• JBL Flip 6 Speaker – ₹8,499\nCheck Electronics → Headphones!",
  'tv|television|samsung tv|sony tv|oled': "📺 Best TVs:\n• Samsung 65\" Crystal 4K – ₹69,990\n• Sony 65\" Bravia OLED – ₹1,49,990\nElectronics → TVs!",
  'cricket|bat|nivia|ss ton|mrf': "🏏 Cricket equipment:\n• MRF Genius (Virat Kohli) – ₹3,799\n• SS Ton Master English Willow – ₹4,999\n• Nivia Kashmir Willow – ₹1,799\nSports & Fitness → Cricket!",
  'football|cosco|nivia ball|soccer': "⚽ Footballs:\n• Cosco Club Pro Size 5 – ₹899\n• Nivia Force PU Size 5 – ₹1,099\nSports & Fitness → Football!",
  'badminton|yonex|racket|shuttlecock': "🏸 Badminton:\n• Yonex Astrox 99 Pro – ₹10,999\n• Victor Thruster K9900 – ₹7,499\nSports & Fitness → Badminton!",
  'yoga|mat|liforme|exercise': "🧘 Yoga mats:\n• Liforme Original 4.2mm – ₹7,499\n• Adidas Yoga Mat 6mm – ₹1,999\nSports & Fitness → Yoga!",
  'book|atomic habits|rich dad|psychology money|harry potter|novel': "📚 Bestselling books:\n• Atomic Habits – ₹499\n• Rich Dad Poor Dad – ₹299\n• Psychology of Money – ₹399\n• The Alchemist – ₹249\n• Wings of Fire – ₹199\nBrowse Books section!",
  'order|track|delivery|where is my|shipping': "📦 To track your order:\n1. Tap Orders tab at the bottom\n2. You'll see real-time status with progress bar\n3. From Confirmed → Packed → Shipped → Delivered\nNeed help with a specific order?",
  'return|refund|exchange|cancel': "🔄 Easy returns:\n• 10-day return policy\n• Go to Orders → select order → Return/Exchange\n• Refund in 3-5 working days\n• Free pickup from your doorstep",
  'payment|pay|upi|card|cod|netbanking': "💳 Payment options:\n• 💵 Cash on Delivery (COD)\n• 📱 UPI – GPay, PhonePe, Paytm\n• 💳 Credit/Debit Card\n• 🏦 Net Banking – All major banks\nAll payments are 100% secure!",
  'mic|voice|microphone|not working|voice search': "🎤 Voice search tips:\n1. Tap the 🎤 mic button next to search bar\n2. Allow microphone permission in browser\n3. Speak clearly after the beep\n4. Works ONLY in Chrome & Edge browsers\n5. Won't work in Firefox or Safari",
  'filter|price|brand|sort|category': "🔍 Filtering products:\n• Use left sidebar to filter by Price, Brand, Rating\n• Select subcategory under Department\n• Use Sort dropdown to sort results\n• Click 'Clear all' to reset all filters",
  'discount|offer|sale|coupon|deal': "🏷️ Current deals:\n• Electronics: Up to 30% off\n• Fashion: Up to 50% off\n• Books: Flat ₹200 off\nUse Price filter to find budget products!",
  'mobile|phone|smartphone|5g': "📱 Popular phones:\n• iPhone 15 Pro Max – ₹1,49,900\n• Samsung S24 Ultra – ₹1,19,999\n• OnePlus 12 – ₹57,999\n• Redmi Note 13 Pro+ – ₹24,999\n• POCO X6 Pro – ₹19,999",
  'help|support|contact|problem': "🆘 I'm here to help!\n• Email: support@ai1mart.com\n• Common topics: orders, returns, payments, products\n• Ask me anything and I'll guide you!\nWhat do you need help with?",
};
function getBotReply(msg) {
  const l = msg.toLowerCase();
  for (const [p, r] of Object.entries(CHAT_KB)) {
    if (new RegExp(p).test(l)) return r;
  }
  return "I can help with:\n📱 Phones & Electronics\n💻 Laptops\n👟 Shoes & Fashion\n📚 Books\n⚽ Sports\n🛒 Orders & Returns\n💳 Payments\n\nType what you're looking for!";
}

// Render specs based on category
function SpecsTable({ specs, category }) {
  if (!specs || Object.keys(specs).length === 0) return null;
  const icons = {
    RAM:'💾', Storage:'💿', Display:'📺', Processor:'⚡', Battery:'🔋', Camera:'📷',
    OS:'📱', Network:'📶', Weight:'⚖️', Color:'🎨', Author:'✍️', Pages:'📄',
    Publisher:'🏢', Published:'📅', ISBN:'🔢', Language:'🌐', Format:'📖', Genre:'🎭',
    Material:'🧵', Fit:'👔', Sizes:'📏', Colors:'🎨', Care:'🧺', Capacity:'🫙',
    Wattage:'⚡', Functions:'🔧', Suction:'💨', Runtime:'⏱️', Filtration:'🌬️',
    Type:'📋', NoiseCancel:'🔇', Battery:'🔋', Driver:'🔊', Codec:'🎵',
    Dimensions:'📐', Thickness:'📏', Signature:'✍️', Release:'📅',
  };
  return (
    <div style={{ marginTop:20 }}>
      <div style={{ fontFamily:'Poppins', fontWeight:700, fontSize:15, marginBottom:12, color:'var(--text)' }}>
        Product Specifications
      </div>
      <div style={{ border:'1.5px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
        {Object.entries(specs).map(([k, v], i) => (
          <div key={k} style={{ display:'flex', borderBottom: i < Object.keys(specs).length-1 ? '1px solid var(--border)' : 'none', background: i%2===0 ? 'var(--primary-xlight)' : 'var(--surface)' }}>
            <div style={{ width:160, padding:'10px 14px', fontWeight:700, fontSize:13, color:'var(--text-muted)', flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
              <span>{icons[k]||'•'}</span>{k}
            </div>
            <div style={{ flex:1, padding:'10px 14px', fontSize:13, color:'var(--text)', fontWeight:600 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserStore() {
  const { user, logout } = useAuth();
  const toast  = useToast();
  const navigate = useNavigate();

  const [view,     setView]     = useState('home');
  const [selProd,  setSelProd]  = useState(null);
  const [selImg,   setSelImg]   = useState(0);
  const [products, setProducts] = useState([]);
  const [cart,     setCart]     = useState({ items:[] });
  const [orders,   setOrders]   = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [cat,      setCat]      = useState('All');
  const [subCat,   setSubCat]   = useState('');
  const [search,   setSearch]   = useState('');
  const [sort,     setSort]     = useState('');
  const [selBrands,setSelBrands]= useState([]);
  const [minRat,   setMinRat]   = useState(0);
  const [priceR,   setPriceR]   = useState({ min:0, max:9999999 });
  const [custMin,  setCustMin]  = useState('');
  const [custMax,  setCustMax]  = useState('');
  const [qty,      setQty]      = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [successOrd,  setSuccessOrd]   = useState(null);
  const [liveLabel,   setLiveLabel]    = useState('');
  const [profileTab,  setProfileTab]   = useState('info');
  const [chatOpen,    setChatOpen]     = useState(false);
  const [chatMsgs,    setChatMsgs]     = useState([{ from:'bot', text:"Hi! I'm AI1 Bot 🤖\nAsk me about products, orders, returns, or payments!" }]);
  const [chatInput,   setChatInput]    = useState('');
  const [listening,   setListening]    = useState(false);
  const chatEndRef = useRef(null);
  const recogRef   = useRef(null);

  const fetchProducts = useCallback(async () => {
    try {
      const params = {};
      if (cat !== 'All') params.cat = cat;
      if (search)        params.search = search;
      if (sort)          params.sort = sort;
      const { data } = await API.get('/products', { params });
      let res = data;
      if (subCat)           res = res.filter(p => p.subcategory === subCat);
      if (selBrands.length) res = res.filter(p => selBrands.includes(p.brand));
      if (minRat)           res = res.filter(p => (p.rating||0) >= minRat);
      res = res.filter(p => { const pr = p.salePrice||p.price; return pr >= priceR.min && pr <= priceR.max; });
      setProducts(res);
    } catch { toast('Could not load products', 'error'); }
  }, [cat, subCat, search, sort, selBrands, minRat, priceR]);

  const fetchCart   = async () => { try { const { data } = await API.get('/cart'); setCart(data || { items:[] }); } catch {} };
  const fetchOrders = async () => { try { const { data } = await API.get('/orders/my'); setOrders(data); } catch {} };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCart(), fetchOrders()]).finally(() => setLoading(false));
  }, [fetchProducts]);

  useEffect(() => {
    const onProd = ev => { setLiveLabel({created:'New product added!',updated:'Product updated!',deleted:'Product removed.'}[ev.type]||''); fetchProducts(); setTimeout(()=>setLiveLabel(''),4000); };
    socket.on('product_update', onProd);
    socket.on('order_status_update', fetchOrders);
    return () => { socket.off('product_update', onProd); socket.off('order_status_update', fetchOrders); };
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:'smooth' }); }, [chatMsgs]);

  // ── WORKING VOICE SEARCH ──
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast('Voice search works only in Chrome or Edge browser!', 'error');
      return;
    }
    if (listening) {
      recogRef.current?.abort();
      setListening(false);
      return;
    }
    try {
      const r = new SR();
      r.lang = 'en-IN';
      r.continuous = false;
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.onstart = () => { setListening(true); toast('🎤 Listening... speak now!', 'info'); };
      r.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setSearch(transcript);
        setListening(false);
        toast(`🔍 Searching: "${transcript}"`, 'success');
      };
      r.onerror = (e) => {
        setListening(false);
        if (e.error === 'not-allowed') toast('❌ Microphone permission denied. Allow mic in browser settings.', 'error');
        else if (e.error === 'no-speech') toast('No speech detected. Try again.', 'error');
        else toast('Voice search error: ' + e.error, 'error');
      };
      r.onend = () => setListening(false);
      recogRef.current = r;
      r.start();
    } catch(e) {
      toast('Could not start voice search', 'error');
      setListening(false);
    }
  };

  // ── CHATBOT ──
  const sendChat = () => {
    const msg = chatInput.trim();
    if (!msg) return;
    setChatMsgs(p => [...p, { from:'user', text:msg }]);
    setChatInput('');
    setTimeout(() => setChatMsgs(p => [...p, { from:'bot', text:getBotReply(msg) }]), 600);
  };

  // ── CART OPS ──
  const addToCart = async (productId, q=1) => {
    try { const { data } = await API.post('/cart/add', { productId, qty:q }); setCart(data); toast('Added to cart! 🛒', 'success'); }
    catch { toast('Could not add to cart', 'error'); }
  };
  const updateQty  = async (productId, q) => { try { const { data } = await API.put('/cart/update', { productId, qty:q }); setCart(data); } catch {} };
  const removeItem = async (productId) => { try { const { data } = await API.delete(`/cart/remove/${productId}`); setCart(data); } catch {} };
  const toggleWishlist = id => {
    setWishlist(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
    toast(wishlist.includes(id) ? 'Removed from wishlist' : '❤️ Added to wishlist!', 'info');
  };
  const placeOrder = async (address, payMethod, payDetails) => {
    try {
      const items = cart.items.map(i => ({ product:i.product, name:i.name, emoji:i.emoji, price:i.price, qty:i.qty }));
      const subtotal = cart.items.reduce((s,i) => s + i.price*i.qty, 0);
      const { data } = await API.post('/orders', { items, address, payment:{ method:payMethod, status:payMethod==='COD'?'pending':'paid' }, subtotal, total:subtotal, discount:0, delivery:0 });
      setCart({ items:[] }); setSuccessOrd(data); setCheckoutOpen(false); fetchOrders();
      toast('Order placed! 🎉', 'success');
    } catch { toast('Failed to place order', 'error'); }
  };

  const cartCount = cart.items?.reduce((s,i) => s+i.qty, 0) || 0;
  const cartTotal = cart.items?.reduce((s,i) => s+i.price*i.qty, 0) || 0;
  const discPct   = p => p.salePrice && p.salePrice<p.price ? Math.round((1-p.salePrice/p.price)*100) : 0;
  const px        = p => p.salePrice || p.price;
  const catObj    = ALL_CATEGORIES.find(c => c.name === cat) || ALL_CATEGORIES[0];
  const visible   = view==='wishlist' ? products.filter(p=>wishlist.includes(p._id)) : products;
  const resetFilters = () => { setSelBrands([]); setMinRat(0); setPriceR({min:0,max:9999999}); setCustMin(''); setCustMax(''); setSubCat(''); };

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--bg)' }}>

      {/* LIVE BANNER */}
      {liveLabel && <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:999, background:'var(--primary)', color:'#fff', textAlign:'center', padding:'8px', fontSize:13, fontWeight:700 }}>🔴 LIVE — {liveLabel}</div>}

      {/* NAV */}
      <nav style={{ background:'var(--surface)', borderBottom:'2px solid var(--border)', padding:'0 16px', height:60, display:'flex', alignItems:'center', gap:10, position:'sticky', top:liveLabel?32:0, zIndex:100, boxShadow:'var(--shadow)' }}>
        <div style={{ fontFamily:'Poppins', fontSize:20, fontWeight:900, cursor:'pointer', flexShrink:0 }}
          onClick={() => { setView('home'); setCat('All'); setSearch(''); setSubCat(''); resetFilters(); }}>
          AI<span style={{color:'#F59E0B'}}>1</span><span style={{color:'var(--primary)'}}> Mart</span>
        </div>

        {/* SEARCH + VOICE */}
        <div style={{ flex:1, display:'flex', maxWidth:560 }}>
          <div style={{ position:'relative', flex:1 }}>
            <input
              className="form-control"
              placeholder={listening ? '🎤 Listening... speak now!' : '🔍 Search products, brands, categories...'}
              style={{ paddingLeft:14, borderRadius:'24px 0 0 24px', height:40, border:`2px solid ${listening?'var(--danger)':'var(--primary)'}`, borderRight:'none', fontSize:14, transition:'all .2s' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter') fetchProducts(); }}
            />
          </div>
          <button onClick={() => { if(search) { fetchProducts(); } }}
            style={{ height:40, padding:'0 14px', background:'var(--primary)', border:`2px solid var(--primary)`, borderLeft:'none', borderRight:'none', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:'Nunito' }}>
            Search
          </button>
          <button onClick={startVoice} title={listening ? 'Stop listening' : 'Voice Search (Chrome/Edge only)'}
            style={{ width:42, height:40, borderRadius:'0 24px 24px 0', border:`2px solid ${listening?'var(--danger)':'var(--primary)'}`, borderLeft:'none', background:listening?'#EF4444':'var(--primary)', color:'#fff', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
            {listening ? '⏹' : '🎤'}
          </button>
        </div>

        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <button onClick={() => setView('wishlist')}
            style={{ background:view==='wishlist'?'var(--primary-xlight)':'none', border:'1.5px solid var(--border)', borderRadius:10, padding:'6px 10px', cursor:'pointer', fontSize:13, fontWeight:700, color:view==='wishlist'?'var(--primary)':'var(--text-muted)', display:'flex', alignItems:'center', gap:4 }}>
            {wishlist.length>0 ? `❤️ ${wishlist.length}` : '♡'}
          </button>
          <button onClick={() => setCartOpen(true)}
            style={{ background:'var(--primary)', border:'none', borderRadius:10, padding:'8px 14px', cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:6 }}>
            🛒 {cartCount>0 && <span style={{ background:'#fff', color:'var(--primary)', borderRadius:'50%', width:18, height:18, fontSize:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>{cartCount}</span>}
          </button>
          <div onClick={() => setView('profile')}
            style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', padding:'5px 8px', borderRadius:10, border:'1.5px solid var(--border)' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--primary)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:12 }}>
              {user?.firstName?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      {/* CATEGORY SCROLL BAR */}
      <div style={{ background:'var(--surface)', borderBottom:'1.5px solid var(--border)', padding:'8px 16px', display:'flex', gap:6, overflowX:'auto' }}>
        {ALL_CATEGORIES.map(c => (
          <button key={c.name} onClick={() => { setCat(c.name); setSubCat(''); setView('home'); resetFilters(); }}
            style={{ padding:'5px 12px', borderRadius:20, border:`1.5px solid ${cat===c.name?'var(--primary)':'var(--border)'}`, background:cat===c.name?'var(--primary)':'var(--surface)', color:cat===c.name?'#fff':'var(--text)', cursor:'pointer', fontSize:12, fontWeight:700, whiteSpace:'nowrap', transition:'all .15s', fontFamily:'Nunito', flexShrink:0, display:'flex', alignItems:'center', gap:4 }}>
            <span>{c.icon}</span><span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* BODY */}
      <div style={{ display:'flex', flex:1 }}>

        {/* SIDEBAR */}
        <aside style={{ width:220, flexShrink:0, padding:'14px 12px', borderRight:'1.5px solid var(--border)', background:'var(--surface)', overflowY:'auto', position:'sticky', top:108, maxHeight:'calc(100vh - 108px)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontFamily:'Poppins', fontWeight:700, fontSize:14 }}>Filters</span>
            <button onClick={resetFilters} style={{ fontSize:12, color:'var(--primary)', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>Clear all</button>
          </div>

          {catObj.sub.length > 0 && (
            <><div style={{ fontWeight:700, fontSize:12, marginBottom:8, color:'var(--text)', textTransform:'uppercase', letterSpacing:.5 }}>Department</div>
            {['All',...catObj.sub].map(s => (
              <label key={s} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, cursor:'pointer', marginBottom:5 }}>
                <input type="radio" name="sub" checked={s==='All'?!subCat:subCat===s} onChange={() => setSubCat(s==='All'?'':s)} style={{ accentColor:'var(--primary)' }}/>{s}
              </label>
            ))}
            <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'10px 0' }}/></>
          )}

          <div style={{ fontWeight:700, fontSize:12, marginBottom:8, textTransform:'uppercase', letterSpacing:.5 }}>Price</div>
          <label style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, cursor:'pointer', marginBottom:5 }}>
            <input type="radio" name="pr" checked={priceR.max===9999999&&priceR.min===0} onChange={() => setPriceR({min:0,max:9999999})} style={{ accentColor:'var(--primary)' }}/>All Prices
          </label>
          {PRICE_RANGES.map(r => (
            <label key={r.l} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, cursor:'pointer', marginBottom:5 }}>
              <input type="radio" name="pr" checked={priceR.min===r.min&&priceR.max===r.max} onChange={() => setPriceR({min:r.min,max:r.max})} style={{ accentColor:'var(--primary)' }}/>{r.l}
            </label>
          ))}
          <div style={{ display:'flex', gap:4, marginTop:8, marginBottom:14 }}>
            <input style={{ flex:1, padding:'4px 6px', border:'1.5px solid var(--border)', borderRadius:6, fontSize:12, fontFamily:'Nunito', outline:'none' }} placeholder="Min ₹" value={custMin} onChange={e=>setCustMin(e.target.value)}/>
            <input style={{ flex:1, padding:'4px 6px', border:'1.5px solid var(--border)', borderRadius:6, fontSize:12, fontFamily:'Nunito', outline:'none' }} placeholder="Max ₹" value={custMax} onChange={e=>setCustMax(e.target.value)}/>
            <button onClick={() => { const mn=parseInt(custMin)||0, mx=parseInt(custMax)||9999999; setPriceR({min:mn,max:mx}); }} style={{ padding:'4px 7px', borderRadius:6, border:'none', background:'var(--primary)', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer' }}>Go</button>
          </div>
          <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'10px 0' }}/>

          <div style={{ fontWeight:700, fontSize:12, marginBottom:8, textTransform:'uppercase', letterSpacing:.5 }}>Brands</div>
          {BRANDS.map(b => (
            <label key={b} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, cursor:'pointer', marginBottom:5 }}>
              <input type="checkbox" checked={selBrands.includes(b)} onChange={() => setSelBrands(p=>p.includes(b)?p.filter(x=>x!==b):[...p,b])} style={{ accentColor:'var(--primary)' }}/>{b}
            </label>
          ))}
          <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'10px 0' }}/>

          <div style={{ fontWeight:700, fontSize:12, marginBottom:8, textTransform:'uppercase', letterSpacing:.5 }}>Customer Review</div>
          <label style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, cursor:'pointer', marginBottom:5 }}>
            <input type="radio" name="rat" checked={minRat===0} onChange={() => setMinRat(0)} style={{ accentColor:'var(--primary)' }}/>All Ratings
          </label>
          {[4,3,2,1].map(r => (
            <label key={r} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, cursor:'pointer', marginBottom:5 }}>
              <input type="radio" name="rat" checked={minRat===r} onChange={() => setMinRat(r)} style={{ accentColor:'var(--primary)' }}/>
              <span style={{ color:'#F59E0B' }}>{'★'.repeat(r)}{'☆'.repeat(4-r)}</span> & up
            </label>
          ))}
          <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'10px 0' }}/>

          <div style={{ fontWeight:700, fontSize:12, marginBottom:8, textTransform:'uppercase', letterSpacing:.5 }}>Sort By</div>
          {[['','Featured'],['price_asc','Price: Low to High'],['price_desc','Price: High to Low'],['rating','Avg. Customer Review']].map(([v,l]) => (
            <label key={v} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, cursor:'pointer', marginBottom:5 }}>
              <input type="radio" name="srt" checked={sort===v} onChange={() => setSort(v)} style={{ accentColor:'var(--primary)' }}/>{l}
            </label>
          ))}
        </aside>

        {/* MAIN */}
        <main style={{ flex:1, minWidth:0, padding:20, paddingBottom:80 }}>

          {/* ═══ PRODUCT DETAIL ═══ */}
          {view==='detail' && selProd && (
            <div className="fade-in">
              <button onClick={() => { setView('home'); setSelProd(null); window.scrollTo(0,0); }}
                style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'var(--primary)', fontWeight:700, fontSize:14, marginBottom:12, fontFamily:'Nunito' }}>
                ← Back
              </button>
              {/* Breadcrumb */}
              <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:16, fontWeight:600 }}>
                Home › {selProd.category} {selProd.subcategory?`› ${selProd.subcategory}`:''} › <span style={{ color:'var(--text)' }}>{selProd.name}</span>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:28, marginBottom:24 }}>
                {/* Images */}
                <div>
                  <div style={{ borderRadius:16, overflow:'hidden', border:'1.5px solid var(--border)', marginBottom:10, background:'var(--primary-xlight)', height:380, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <ImgOrEmoji src={selProd.images?.[selImg]} emoji={selProd.emoji} alt={selProd.name} style={{ width:'100%', height:'100%', objectFit:'contain' }}/>
                  </div>
                  {selProd.images?.length > 1 && (
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {selProd.images.map((img, i) => (
                        <div key={i} onClick={() => setSelImg(i)}
                          style={{ width:64, height:64, borderRadius:8, overflow:'hidden', border:`2px solid ${selImg===i?'var(--primary)':'var(--border)'}`, cursor:'pointer', background:'var(--primary-xlight)', flexShrink:0 }}>
                          <ImgOrEmoji src={img} emoji={selProd.emoji} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <div style={{ fontSize:11, color:'var(--primary)', fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>
                    {selProd.brand} · {selProd.subcategory || selProd.category}
                  </div>
                  <h1 style={{ fontFamily:'Poppins', fontSize:21, fontWeight:700, marginBottom:10, lineHeight:1.3, color:'var(--text)' }}>{selProd.name}</h1>

                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                    <span style={{ background:'#F59E0B', color:'#fff', padding:'3px 8px', borderRadius:6, fontSize:13, fontWeight:800 }}>
                      ★ {(selProd.rating||4.0).toFixed(1)}
                    </span>
                    <span style={{ fontSize:13, color:'var(--primary)', fontWeight:700 }}>{(selProd.numReviews||0).toLocaleString()} ratings</span>
                    {selProd.stock > 0 && selProd.stock <= 10 && (
                      <span style={{ background:'#FEE2E2', color:'#DC2626', fontSize:12, padding:'2px 8px', borderRadius:6, fontWeight:700 }}>Only {selProd.stock} left!</span>
                    )}
                  </div>
                  <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'12px 0' }}/>

                  {/* Price */}
                  <div style={{ marginBottom:12 }}>
                    <span style={{ fontFamily:'Poppins', fontSize:32, fontWeight:900, color:'var(--primary)' }}>₹{px(selProd).toLocaleString()}</span>
                    {selProd.salePrice && selProd.salePrice < selProd.price && (
                      <span style={{ marginLeft:12, fontSize:14 }}>
                        <span style={{ color:'var(--text-muted)', textDecoration:'line-through' }}>₹{selProd.price.toLocaleString()}</span>
                        <span style={{ color:'#16A34A', fontWeight:700, marginLeft:6 }}>{discPct(selProd)}% off</span>
                        <span style={{ color:'#16A34A', fontSize:12, marginLeft:6 }}>You save ₹{(selProd.price-selProd.salePrice).toLocaleString()}</span>
                      </span>
                    )}
                  </div>
                  <div style={{ background:'var(--primary-xlight)', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:13, color:'var(--primary-dark)', fontWeight:700, display:'flex', gap:14, flexWrap:'wrap' }}>
                    <span>✅ Incl. all taxes</span>
                    <span>🚚 Free delivery</span>
                    <span>🔄 10-day returns</span>
                    <span>🔒 Secure checkout</span>
                  </div>

                  {/* Stock */}
                  <div style={{ marginBottom:14, fontSize:14 }}>
                    <strong>Availability: </strong>
                    <span style={{ color:selProd.stock>0?'#16A34A':'#DC2626', fontWeight:700 }}>
                      {selProd.stock>0 ? `In Stock (${selProd.stock} units)` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Quantity selector */}
                  {selProd.stock > 0 && (
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                      <span style={{ fontSize:14, fontWeight:700 }}>Qty:</span>
                      <div style={{ display:'flex', alignItems:'center', border:'1.5px solid var(--border)', borderRadius:8, overflow:'hidden' }}>
                        <button onClick={() => setQty(q=>Math.max(1,q-1))} style={{ width:32, height:36, border:'none', background:'var(--bg)', cursor:'pointer', fontSize:16, fontWeight:800 }}>−</button>
                        <span style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, borderLeft:'1px solid var(--border)', borderRight:'1px solid var(--border)' }}>{qty}</span>
                        <button onClick={() => setQty(q=>Math.min(selProd.stock,q+1))} style={{ width:32, height:36, border:'none', background:'var(--bg)', cursor:'pointer', fontSize:16, fontWeight:800 }}>+</button>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div style={{ display:'flex', gap:12, marginBottom:10 }}>
                    <button disabled={selProd.stock===0} onClick={() => addToCart(selProd._id, qty)}
                      style={{ flex:1, padding:'13px 0', borderRadius:12, border:'2px solid var(--primary)', background:'var(--primary-xlight)', color:'var(--primary)', fontWeight:800, fontSize:15, cursor:selProd.stock===0?'not-allowed':'pointer', fontFamily:'Nunito', opacity:selProd.stock===0?.4:1 }}>
                      🛒 Add to Cart
                    </button>
                    <button disabled={selProd.stock===0} onClick={() => { if(selProd.stock>0){ addToCart(selProd._id,qty); setCartOpen(true); } }}
                      style={{ flex:1, padding:'13px 0', borderRadius:12, border:'none', background:'var(--primary)', color:'#fff', fontWeight:800, fontSize:15, cursor:selProd.stock===0?'not-allowed':'pointer', fontFamily:'Nunito', opacity:selProd.stock===0?.4:1 }}>
                      ⚡ Buy Now
                    </button>
                  </div>
                  <button onClick={() => toggleWishlist(selProd._id)}
                    style={{ width:'100%', padding:'10px 0', borderRadius:12, border:'1.5px solid var(--border)', background:wishlist.includes(selProd._id)?'#FFF0F0':'var(--surface)', color:wishlist.includes(selProd._id)?'#DC2626':'var(--text-muted)', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Nunito', marginBottom:20 }}>
                    {wishlist.includes(selProd._id)?'❤️ Saved to Wishlist':'♡ Save to Wishlist'}
                  </button>

                  {/* About */}
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontFamily:'Poppins', fontWeight:700, fontSize:15, marginBottom:8 }}>About this item</div>
                    <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.8, whiteSpace:'pre-line' }}>{selProd.description}</p>
                  </div>

                  {/* Features */}
                  {selProd.features?.length > 0 && (
                    <div>
                      <div style={{ fontFamily:'Poppins', fontWeight:700, fontSize:15, marginBottom:10 }}>Key Features</div>
                      <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:7 }}>
                        {selProd.features.map((f,i) => (
                          <li key={i} style={{ fontSize:14, display:'flex', alignItems:'flex-start', gap:8 }}>
                            <span style={{ color:'#16A34A', fontWeight:800, flexShrink:0, marginTop:1 }}>✓</span><span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* SPECS TABLE */}
              <SpecsTable specs={selProd.specs} category={selProd.category}/>

              {/* Similar */}
              {products.filter(p=>p._id!==selProd._id&&p.category===selProd.category).length > 0 && (
                <div style={{ marginTop:32 }}>
                  <h3 style={{ fontFamily:'Poppins', fontSize:18, marginBottom:16, color:'var(--text)' }}>Customers also viewed</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14 }}>
                    {products.filter(p=>p._id!==selProd._id&&p.category===selProd.category).slice(0,6).map(p=>(
                      <ProductCard key={p._id} p={p} inWishlist={wishlist.includes(p._id)} discPct={discPct(p)} px={px(p)}
                        onWishlist={()=>toggleWishlist(p._id)} onAdd={()=>addToCart(p._id)}
                        onBuy={()=>{addToCart(p._id);setCartOpen(true);}}
                        onClick={()=>{setSelProd(p);setSelImg(0);setQty(1);window.scrollTo(0,0);}}/>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ HOME / WISHLIST ═══ */}
          {(view==='home'||view==='wishlist') && (
            <div className="fade-in">
              {view==='home' && !search && cat==='All' && (
                <div style={{ background:'linear-gradient(135deg,#0C1A2E,#0EA5E9)', borderRadius:18, padding:'28px 36px', marginBottom:24, color:'#fff', position:'relative', overflow:'hidden' }}>
                  <h1 style={{ fontFamily:'Poppins', fontSize:26, fontWeight:800, marginBottom:8, lineHeight:1.2 }}>Shop Everything You Love 🎯</h1>
                  <p style={{ fontSize:14, opacity:.8, marginBottom:16 }}>50+ categories · Real product images · Best prices · Fast delivery</p>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {['Electronics','Sports & Fitness','Books','Beauty & Personal Care','Grocery & Gourmet'].map(c=>(
                      <button key={c} onClick={()=>setCat(c)} style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', padding:'6px 14px', borderRadius:20, cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:'Nunito' }}>{c}</button>
                    ))}
                  </div>
                  <div style={{ position:'absolute', right:36, top:'50%', transform:'translateY(-50%)', fontSize:70, opacity:.1 }}>🛍️</div>
                </div>
              )}

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h2 style={{ fontFamily:'Poppins', fontSize:17, fontWeight:700 }}>
                  {view==='wishlist'?'My Wishlist ❤️':search?`Results for "${search}"`:cat!=='All'?cat:'All Products'}
                  {subCat&&<span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:500 }}> › {subCat}</span>}
                </h2>
                <span style={{ fontSize:13, color:'var(--text-muted)', fontWeight:600 }}>{visible.length} results</span>
              </div>

              {loading ? (
                <div style={{ textAlign:'center', padding:'80px 0' }}><div className="spinner" style={{ width:48, height:48, margin:'auto' }}/></div>
              ) : visible.length===0 ? (
                <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}>
                  <div style={{ fontSize:56, marginBottom:12 }}>🔍</div>
                  <h3>No products found</h3>
                  <p style={{ marginTop:8, fontSize:14 }}>Try different search or clear filters</p>
                  <button className="btn btn-primary" style={{ marginTop:16 }} onClick={()=>{setCat('All');setSearch('');resetFilters();}}>Browse All</button>
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(195px,1fr))', gap:16 }}>
                  {visible.map(p=>(
                    <ProductCard key={p._id} p={p} inWishlist={wishlist.includes(p._id)} discPct={discPct(p)} px={px(p)}
                      onWishlist={()=>toggleWishlist(p._id)} onAdd={()=>addToCart(p._id)}
                      onBuy={()=>{addToCart(p._id);setCartOpen(true);}}
                      onClick={()=>{setSelProd(p);setSelImg(0);setQty(1);setView('detail');window.scrollTo(0,0);}}/>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ ORDERS ═══ */}
          {view==='orders' && (
            <div className="fade-in">
              <h2 style={{ fontFamily:'Poppins', fontSize:20, fontWeight:700, marginBottom:20 }}>My Orders <span style={{ fontSize:14, color:'var(--text-muted)', fontWeight:500 }}>({orders.length})</span></h2>
              {orders.length===0 ? (
                <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}>
                  <div style={{ fontSize:56, marginBottom:12 }}>📦</div>
                  <h3>No orders yet</h3>
                  <button className="btn btn-primary" style={{ marginTop:16 }} onClick={()=>setView('home')}>Start Shopping</button>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:14, maxWidth:680 }}>
                  {orders.map(o=><OrderCard key={o._id} order={o}/>)}
                </div>
              )}
            </div>
          )}

          {/* ═══ PROFILE ═══ */}
          {view==='profile' && (
            <div className="fade-in">
              <h2 style={{ fontFamily:'Poppins', fontSize:20, fontWeight:700, marginBottom:16 }}>My Account</h2>
              <div className="tab-bar" style={{ maxWidth:420, marginBottom:20 }}>
                {[['info','Personal Info'],['address','Addresses'],['payment','Payments'],['settings','Settings']].map(([k,l])=>(
                  <button key={k} className={`tab-btn ${profileTab===k?'active':''}`} onClick={()=>setProfileTab(k)}>{l}</button>
                ))}
              </div>
              {profileTab==='info' && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                  <div className="card">
                    <h3 style={{ marginBottom:14, color:'var(--primary)' }}>Personal Info</h3>
                    <div className="form-row"><div className="form-group"><label>First Name</label><input className="form-control" defaultValue={user?.firstName}/></div><div className="form-group"><label>Last Name</label><input className="form-control" defaultValue={user?.lastName}/></div></div>
                    <div className="form-group"><label>Email</label><input className="form-control" defaultValue={user?.email}/></div>
                    <div className="form-group"><label>Phone</label><input className="form-control" defaultValue={user?.phone}/></div>
                    <button className="btn btn-primary btn-sm">Update Profile</button>
                    <hr className="divider" style={{ margin:'14px 0' }}/>
                    <button className="btn btn-danger btn-sm" onClick={()=>{logout();navigate('/');}}>Logout</button>
                  </div>
                  <div className="card">
                    <h3 style={{ marginBottom:14, color:'var(--primary)' }}>Change Password</h3>
                    <div className="form-group"><label>Current Password</label><input className="form-control" type="password"/></div>
                    <div className="form-group"><label>New Password</label><input className="form-control" type="password"/></div>
                    <div className="form-group"><label>Confirm Password</label><input className="form-control" type="password"/></div>
                    <button className="btn btn-primary btn-sm">Update Password</button>
                  </div>
                </div>
              )}
              {profileTab==='address' && (
                <div className="card" style={{ maxWidth:480 }}>
                  <h3 style={{ marginBottom:14, color:'var(--primary)' }}>Saved Addresses</h3>
                  <div style={{ border:'1.5px solid var(--border)', borderRadius:10, padding:14, marginBottom:10 }}>
                    <span className="badge badge-sky">Home</span>
                    <p style={{ fontSize:14, color:'var(--text-muted)', marginTop:8 }}>42, MG Road, Bangalore 560001, Karnataka</p>
                  </div>
                  <button className="btn btn-outline btn-sm">+ Add Address</button>
                </div>
              )}
              {profileTab==='payment' && (
                <div className="card" style={{ maxWidth:480 }}>
                  <h3 style={{ marginBottom:14, color:'var(--primary)' }}>Payment Methods</h3>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:14, border:'1.5px solid var(--border)', borderRadius:10, marginBottom:10 }}>
                    <span style={{ fontSize:26 }}>💳</span>
                    <div><p style={{ fontWeight:700, fontSize:13 }}>•••• •••• •••• 4242</p><p style={{ fontSize:12, color:'var(--text-muted)' }}>Visa · Expires 08/26</p></div>
                    <span className="badge badge-green" style={{ marginLeft:'auto' }}>Default</span>
                  </div>
                  <button className="btn btn-outline btn-sm">+ Add Payment Method</button>
                </div>
              )}
              {profileTab==='settings' && (
                <div className="card" style={{ maxWidth:480 }}>
                  <h3 style={{ marginBottom:14, color:'var(--primary)' }}>Preferences</h3>
                  {[['Email Notifications',true],['SMS Order Updates',false],['Promotional Offers',true],['Two-Factor Auth',false]].map(([l,d])=>(
                    <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid var(--border)' }}>
                      <span style={{ fontSize:14, fontWeight:600 }}>{l}</span>
                      <input type="checkbox" defaultChecked={d} style={{ accentColor:'var(--primary)', width:18, height:18 }}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'var(--surface)', borderTop:'2px solid var(--border)', display:'flex', zIndex:90 }}>
        {[['🏠','Home','home'],['📦','Orders','orders'],['🛒','Cart','cart'],['👤','Account','profile']].map(([icon,label,v])=>(
          <button key={v} onClick={()=>v==='cart'?setCartOpen(true):setView(v)}
            style={{ flex:1, padding:'10px 0', background:'none', border:'none', cursor:'pointer', fontSize:11, fontWeight:700, color:view===v?'var(--primary)':'var(--text-muted)', fontFamily:'Nunito', display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
            <span style={{ fontSize:20 }}>{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* CART PANEL */}
      {cartOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(12,26,46,0.5)', zIndex:200, display:'flex', justifyContent:'flex-end' }}
          onClick={e=>{if(e.target===e.currentTarget)setCartOpen(false);}}>
          <div style={{ background:'var(--surface)', width:400, height:'100%', display:'flex', flexDirection:'column', padding:22, overflowY:'auto', boxShadow:'-4px 0 24px rgba(0,0,0,0.15)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <h2 style={{ fontFamily:'Poppins', fontSize:19 }}>Cart <span style={{ fontSize:13, color:'var(--text-muted)', fontFamily:'Nunito' }}>({cartCount} items)</span></h2>
              <button className="close-btn" onClick={()=>setCartOpen(false)}>✕</button>
            </div>
            {!cart.items?.length ? (
              <div style={{ textAlign:'center', flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <div style={{ fontSize:52, marginBottom:12 }}>🛒</div>
                <h3 style={{ color:'var(--text-muted)' }}>Cart is empty</h3>
                <button className="btn btn-primary" style={{ marginTop:14 }} onClick={()=>setCartOpen(false)}>Browse Products</button>
              </div>
            ) : (
              <>
                <div style={{ flex:1 }}>
                  {cart.items.map((item,i)=>(
                    <div key={i} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom:'1.5px solid var(--border)', alignItems:'flex-start' }}>
                      <div style={{ width:64, height:64, borderRadius:10, overflow:'hidden', flexShrink:0, background:'var(--primary-xlight)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>
                        <ImgOrEmoji src={item.imageUrl} emoji={item.emoji} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{item.name}</div>
                        <div style={{ color:'var(--primary)', fontWeight:800, fontSize:14, marginBottom:8 }}>₹{item.price?.toLocaleString()}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                          <button onClick={()=>updateQty(item.product,item.qty-1)} style={{ width:26, height:26, borderRadius:7, border:'1.5px solid var(--border)', background:'var(--surface)', cursor:'pointer', fontWeight:800, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                          <span style={{ fontWeight:800, minWidth:18, textAlign:'center' }}>{item.qty}</span>
                          <button onClick={()=>updateQty(item.product,item.qty+1)} style={{ width:26, height:26, borderRadius:7, border:'1.5px solid var(--border)', background:'var(--surface)', cursor:'pointer', fontWeight:800, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                          <button onClick={()=>removeItem(item.product)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#EF4444', fontSize:18 }}>🗑</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ paddingTop:14, borderTop:'2px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:18, marginBottom:6 }}>
                    <span>Total</span><span style={{ color:'var(--primary)' }}>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize:12, color:'#16A34A', fontWeight:700, marginBottom:12 }}>✅ Free delivery on this order!</p>
                  <button className="btn btn-primary" style={{ width:'100%', height:46, fontSize:15, justifyContent:'center', borderRadius:12, marginBottom:8 }}
                    onClick={()=>{setCartOpen(false);setCheckoutOpen(true);setCheckoutStep(1);}}>
                    Checkout →
                  </button>
                  <button className="btn btn-ghost" style={{ width:'100%', height:40, justifyContent:'center', borderRadius:12 }} onClick={()=>setCartOpen(false)}>
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {checkoutOpen && <CheckoutModal step={checkoutStep} setStep={setCheckoutStep} cart={cart} total={cartTotal} onClose={()=>setCheckoutOpen(false)} onPlace={placeOrder}/>}

      {/* SUCCESS */}
      {successOrd && (
        <div className="overlay">
          <div className="modal" style={{ textAlign:'center', maxWidth:420 }}>
            <div style={{ fontSize:68, marginBottom:12 }}>🎉</div>
            <h2 style={{ fontFamily:'Poppins', fontSize:22, marginBottom:8 }}>Order Placed!</h2>
            <p style={{ color:'var(--text-muted)', marginBottom:8 }}>Order <strong style={{ color:'var(--primary)' }}>#{successOrd._id?.slice(-8).toUpperCase()}</strong></p>
            <p style={{ color:'var(--text-muted)', marginBottom:20, fontSize:14 }}>Estimated delivery: <strong>3–5 business days</strong></p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button className="btn btn-primary" onClick={()=>setSuccessOrd(null)}>Continue Shopping</button>
              <button className="btn btn-outline" onClick={()=>{setSuccessOrd(null);setView('orders');}}>View Orders</button>
            </div>
          </div>
        </div>
      )}

      {/* CHATBOT */}
      <div style={{ position:'fixed', bottom:76, right:16, zIndex:300 }}>
        {chatOpen && (
          <div style={{ width:320, height:440, background:'var(--surface)', borderRadius:20, boxShadow:'0 8px 40px rgba(14,165,233,0.28)', border:'1.5px solid var(--border)', display:'flex', flexDirection:'column', overflow:'hidden', marginBottom:10 }}>
            <div style={{ background:'linear-gradient(135deg,#0EA5E9,#6366F1)', padding:'13px 16px', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
              <div>
                <div style={{ fontFamily:'Poppins', fontWeight:700, color:'#fff', fontSize:14 }}>AI1 Bot</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)' }}>● Online — Ask me anything!</div>
              </div>
              <button onClick={()=>setChatOpen(false)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.8)', fontSize:20 }}>✕</button>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:13, display:'flex', flexDirection:'column', gap:10, background:'#F8FAFF' }}>
              {chatMsgs.map((m,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:m.from==='user'?'flex-end':'flex-start' }}>
                  <div style={{ maxWidth:'85%', padding:'9px 13px', borderRadius:m.from==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px', background:m.from==='user'?'var(--primary)':'#fff', color:m.from==='user'?'#fff':'var(--text)', fontSize:13, lineHeight:1.55, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', fontWeight:m.from==='bot'?500:600, whiteSpace:'pre-line' }}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}/>
            </div>
            <div style={{ padding:'5px 10px', display:'flex', gap:5, flexWrap:'wrap', background:'var(--surface)', borderTop:'1px solid var(--border)' }}>
              {['📱 iPhone','💻 Laptops','⚽ Sports','📚 Books','🛒 Orders','💳 Payment'].map(q=>(
                <button key={q} onClick={()=>{const t=q.slice(3);setChatMsgs(p=>[...p,{from:'user',text:t}]);setTimeout(()=>setChatMsgs(p=>[...p,{from:'bot',text:getBotReply(t)}]),600);}}
                  style={{ padding:'3px 9px', borderRadius:20, border:'1.5px solid var(--border)', background:'var(--primary-xlight)', color:'var(--primary)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'Nunito' }}>
                  {q}
                </button>
              ))}
            </div>
            <div style={{ padding:'9px 11px', borderTop:'1.5px solid var(--border)', display:'flex', gap:7, background:'var(--surface)' }}>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')sendChat();}} placeholder="Ask anything..."
                style={{ flex:1, padding:'8px 12px', border:'1.5px solid var(--border)', borderRadius:24, fontSize:13, fontFamily:'Nunito', outline:'none' }}/>
              <button onClick={sendChat} style={{ width:36, height:36, borderRadius:'50%', background:'var(--primary)', border:'none', cursor:'pointer', color:'#fff', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>↑</button>
            </div>
          </div>
        )}
        <button onClick={()=>setChatOpen(p=>!p)}
          style={{ width:54, height:54, borderRadius:'50%', background:'linear-gradient(135deg,#0EA5E9,#6366F1)', border:'none', cursor:'pointer', color:'#fff', fontSize:22, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(14,165,233,0.45)', marginLeft:'auto', transition:'transform .2s' }}
          onMouseEnter={e=>e.currentTarget.style.transform='scale(1.1)'}
          onMouseLeave={e=>e.currentTarget.style.transform=''}>
          {chatOpen?'✕':'🤖'}
        </button>
      </div>
    </div>
  );
}

function ImgOrEmoji({ src, emoji, alt, style={} }) {
  const [err, setErr] = useState(false);
  if (src && !err) return <img src={src} alt={alt||''} onError={()=>setErr(true)} style={style}/>;
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, width:'100%', height:'100%', ...style }}>{emoji||'📦'}</div>;
}

function ProductCard({ p, inWishlist, discPct, px, onWishlist, onAdd, onBuy, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div style={{ background:'var(--surface)', borderRadius:14, overflow:'hidden', border:'1.5px solid var(--border)', transition:'all .2s', cursor:'pointer' }}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='var(--shadow-lg)';e.currentTarget.style.borderColor='var(--primary)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';e.currentTarget.style.borderColor='var(--border)';}}>
      <div style={{ height:180, position:'relative', overflow:'hidden', background:'var(--primary-xlight)' }} onClick={onClick}>
        {p.imageUrl && !imgErr
          ? <img src={p.imageUrl} alt={p.name} onError={()=>setImgErr(true)} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .3s' }}
              onMouseEnter={e=>e.target.style.transform='scale(1.06)'} onMouseLeave={e=>e.target.style.transform=''}/>
          : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:60 }}>{p.emoji||'📦'}</div>}
        {discPct>0 && <div style={{ position:'absolute', top:8, left:8, background:'#EF4444', color:'#fff', fontSize:10, padding:'2px 7px', borderRadius:5, fontWeight:800 }}>{discPct}% OFF</div>}
        <button onClick={e=>{e.stopPropagation();onWishlist();}} style={{ position:'absolute', top:6, right:6, background:'rgba(255,255,255,0.9)', border:'1.5px solid var(--border)', borderRadius:'50%', width:30, height:30, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {inWishlist?'❤️':'♡'}
        </button>
        {p.stock===0 && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:'#fff', fontWeight:800, fontSize:13 }}>Out of Stock</span></div>}
        {p.stock>0&&p.stock<=5&&<div style={{ position:'absolute', bottom:6, left:8, background:'rgba(245,158,11,0.92)', color:'#fff', fontSize:10, padding:'2px 7px', borderRadius:5, fontWeight:800 }}>Only {p.stock} left</div>}
      </div>
      <div style={{ padding:12 }} onClick={onClick}>
        <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, marginBottom:2, textTransform:'uppercase' }}>{p.brand}</div>
        <div style={{ fontSize:13, fontWeight:800, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
        <div style={{ fontSize:11, color:'#F59E0B', marginBottom:6 }}>{'★'.repeat(Math.min(5,Math.floor(p.rating||4)))} <span style={{ color:'var(--text-muted)' }}>{(p.numReviews||0).toLocaleString()}</span></div>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
          <span style={{ fontFamily:'Poppins', fontSize:16, fontWeight:900, color:'var(--primary)' }}>₹{px.toLocaleString()}</span>
          {p.salePrice&&p.salePrice<p.price&&<span style={{ fontSize:11, color:'var(--text-light)', textDecoration:'line-through' }}>₹{p.price.toLocaleString()}</span>}
        </div>
      </div>
      <div style={{ padding:'0 12px 12px', display:'flex', gap:6 }}>
        <button onClick={e=>{e.stopPropagation();onAdd();}} disabled={p.stock===0} style={{ flex:1, padding:'8px 0', borderRadius:8, border:'2px solid var(--primary)', background:'transparent', color:'var(--primary)', fontWeight:700, fontSize:12, cursor:p.stock===0?'not-allowed':'pointer', fontFamily:'Nunito', opacity:p.stock===0?.4:1 }}>Add to Cart</button>
        <button onClick={e=>{e.stopPropagation();onBuy();}} disabled={p.stock===0} style={{ flex:1, padding:'8px 0', borderRadius:8, border:'none', background:'var(--primary)', color:'#fff', fontWeight:700, fontSize:12, cursor:p.stock===0?'not-allowed':'pointer', fontFamily:'Nunito', opacity:p.stock===0?.4:1 }}>Buy Now</button>
      </div>
    </div>
  );
}

function OrderCard({ order:o }) {
  const STATUS_BADGE={delivered:'badge-green',shipped:'badge-blue',out_for_delivery:'badge-blue',pending:'badge-amber',cancelled:'badge-red',confirmed:'badge-sky',processing:'badge-purple',packed:'badge-purple'};
  const STEPS=['pending','confirmed','processing','packed','shipped','out_for_delivery','delivered'];
  const cur=STEPS.indexOf(o.status);
  return (
    <div className="card">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <span style={{ fontFamily:'Poppins', fontWeight:800 }}>#{o._id?.slice(-8).toUpperCase()}</span>
        <span className={`badge ${STATUS_BADGE[o.status]||'badge-gray'}`}>{o.status?.replace(/_/g,' ')}</span>
      </div>
      <div style={{ display:'flex', gap:3, marginBottom:12 }}>
        {STEPS.map((s,i)=><div key={s} style={{ flex:1, height:5, borderRadius:3, background:i<=cur?'var(--primary)':'var(--border)' }}/>)}
      </div>
      <div style={{ display:'flex', gap:7, marginBottom:10 }}>
        {o.items?.slice(0,5).map((item,i)=>(
          <div key={i} style={{ width:44, height:44, background:'var(--primary-xlight)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, overflow:'hidden' }}>
            {item.imageUrl?<img src={item.imageUrl} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>:item.emoji}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:13, color:'var(--text-muted)' }}>{o.items?.length} item{o.items?.length!==1?'s':''} · {new Date(o.createdAt).toLocaleDateString()}</span>
        <span style={{ fontFamily:'Poppins', fontWeight:800, color:'var(--primary)' }}>₹{o.total?.toLocaleString()}</span>
      </div>
      <div style={{ marginTop:10, display:'flex', gap:8 }}>
        <button className="btn btn-outline btn-sm">Track Order</button>
        {o.status==='delivered'&&<button className="btn btn-ghost btn-sm">Return / Exchange</button>}
      </div>
    </div>
  );
}

/* ── CHECKOUT MODAL WITH PROPER PAYMENT FORMS ── */
function CheckoutModal({ step, setStep, cart, total, onClose, onPlace }) {
  const [address, setAddress] = useState({ name:'', phone:'', line1:'', line2:'', city:'Bangalore', state:'Karnataka', pin:'' });
  const [payMethod, setPayMethod] = useState('COD');
  // Card details
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardType, setCardType] = useState('credit');
  // UPI
  const [upiApp, setUpiApp]   = useState('gpay');
  const [upiId,  setUpiId]    = useState('');
  // NetBanking
  const [bank, setBank]       = useState('sbi');
  const setA = (k,v) => setAddress(p=>({...p,[k]:v}));

  const formatCard = v => v.replace(/\s/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);
  const formatExp  = v => v.replace(/\//g,'').replace(/(.{2})/g,'$1/').trim().slice(0,5);

  const BANKS = [
    {k:'sbi',l:'State Bank of India'},
    {k:'hdfc',l:'HDFC Bank'},
    {k:'icici',l:'ICICI Bank'},
    {k:'axis',l:'Axis Bank'},
    {k:'kotak',l:'Kotak Mahindra Bank'},
    {k:'yes',l:'Yes Bank'},
    {k:'pnb',l:'Punjab National Bank'},
    {k:'bob',l:'Bank of Baroda'},
    {k:'canara',l:'Canara Bank'},
    {k:'union',l:'Union Bank of India'},
  ];

  const handlePlace = () => {
    if (payMethod==='Card' && (!cardNum||!cardName||!cardExp||!cardCVV)) { alert('Please fill all card details'); return; }
    if (payMethod==='UPI' && !upiId) { alert('Please enter UPI ID'); return; }
    onPlace(address, payMethod, { cardNum, cardName, upiId, bank });
  };

  return (
    <div className="overlay">
      <div className="modal" style={{ maxWidth:560 }}>
        <div className="modal-header">
          <h2 style={{ fontFamily:'Poppins' }}>Checkout</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        {/* Steps */}
        <div style={{ display:'flex', marginBottom:22 }}>
          {['Delivery','Payment','Review'].map((s,i)=>(
            <div key={s} style={{ flex:1, textAlign:'center', position:'relative' }}>
              {i<2&&<div style={{ position:'absolute', top:14, left:'50%', width:'100%', height:2, background:i<step-1?'var(--primary)':'var(--border)', zIndex:0 }}/>}
              <div style={{ width:30, height:30, borderRadius:'50%', background:i<step?'var(--primary)':'var(--border)', color:i<step?'#fff':'var(--text-muted)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, margin:'0 auto 5px', position:'relative', zIndex:1 }}>{i<step-1?'✓':i+1}</div>
              <div style={{ fontSize:12, fontWeight:700, color:i<step?'var(--primary)':'var(--text-muted)' }}>{s}</div>
            </div>
          ))}
        </div>

        {/* STEP 1 - Delivery */}
        {step===1&&(<>
          <h3 style={{ fontFamily:'Poppins', marginBottom:13 }}>Delivery Address</h3>
          <div className="form-row"><div className="form-group"><label>Full Name *</label><input className="form-control" value={address.name} onChange={e=>setA('name',e.target.value)} placeholder="Your full name"/></div><div className="form-group"><label>Phone *</label><input className="form-control" value={address.phone} onChange={e=>setA('phone',e.target.value)} placeholder="+91 ..."/></div></div>
          <div className="form-group"><label>Address Line 1 *</label><input className="form-control" value={address.line1} onChange={e=>setA('line1',e.target.value)} placeholder="House no., Street name"/></div>
          <div className="form-group"><label>Address Line 2 (optional)</label><input className="form-control" value={address.line2} onChange={e=>setA('line2',e.target.value)} placeholder="Area, Landmark"/></div>
          <div className="form-row">
            <div className="form-group"><label>City *</label><input className="form-control" value={address.city} onChange={e=>setA('city',e.target.value)}/></div>
            <div className="form-group"><label>State</label><select className="form-control" value={address.state} onChange={e=>setA('state',e.target.value)}>
              {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'].map(s=><option key={s}>{s}</option>)}
            </select></div>
            <div className="form-group"><label>PIN Code *</label><input className="form-control" value={address.pin} onChange={e=>setA('pin',e.target.value)} placeholder="560001" maxLength={6}/></div>
          </div>
          <div className="modal-footer"><button className="btn btn-primary" onClick={()=>{if(!address.name||!address.phone||!address.line1||!address.pin){alert('Please fill required fields');return;}setStep(2);}}>Continue to Payment →</button></div>
        </>)}

        {/* STEP 2 - Payment */}
        {step===2&&(<>
          <h3 style={{ fontFamily:'Poppins', marginBottom:13 }}>Payment Method</h3>

          {/* Payment method selector */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {[['COD','💵','Cash on Delivery'],['UPI','📱','UPI'],['Card','💳','Card'],['NetBanking','🏦','Net Banking']].map(([m,icon,label])=>(
              <label key={m} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', border:`2px solid ${payMethod===m?'var(--primary)':'var(--border)'}`, borderRadius:10, cursor:'pointer', background:payMethod===m?'var(--primary-xlight)':'var(--surface)', transition:'all .15s' }}>
                <input type="radio" name="pay" checked={payMethod===m} onChange={()=>setPayMethod(m)} style={{ accentColor:'var(--primary)' }}/>
                <span style={{ fontSize:18 }}>{icon}</span>
                <span style={{ fontWeight:700, fontSize:13 }}>{label}</span>
              </label>
            ))}
          </div>

          {/* COD */}
          {payMethod==='COD'&&(
            <div style={{ background:'#F0FDF4', border:'1.5px solid #BBF7D0', borderRadius:12, padding:16, marginBottom:16 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:8, color:'#166534' }}>💵 Cash on Delivery</div>
              <p style={{ fontSize:14, color:'#166534', lineHeight:1.6 }}>• Pay in cash when your order is delivered<br/>• No advance payment required<br/>• Keep exact change ready<br/>• Delivery in 3-5 business days</p>
            </div>
          )}

          {/* UPI */}
          {payMethod==='UPI'&&(
            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Choose UPI App</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
                {[['gpay','G Pay','#4285F4'],['phonepe','PhonePe','#5F259F'],['paytm','Paytm','#00BAF2']].map(([k,l,c])=>(
                  <label key={k} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 8px', border:`2px solid ${upiApp===k?c:'var(--border)'}`, borderRadius:10, cursor:'pointer', background:upiApp===k?`${c}15`:'var(--surface)', transition:'all .15s' }}>
                    <input type="radio" name="upiapp" checked={upiApp===k} onChange={()=>setUpiApp(k)} style={{ display:'none' }}/>
                    <div style={{ width:40, height:40, borderRadius:10, background:c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:13 }}>{l.split(' ')[0][0]}</div>
                    <span style={{ fontSize:12, fontWeight:700, color:upiApp===k?c:'var(--text)' }}>{l}</span>
                    {upiApp===k&&<span style={{ fontSize:10, color:'#16A34A', fontWeight:700 }}>✓ Selected</span>}
                  </label>
                ))}
              </div>
              <div className="form-group">
                <label>Enter UPI ID *</label>
                <input className="form-control" value={upiId} onChange={e=>setUpiId(e.target.value)} placeholder={upiApp==='gpay'?'yourname@okicici':upiApp==='phonepe'?'9876543210@ybl':'yourname@paytm'}/>
                <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>Example: name@okicici, 9999999999@ybl, name@paytm</p>
              </div>
              <div style={{ background:'#EEF2FF', border:'1.5px solid #C7D2FE', borderRadius:10, padding:12, fontSize:13, color:'#3730A3', fontWeight:600 }}>
                📱 A payment request will be sent to your {upiApp==='gpay'?'Google Pay':upiApp==='phonepe'?'PhonePe':'Paytm'} app after placing order.
              </div>
            </div>
          )}

          {/* CARD */}
          {payMethod==='Card'&&(
            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                {[['credit','💳 Credit Card'],['debit','🏦 Debit Card']].map(([k,l])=>(
                  <label key={k} style={{ flex:1, display:'flex', alignItems:'center', gap:8, padding:'10px', border:`2px solid ${cardType===k?'var(--primary)':'var(--border)'}`, borderRadius:10, cursor:'pointer', background:cardType===k?'var(--primary-xlight)':'var(--surface)' }}>
                    <input type="radio" name="cardtype" checked={cardType===k} onChange={()=>setCardType(k)} style={{ accentColor:'var(--primary)' }}/>
                    <span style={{ fontWeight:700, fontSize:13 }}>{l}</span>
                  </label>
                ))}
              </div>
              {/* Card preview */}
              <div style={{ background:'linear-gradient(135deg,#0C1A2E,#0EA5E9)', borderRadius:16, padding:'20px 24px', marginBottom:16, color:'#fff', minHeight:120 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                  <span style={{ fontFamily:'Poppins', fontWeight:700, fontSize:16 }}>AI1 Mart</span>
                  <span style={{ fontSize:14, opacity:.7 }}>{cardType==='credit'?'CREDIT':'DEBIT'}</span>
                </div>
                <div style={{ fontFamily:'monospace', fontSize:20, letterSpacing:3, marginBottom:16, opacity:cardNum?1:.5 }}>{cardNum||'•••• •••• •••• ••••'}</div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <div><div style={{ fontSize:10, opacity:.6 }}>CARD HOLDER</div><div style={{ fontSize:13, fontWeight:700, textTransform:'uppercase' }}>{cardName||'YOUR NAME'}</div></div>
                  <div><div style={{ fontSize:10, opacity:.6 }}>EXPIRES</div><div style={{ fontSize:13, fontWeight:700 }}>{cardExp||'MM/YY'}</div></div>
                </div>
              </div>
              <div className="form-group"><label>Card Number *</label><input className="form-control" value={cardNum} onChange={e=>setCardNum(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}/></div>
              <div className="form-group"><label>Cardholder Name *</label><input className="form-control" value={cardName} onChange={e=>setCardName(e.target.value.toUpperCase())} placeholder="NAME AS ON CARD"/></div>
              <div className="form-row">
                <div className="form-group"><label>Expiry Date *</label><input className="form-control" value={cardExp} onChange={e=>setCardExp(formatExp(e.target.value))} placeholder="MM/YY" maxLength={5}/></div>
                <div className="form-group"><label>CVV *</label><input className="form-control" type="password" value={cardCVV} onChange={e=>setCardCVV(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="•••" maxLength={4}/></div>
              </div>
              <div style={{ background:'#D1FAE5', border:'1px solid #6EE7B7', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#065F46', fontWeight:600 }}>🔒 256-bit SSL secured · Your card details are encrypted</div>
            </div>
          )}

          {/* NET BANKING */}
          {payMethod==='NetBanking'&&(
            <div style={{ marginBottom:16 }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Select Your Bank</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                {BANKS.map(b=>(
                  <label key={b.k} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px', border:`2px solid ${bank===b.k?'var(--primary)':'var(--border)'}`, borderRadius:10, cursor:'pointer', background:bank===b.k?'var(--primary-xlight)':'var(--surface)', transition:'all .15s', fontSize:13, fontWeight:700 }}>
                    <input type="radio" name="bank" checked={bank===b.k} onChange={()=>setBank(b.k)} style={{ accentColor:'var(--primary)' }}/>{b.l}
                  </label>
                ))}
              </div>
              <div style={{ background:'#EEF2FF', border:'1.5px solid #C7D2FE', borderRadius:10, padding:12, fontSize:13, color:'#3730A3', fontWeight:600 }}>
                🏦 You will be redirected to {BANKS.find(b=>b.k===bank)?.l} secure banking portal to complete payment.
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={()=>setStep(3)}>Review Order →</button>
          </div>
        </>)}

        {/* STEP 3 - Review */}
        {step===3&&(<>
          <h3 style={{ fontFamily:'Poppins', marginBottom:13 }}>Order Review</h3>
          <div style={{ marginBottom:14 }}>
            {cart.items?.map((item,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:44, height:44, borderRadius:8, overflow:'hidden', background:'var(--primary-xlight)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                  {item.imageUrl?<img src={item.imageUrl} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:item.emoji}
                </div>
                <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13 }}>{item.name}</div><div style={{ fontSize:12, color:'var(--text-muted)' }}>Qty: {item.qty}</div></div>
                <span style={{ fontWeight:800, color:'var(--primary)' }}>₹{(item.price*item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ background:'var(--primary-xlight)', borderRadius:12, padding:14, marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:5 }}><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:5, color:'#16A34A', fontWeight:700 }}><span>Delivery</span><span>FREE</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:17, paddingTop:8, borderTop:'1.5px solid var(--border)' }}><span>Total</span><span style={{ color:'var(--primary)' }}>₹{total.toLocaleString()}</span></div>
          </div>
          <div style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px', marginBottom:14, fontSize:13 }}>
            <div style={{ fontWeight:700, marginBottom:4 }}>📍 Deliver to:</div>
            <div style={{ color:'var(--text-muted)' }}>{address.name}, {address.line1}, {address.city} {address.pin}</div>
            <div style={{ fontWeight:700, marginTop:8, marginBottom:4 }}>💳 Payment:</div>
            <div style={{ color:'var(--text-muted)' }}>{payMethod==='COD'?'Cash on Delivery':payMethod==='UPI'?`UPI (${upiApp==='gpay'?'Google Pay':upiApp==='phonepe'?'PhonePe':'Paytm'})`:payMethod==='Card'?`${cardType==='credit'?'Credit':'Debit'} Card ••••${cardNum.replace(/\s/g,'').slice(-4)}`:`Net Banking - ${BANKS.find(b=>b.k===bank)?.l}`}</div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={()=>setStep(2)}>← Back</button>
            <button className="btn btn-primary btn-lg" onClick={handlePlace}>Place Order 🎉</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

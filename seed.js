const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const MONGO_URI = 'mongodb://localhost:27017/ai1mart';

async function seed() {
  console.log('\n🌱  AI1 Mart – Seeding Database (100+ products)...\n');
  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected to MongoDB\n');
  const db = mongoose.connection.db;
  await db.collection('users').deleteMany({});
  await db.collection('products').deleteMany({});
  await db.collection('orders').deleteMany({});
  await db.collection('carts').deleteMany({});
  await db.collection('holidays').deleteMany({});
  await db.collection('queries').deleteMany({});
  console.log('🗑️   Cleared collections\n');
  const hash = p => bcrypt.hashSync(p, 10);
  const now = new Date();

  await db.collection('users').insertMany([
    { firstName:'Super', lastName:'Admin', email:'superadmin@ai1mart.com', password:hash('admin123'), role:'superadmin', phone:'9000000001', isActive:true, createdAt:now, updatedAt:now },
    { firstName:'Admin', lastName:'User', email:'admin@ai1mart.com', password:hash('admin123'), role:'admin', phone:'9000000002', isActive:true, createdAt:now, updatedAt:now },
    { firstName:'Rahul', lastName:'Manager', email:'manager@ai1mart.com', password:hash('admin123'), role:'manager', phone:'9000000003', isActive:true, createdAt:now, updatedAt:now },
    { firstName:'Priya', lastName:'Staff', email:'staff@ai1mart.com', password:hash('admin123'), role:'staff', phone:'9000000004', isActive:true, createdAt:now, updatedAt:now },
    { firstName:'John', lastName:'Customer', email:'customer@ai1mart.com', password:hash('user123'), role:'customer', phone:'9000000005', isActive:true, createdAt:now, updatedAt:now },
  ]);
  console.log('✅  Users seeded\n');

  const products = [

    // ═══════════════════════════════════════════
    // ELECTRONICS - MOBILES (20 products)
    // ═══════════════════════════════════════════
    { name:'iPhone 15 Pro Max 256GB Natural Titanium', category:'Electronics', subcategory:'Mobiles', brand:'Apple', price:159900, salePrice:149900, stock:40, emoji:'📱', rating:4.9, numReviews:8432,
      imageUrl:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80',
      images:['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80','https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80','https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80'],
      description:'The most powerful iPhone ever. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customisable Action button, and the most powerful iPhone camera system ever.',
      specs:{ RAM:'8GB', Storage:'256GB', Display:'6.7" Super Retina XDR OLED', Processor:'A17 Pro Bionic', Battery:'4422 mAh', Camera:'48MP + 12MP + 12MP Triple', OS:'iOS 17', Network:'5G', Weight:'221g', Color:'Natural Titanium' },
      features:['A17 Pro chip with 6-core GPU','48MP main camera with 5x optical zoom','Titanium aerospace-grade design','USB-3 for up to 20x faster transfers','Action button customisable','ProRes video up to 4K 60fps','Emergency SOS via satellite','Crash Detection','Face ID','All-day battery life'],
      status:'active', sku:'APL-IP15PM-256', tags:['iphone','apple','5g','smartphone','ios'] },

    { name:'iPhone 15 Pro 128GB Blue Titanium', category:'Electronics', subcategory:'Mobiles', brand:'Apple', price:134900, salePrice:124900, stock:35, emoji:'📱', rating:4.8, numReviews:6210,
      imageUrl:'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500&q=80',
      images:['https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500&q=80','https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80'],
      description:'iPhone 15 Pro in a beautiful blue titanium finish. Packed with A17 Pro chip and the versatile 48MP camera system with 3x optical zoom.',
      specs:{ RAM:'8GB', Storage:'128GB', Display:'6.1" Super Retina XDR OLED', Processor:'A17 Pro Bionic', Battery:'3274 mAh', Camera:'48MP + 12MP + 12MP Triple', OS:'iOS 17', Network:'5G', Weight:'187g', Color:'Blue Titanium' },
      features:['A17 Pro chip','48MP triple camera','3x optical zoom','Titanium build','USB-3','Action button','Emergency SOS via satellite','Face ID'],
      status:'active', sku:'APL-IP15P-128B', tags:['iphone','apple','5g','pro'] },

    { name:'Samsung Galaxy S24 Ultra 256GB Titanium Black', category:'Electronics', subcategory:'Mobiles', brand:'Samsung', price:134999, salePrice:119999, stock:30, emoji:'📱', rating:4.8, numReviews:3210,
      imageUrl:'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&q=80',
      images:['https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&q=80','https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80'],
      description:'The ultimate Android smartphone with a built-in S Pen, 200MP pro-grade camera, and Galaxy AI features. Designed for power users who demand the best.',
      specs:{ RAM:'12GB', Storage:'256GB', Display:'6.8" Dynamic AMOLED 2X QHD+', Processor:'Snapdragon 8 Gen 3', Battery:'5000 mAh', Camera:'200MP + 12MP + 50MP + 10MP Quad', OS:'Android 14 / One UI 6.1', Network:'5G', Weight:'232g', Color:'Titanium Black' },
      features:['200MP quad camera system','Built-in S Pen','Snapdragon 8 Gen 3','Galaxy AI features','100x Space Zoom','IP68 water resistance','45W fast charging','Armour Aluminium frame','7 years of OS updates'],
      status:'active', sku:'SAM-S24U-256', tags:['samsung','galaxy','android','s pen','5g'] },

    { name:'Samsung Galaxy S24+ 256GB Cobalt Violet', category:'Electronics', subcategory:'Mobiles', brand:'Samsung', price:99999, salePrice:89999, stock:25, emoji:'📱', rating:4.7, numReviews:2100,
      imageUrl:'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80',
      images:['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80'],
      description:'Galaxy S24+ with a massive 6.7" display, 50MP triple camera, and Galaxy AI for smarter photography and communication.',
      specs:{ RAM:'12GB', Storage:'256GB', Display:'6.7" Dynamic AMOLED 2X QHD+', Processor:'Snapdragon 8 Gen 3', Battery:'4900 mAh', Camera:'50MP + 12MP + 10MP Triple', OS:'Android 14', Network:'5G', Weight:'196g', Color:'Cobalt Violet' },
      features:['50MP triple camera','Snapdragon 8 Gen 3','Galaxy AI','45W fast charging','IP68 rated','ProVisual Engine'],
      status:'active', sku:'SAM-S24PLUS', tags:['samsung','galaxy','android','5g'] },

    { name:'OnePlus 12 5G 256GB Flowy Emerald', category:'Electronics', subcategory:'Mobiles', brand:'OnePlus', price:64999, salePrice:57999, stock:55, emoji:'📱', rating:4.6, numReviews:2100,
      imageUrl:'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80',
      images:['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80'],
      description:'Flagship performance meets stunning design. OnePlus 12 with Hasselblad camera system and the fastest SUPERVOOC charging ever.',
      specs:{ RAM:'12GB', Storage:'256GB', Display:'6.82" LTPO AMOLED ProXDR', Processor:'Snapdragon 8 Gen 3', Battery:'5400 mAh', Camera:'50MP + 64MP + 48MP Hasselblad Triple', OS:'OxygenOS 14 / Android 14', Network:'5G', Weight:'220g', Color:'Flowy Emerald' },
      features:['Hasselblad camera tuning','100W SUPERVOOC charging','50W wireless charging','Snapdragon 8 Gen 3','LTPO 120Hz display','Alert slider','IP65 rating'],
      status:'active', sku:'OP-12-256', tags:['oneplus','5g','hasselblad','fast charging'] },

    { name:'Google Pixel 8 Pro 256GB Obsidian', category:'Electronics', subcategory:'Mobiles', brand:'Google', price:99999, salePrice:89999, stock:20, emoji:'📱', rating:4.7, numReviews:1890,
      imageUrl:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
      images:['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80'],
      description:'The most capable and helpful Pixel phone yet. Google Tensor G3 chip powers incredible AI features, the best photo and video quality, and 7 years of updates.',
      specs:{ RAM:'12GB', Storage:'256GB', Display:'6.7" LTPO OLED QHD+', Processor:'Google Tensor G3', Battery:'5050 mAh', Camera:'50MP + 48MP + 48MP Triple', OS:'Android 14', Network:'5G', Weight:'213g', Color:'Obsidian' },
      features:['Google Tensor G3 chip','7 years of OS updates','Best-in-class AI photography','Temperature sensor','Real-time translation','Magic Eraser','Photo Unblur','Call Screen'],
      status:'active', sku:'GGL-P8P-256', tags:['google','pixel','ai','android','5g'] },

    { name:'Redmi Note 13 Pro+ 5G 256GB Midnight Black', category:'Electronics', subcategory:'Mobiles', brand:'Xiaomi', price:29999, salePrice:24999, stock:100, emoji:'📱', rating:4.4, numReviews:9800,
      imageUrl:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
      images:['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'],
      description:'200MP camera phone with 120W HyperCharge. Charges 0 to 100% in just 19 minutes. Curved AMOLED display with 1800 nits peak brightness.',
      specs:{ RAM:'8GB', Storage:'256GB', Display:'6.67" Curved AMOLED FHD+ 120Hz', Processor:'MediaTek Dimensity 7200 Ultra', Battery:'5000 mAh', Camera:'200MP + 8MP + 2MP Triple', OS:'MIUI 14 / Android 13', Network:'5G', Weight:'204g', Color:'Midnight Black' },
      features:['200MP camera','120W HyperCharge','IP68 rated','Curved AMOLED display','1800 nits brightness','Corning Gorilla Glass Victus'],
      status:'active', sku:'XMI-RN13PP', tags:['redmi','xiaomi','5g','200mp'] },

    { name:'Realme GT 5 Pro 5G 256GB Navigator Beige', category:'Electronics', subcategory:'Mobiles', brand:'Realme', price:39999, salePrice:34999, stock:45, emoji:'📱', rating:4.5, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80',
      images:['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80'],
      description:'Snapdragon 8 Gen 3 flagship killer with 144Hz AMOLED display and 100W SuperVOOC charging at an unbeatable price.',
      specs:{ RAM:'12GB', Storage:'256GB', Display:'6.78" AMOLED 144Hz QHD+', Processor:'Snapdragon 8 Gen 3', Battery:'5400 mAh', Camera:'50MP + 8MP + 50MP Periscope', OS:'Realme UI 5.0 / Android 14', Network:'5G', Weight:'220g', Color:'Navigator Beige' },
      features:['Snapdragon 8 Gen 3','144Hz display','100W SuperVOOC','Periscope telephoto','IP64 rating','Ultrasonic fingerprint'],
      status:'active', sku:'RLM-GT5P', tags:['realme','5g','snapdragon','flagship killer'] },

    { name:'Motorola Edge 50 Pro 5G 256GB Black Beauty', category:'Electronics', subcategory:'Mobiles', brand:'Motorola', price:31999, salePrice:26999, stock:40, emoji:'📱', rating:4.3, numReviews:1200,
      imageUrl:'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
      images:['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80'],
      description:'Curved pOLED display, 125W TurboPower charging, 50MP Sony LYTIA camera, and pure Android experience.',
      specs:{ RAM:'12GB', Storage:'256GB', Display:'6.7" Curved pOLED 144Hz FHD+', Processor:'Snapdragon 7 Gen 3', Battery:'4500 mAh', Camera:'50MP Sony + 13MP + 10MP Triple', OS:'Android 14', Network:'5G', Weight:'186g', Color:'Black Beauty' },
      features:['125W TurboPower charging','Curved pOLED','Sony LYTIA sensor','IP68 rating','Wireless charging 50W','Near stock Android'],
      status:'active', sku:'MOT-E50PRO', tags:['motorola','5g','125w charging','curved'] },

    { name:'POCO X6 Pro 5G 256GB Yellow', category:'Electronics', subcategory:'Mobiles', brand:'POCO', price:22999, salePrice:19999, stock:80, emoji:'📱', rating:4.4, numReviews:5600,
      imageUrl:'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80',
      images:['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80'],
      description:'Dimensity 8300 Ultra gaming powerhouse with 144Hz AMOLED display and massive 5100mAh battery.',
      specs:{ RAM:'12GB', Storage:'256GB', Display:'6.67" AMOLED 144Hz FHD+', Processor:'MediaTek Dimensity 8300 Ultra', Battery:'5100 mAh', Camera:'64MP + 8MP + 2MP Triple', OS:'MIUI 14 / Android 13', Network:'5G', Weight:'187g', Color:'Yellow' },
      features:['Dimensity 8300 Ultra','144Hz AMOLED','67W turbo charging','HyperOS','Gorilla Glass 5'],
      status:'active', sku:'POCO-X6P', tags:['poco','gaming','5g','budget flagship'] },

    { name:'Vivo V29 Pro 5G 256GB Himalayan Blue', category:'Electronics', subcategory:'Mobiles', brand:'Vivo', price:35999, salePrice:29999, stock:35, emoji:'📱', rating:4.3, numReviews:2100,
      imageUrl:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80',
      images:['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80'],
      description:'Aura Light Portrait system with 50MP front camera. Sleek curved design with Snapdragon 778G and 80W FlashCharge.',
      specs:{ RAM:'8GB', Storage:'256GB', Display:'6.78" AMOLED Curved 120Hz', Processor:'Snapdragon 778G', Battery:'4600 mAh', Camera:'50MP + 8MP + 2MP + 50MP Front', OS:'Funtouch OS 13', Network:'5G', Weight:'186g', Color:'Himalayan Blue' },
      features:['50MP front Aura Light camera','80W FlashCharge','Curved AMOLED','3D curved AG glass back','IP54 rating'],
      status:'active', sku:'VIVO-V29PRO', tags:['vivo','selfie','5g','curved'] },

    { name:'iQOO 12 5G 256GB Legend', category:'Electronics', subcategory:'Mobiles', brand:'iQOO', price:52999, salePrice:47999, stock:25, emoji:'📱', rating:4.7, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&q=80',
      images:['https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&q=80'],
      description:'Snapdragon 8 Gen 3 gaming beast with 144Hz LTPO AMOLED and 120W FlashCharge. Monster Gaming chip with dedicated Gaming display.',
      specs:{ RAM:'12GB', Storage:'256GB', Display:'6.78" LTPO AMOLED 144Hz QHD+', Processor:'Snapdragon 8 Gen 3', Battery:'5000 mAh', Camera:'50MP Zeiss + 64MP + 50MP Triple', OS:'Funtouch OS 14', Network:'5G', Weight:'214g', Color:'Legend (BMW Motorsport Edition)' },
      features:['Snapdragon 8 Gen 3','Zeiss optics camera','144Hz LTPO','120W FlashCharge','Q2 gaming chip','Monster Gaming mode'],
      status:'active', sku:'IQOO-12', tags:['iqoo','gaming','5g','zeiss','snapdragon'] },

    { name:'Nothing Phone 2a 256GB Black', category:'Electronics', subcategory:'Mobiles', brand:'Nothing', price:26999, salePrice:23999, stock:45, emoji:'📱', rating:4.5, numReviews:4200,
      imageUrl:'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80',
      images:['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80'],
      description:'Nothing Phone 2a with the iconic Glyph Interface. Clean, minimal design with Dimensity 7200 Pro and pure Nothing OS experience.',
      specs:{ RAM:'8GB', Storage:'256GB', Display:'6.7" AMOLED 120Hz FHD+', Processor:'MediaTek Dimensity 7200 Pro', Battery:'5000 mAh', Camera:'50MP + 50MP Dual + 32MP Front', OS:'Nothing OS 2.5 / Android 14', Network:'5G', Weight:'190g', Color:'Black' },
      features:['Glyph Interface LED','Dimensity 7200 Pro','50W fast charging','Nothing OS clean UI','Transparent design'],
      status:'active', sku:'NTNG-2A', tags:['nothing','glyph','5g','minimal','unique'] },

    { name:'OnePlus Nord CE 3 Lite 5G 128GB Pastel Lime', category:'Electronics', subcategory:'Mobiles', brand:'OnePlus', price:19999, salePrice:16999, stock:70, emoji:'📱', rating:4.2, numReviews:5600,
      imageUrl:'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80',
      images:['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80'],
      description:'Budget 5G with 108MP camera, 67W SUPERVOOC charging, and a large 5000mAh battery. Great value for money.',
      specs:{ RAM:'8GB', Storage:'128GB', Display:'6.72" IPS LCD 120Hz FHD+', Processor:'Snapdragon 695', Battery:'5000 mAh', Camera:'108MP + 2MP + 2MP Triple', OS:'OxygenOS 13.1', Network:'5G', Weight:'195g', Color:'Pastel Lime' },
      features:['108MP camera','67W SUPERVOOC','5000mAh battery','5G connectivity','Alert Slider','120Hz display'],
      status:'active', sku:'OP-NORDCE3L', tags:['oneplus','nord','5g','budget','108mp'] },

    { name:'Samsung Galaxy A54 5G 128GB Awesome Violet', category:'Electronics', subcategory:'Mobiles', brand:'Samsung', price:34999, salePrice:27999, stock:60, emoji:'📱', rating:4.5, numReviews:7800,
      imageUrl:'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80',
      images:['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=80'],
      description:'Long-lasting battery, incredible nightography camera, and IP67 water resistance. The everyday flagship experience at mid-range price.',
      specs:{ RAM:'8GB', Storage:'128GB', Display:'6.4" Super AMOLED 120Hz FHD+', Processor:'Exynos 1380', Battery:'5000 mAh', Camera:'50MP OIS + 12MP + 5MP Triple', OS:'Android 13 / One UI 5.1', Network:'5G', Weight:'202g', Color:'Awesome Violet' },
      features:['IP67 water resistance','OIS camera','5000mAh battery','120Hz Super AMOLED','4 years of updates','Nightography AI camera'],
      status:'active', sku:'SAM-A54-128', tags:['samsung','galaxy','5g','ip67'] },

    { name:'Apple iPhone SE 3rd Gen 64GB Midnight', category:'Electronics', subcategory:'Mobiles', brand:'Apple', price:49900, salePrice:43900, stock:50, emoji:'📱', rating:4.4, numReviews:4500,
      imageUrl:'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500&q=80',
      images:['https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=500&q=80'],
      description:'Compact iPhone with A15 Bionic chip and 5G. The most affordable iPhone with the best chip. Perfect for one-handed use.',
      specs:{ RAM:'4GB', Storage:'64GB', Display:'4.7" Retina HD IPS', Processor:'A15 Bionic', Battery:'2018 mAh', Camera:'12MP Single + 7MP Front', OS:'iOS 16', Network:'5G', Weight:'144g', Color:'Midnight' },
      features:['A15 Bionic','5G','Touch ID home button','Ceramic Shield','Compact 4.7" design','Emergency SOS'],
      status:'active', sku:'APL-IPSE3-64', tags:['iphone','apple','se','compact','5g'] },

    { name:'Xiaomi 14 Ultra 5G 512GB White', category:'Electronics', subcategory:'Mobiles', brand:'Xiaomi', price:99999, salePrice:89999, stock:15, emoji:'📱', rating:4.8, numReviews:2100,
      imageUrl:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80',
      images:['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80'],
      description:'Xiaomi x Leica flagship with 1-inch Sony sensor. The ultimate camera smartphone for professional photography enthusiasts.',
      specs:{ RAM:'16GB', Storage:'512GB', Display:'6.73" LTPO AMOLED 120Hz QHD+', Processor:'Snapdragon 8 Gen 3', Battery:'5000 mAh', Camera:'50MP Leica 1" + 50MP + 50MP + 50MP Quad', OS:'MIUI 14 / Android 14', Network:'5G', Weight:'229g', Color:'White' },
      features:['Leica Summilux optics','1-inch Sony sensor','90W HyperCharge','80W wireless','IP68','Titanium frame'],
      status:'active', sku:'XMI-14ULTRA', tags:['xiaomi','leica','flagship','5g','1inch sensor'] },

    { name:'OPPO Reno 11 Pro 5G 256GB Rock Grey', category:'Electronics', subcategory:'Mobiles', brand:'OPPO', price:39999, salePrice:34999, stock:30, emoji:'📱', rating:4.4, numReviews:1800,
      imageUrl:'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80',
      images:['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80'],
      description:'Portrait Expert camera with Sony IMX890 sensor and 80W SUPERVOOC charging. Designed for stunning portrait photography.',
      specs:{ RAM:'12GB', Storage:'256GB', Display:'6.7" AMOLED Curved 120Hz FHD+', Processor:'MediaTek Dimensity 8200', Battery:'4600 mAh', Camera:'50MP Sony IMX890 + 32MP + 13MP Triple', OS:'ColorOS 14', Network:'5G', Weight:'191g', Color:'Rock Grey' },
      features:['Sony IMX890 sensor','AI Portrait Expert','80W SUPERVOOC','Curved AMOLED','Hasselblad Natural Colour Calibration'],
      status:'active', sku:'OPPO-RENO11P', tags:['oppo','reno','5g','portrait','curved'] },

    { name:'Tecno Spark 20 Pro+ 256GB Neon Gold', category:'Electronics', subcategory:'Mobiles', brand:'Tecno', price:14999, salePrice:12999, stock:90, emoji:'📱', rating:4.1, numReviews:3200,
      imageUrl:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
      images:['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'],
      description:'Budget Android with 108MP camera and large 5000mAh battery. Great value device for first-time smartphone users.',
      specs:{ RAM:'8GB', Storage:'256GB', Display:'6.78" AMOLED 120Hz FHD+', Processor:'MediaTek Helio G99 Ultimate', Battery:'5000 mAh', Camera:'108MP + 2MP + 0.08MP Triple', OS:'HiOS 13.5', Network:'4G LTE', Weight:'192g', Color:'Neon Gold' },
      features:['108MP camera','AMOLED 120Hz','5000mAh battery','18W fast charge','Expandable storage 1TB'],
      status:'active', sku:'TCN-SPARK20PP', tags:['tecno','budget','108mp','android'] },

    { name:'Lava Blaze 2 5G 128GB Glass Blue', category:'Electronics', subcategory:'Mobiles', brand:'Lava', price:11999, salePrice:9999, stock:100, emoji:'📱', rating:4.0, numReviews:2100,
      imageUrl:'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80',
      images:['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&q=80'],
      description:'Made in India 5G smartphone with Dimensity 6020 processor. Pure Android experience with guaranteed updates.',
      specs:{ RAM:'4GB', Storage:'128GB', Display:'6.5" IPS LCD 90Hz HD+', Processor:'MediaTek Dimensity 6020', Battery:'5000 mAh', Camera:'50MP + 2MP Dual + 8MP Front', OS:'Android 13', Network:'5G', Weight:'186g', Color:'Glass Blue' },
      features:['5G connectivity','Made in India','Pure Android','50MP camera','5000mAh battery','Expandable storage'],
      status:'active', sku:'LAVA-BLAZE2', tags:['lava','made in india','5g','budget'] },

    // ═══════════════════════════════════════════
    // ELECTRONICS - LAPTOPS (15 products)
    // ═══════════════════════════════════════════
    { name:'MacBook Pro 14" M3 Pro 18GB 512GB Space Black', category:'Electronics', subcategory:'Laptops', brand:'Apple', price:199900, salePrice:189900, stock:18, emoji:'💻', rating:4.9, numReviews:4210,
      imageUrl:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'],
      description:'Supercharged by M3 Pro with a 12-core CPU and 18-core GPU. Industry-leading performance for pro workflows. Liquid Retina XDR display with extreme dynamic range.',
      specs:{ Processor:'Apple M3 Pro', RAM:'18GB Unified Memory', Storage:'512GB SSD', Display:'14.2" Liquid Retina XDR 3024x1964', Battery:'18 hours', Graphics:'18-core GPU', Ports:'3x Thunderbolt 4, HDMI 2.1, SD Card, MagSafe 3', Weight:'1.61 kg', OS:'macOS Sonoma', Color:'Space Black' },
      features:['M3 Pro chip with 12-core CPU','18-core GPU','18GB unified memory','18-hour battery life','Liquid Retina XDR ProMotion display','MagSafe 3 charging','HDMI 2.1 port','SD card slot','1080p FaceTime HD camera','6-speaker sound system with Spatial Audio'],
      status:'active', sku:'APL-MBP14-M3PRO', tags:['macbook','apple','m3','laptop','pro'] },

    { name:'MacBook Air 13" M2 8GB 256GB Midnight', category:'Electronics', subcategory:'Laptops', brand:'Apple', price:114900, salePrice:104900, stock:25, emoji:'💻', rating:4.8, numReviews:8900,
      imageUrl:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      images:['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'],
      description:'Impossibly thin, remarkably powerful. MacBook Air with M2 is a completely redesigned laptop — with a new, bolder design in four stunning finishes.',
      specs:{ Processor:'Apple M2', RAM:'8GB Unified Memory', Storage:'256GB SSD', Display:'13.6" Liquid Retina 2560x1664', Battery:'18 hours', Graphics:'8-core GPU', Ports:'2x Thunderbolt/USB 4, MagSafe 3, 3.5mm jack', Weight:'1.24 kg', OS:'macOS Sonoma', Color:'Midnight' },
      features:['M2 chip','8-core GPU','18-hour battery','Liquid Retina display','MagSafe charging','Fanless silent operation','1080p FaceTime camera','4-speaker sound system','Touch ID'],
      status:'active', sku:'APL-MBA13-M2', tags:['macbook','apple','m2','ultrabook','silent'] },

    { name:'Dell XPS 15 9530 Intel i9 32GB 1TB RTX 4070', category:'Electronics', subcategory:'Laptops', brand:'Dell', price:199900, salePrice:179900, stock:10, emoji:'💻', rating:4.7, numReviews:1980,
      imageUrl:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80',
      images:['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80'],
      description:'The pinnacle of Windows laptop engineering. Intel Core i9 with RTX 4070 for professional-grade creative work and gaming.',
      specs:{ Processor:'Intel Core i9-13900H', RAM:'32GB DDR5', Storage:'1TB NVMe SSD', Display:'15.6" OLED 3.5K 60Hz Touch', Battery:'9 hours', Graphics:'NVIDIA RTX 4070 8GB', Ports:'2x Thunderbolt 4, 1x USB-A, SD Card, 3.5mm', Weight:'1.86 kg', OS:'Windows 11 Pro', Color:'Platinum Silver' },
      features:['Core i9-13900H processor','RTX 4070 8GB GDDR6','32GB DDR5 RAM','3.5K OLED touchscreen','Thunderbolt 4','Fingerprint reader','Backlit keyboard','IR webcam with Windows Hello','WiFi 6E'],
      status:'active', sku:'DLL-XPS15-I9', tags:['dell','xps','laptop','rtx','creator','i9'] },

    { name:'HP Spectre x360 14" Intel i7 16GB 1TB OLED', category:'Electronics', subcategory:'Laptops', brand:'HP', price:159900, salePrice:139900, stock:12, emoji:'💻', rating:4.7, numReviews:2300,
      imageUrl:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
      images:['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'],
      description:'Convertible 2-in-1 laptop with stunning OLED display. Rotate 360° to use as tablet, tent, or laptop mode.',
      specs:{ Processor:'Intel Core i7-1355U', RAM:'16GB LPDDR5', Storage:'1TB SSD', Display:'14" 2.8K OLED Touch 120Hz', Battery:'17 hours', Graphics:'Intel Iris Xe', Ports:'2x Thunderbolt 4, USB-A, HDMI 2.0b, SD Card', Weight:'1.56 kg', OS:'Windows 11 Home', Color:'Nocturne Blue' },
      features:['360° convertible design','OLED 2.8K 120Hz touch','HP Pen included','17-hour battery','IR camera with Windows Hello','WiFi 6E','Bluetooth 5.3','4-speaker Bang & Olufsen audio'],
      status:'active', sku:'HP-SPECTRE360-14', tags:['hp','spectre','2in1','convertible','oled'] },

    { name:'Lenovo ThinkPad X1 Carbon Gen 11 i7 16GB 512GB', category:'Electronics', subcategory:'Laptops', brand:'Lenovo', price:159900, salePrice:144900, stock:15, emoji:'💻', rating:4.8, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80',
      images:['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80'],
      description:'The legendary business laptop. Ultra-lightweight carbon fibre chassis, legendary ThinkPad keyboard, and MIL-STD 810H durability for road warriors.',
      specs:{ Processor:'Intel Core i7-1365U', RAM:'16GB LPDDR5', Storage:'512GB SSD', Display:'14" IPS 2.8K Anti-glare', Battery:'15 hours', Graphics:'Intel Iris Xe', Ports:'2x Thunderbolt 4, 2x USB-A, HDMI 2.1, SD Card', Weight:'1.12 kg', OS:'Windows 11 Pro', Color:'Deep Black' },
      features:['Carbon fibre chassis 1.12 kg','MIL-STD 810H certified','ThinkPad legendary keyboard','TrackPoint pointing device','IR camera + fingerprint','WiFi 6E','4G LTE option','24-hour battery life'],
      status:'active', sku:'LNV-X1C-G11', tags:['lenovo','thinkpad','business','ultralight','mil-std'] },

    { name:'Asus ROG Zephyrus G14 AMD Ryzen 9 16GB 1TB RTX 4060', category:'Electronics', subcategory:'Laptops', brand:'Asus', price:139990, salePrice:124990, stock:20, emoji:'💻', rating:4.8, numReviews:4500,
      imageUrl:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
      images:['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'],
      description:'The ultimate compact gaming laptop. Ryzen 9 + RTX 4060 in a 14" chassis with unique AniMe Matrix LED panel and 165Hz QHD+ display.',
      specs:{ Processor:'AMD Ryzen 9 7940HS', RAM:'16GB DDR5', Storage:'1TB NVMe SSD', Display:'14" QHD+ OLED 165Hz', Battery:'10 hours', Graphics:'NVIDIA RTX 4060 8GB', Ports:'1x Thunderbolt 4, 2x USB-A, HDMI 2.1, SD Card, 3.5mm', Weight:'1.65 kg', OS:'Windows 11 Home', Color:'Eclipse Gray' },
      features:['RTX 4060 8GB GDDR6','Ryzen 9 7940HS 8-core','AniMe Matrix 1449 LEDs','QHD+ OLED 165Hz display','ROG Intelligent Cooling','Dual fans + liquid metal','WiFi 6E','Dolby Atmos sound'],
      status:'active', sku:'ASUS-ROG-G14-2024', tags:['asus','rog','gaming','rtx 4060','amd','compact'] },

    { name:'HP Pavilion Gaming 15 Ryzen 5 8GB 512GB GTX 1650', category:'Electronics', subcategory:'Laptops', brand:'HP', price:65990, salePrice:54990, stock:30, emoji:'💻', rating:4.4, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
      images:['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80'],
      description:'Entry-level gaming laptop with GTX 1650 and 144Hz display. Perfect for casual gamers and content creators on a budget.',
      specs:{ Processor:'AMD Ryzen 5 7535HS', RAM:'8GB DDR5', Storage:'512GB SSD', Display:'15.6" FHD IPS 144Hz', Battery:'8 hours', Graphics:'NVIDIA GTX 1650 4GB', Ports:'USB-C, 2x USB-A, HDMI, SD Card', Weight:'2.35 kg', OS:'Windows 11 Home', Color:'Shadow Black' },
      features:['GTX 1650 4GB','144Hz gaming display','Ryzen 5 7535HS','Backlit WASD keyboard','HP Omen Gaming Hub','WiFi 6','Dual fans'],
      status:'active', sku:'HP-PAV15G', tags:['hp','gaming','gtx 1650','ryzen','budget gaming'] },

    { name:'Acer Aspire 5 Intel i5 8GB 512GB 15.6" FHD', category:'Electronics', subcategory:'Laptops', brand:'Acer', price:49990, salePrice:42990, stock:40, emoji:'💻', rating:4.3, numReviews:5600,
      imageUrl:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80',
      images:['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80'],
      description:'Reliable everyday laptop for students and professionals. Intel i5 with fast SSD storage and all-day battery life.',
      specs:{ Processor:'Intel Core i5-1235U', RAM:'8GB DDR4', Storage:'512GB SSD', Display:'15.6" FHD IPS Anti-glare', Battery:'10 hours', Graphics:'Intel Iris Xe', Ports:'USB-C, 2x USB-A, HDMI, SD Card', Weight:'1.77 kg', OS:'Windows 11 Home', Color:'Pure Silver' },
      features:['Intel Core i5-1235U','Backlit keyboard','Fingerprint reader','Alexa built-in','WiFi 6','Bluetooth 5.2','10-hour battery'],
      status:'active', sku:'ACR-ASPIRE5-I5', tags:['acer','aspire','student','everyday','budget'] },

    // ═══════════════════════════════════════════
    // SPORTS & FITNESS (25 products)
    // ═══════════════════════════════════════════
    { name:'Liforme Original Yoga Mat 4.2mm', category:'Sports & Fitness', subcategory:'Yoga', brand:'Liforme', price:9999, salePrice:7499, stock:40, emoji:'🧘', rating:4.7, numReviews:3200,
      imageUrl:'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80',
      images:['https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80','https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80'],
      description:'The world\'s best yoga mat. Unique alignment marker system helps perfect your form. GripForMe non-slip surface works even when wet with sweat.',
      specs:{ Dimensions:'185 x 68 cm', Thickness:'4.2mm', Material:'Natural rubber + eco-PU', Weight:'2.5 kg', Surface:'GripForMe texture', Certification:'Eco-friendly, PVC-free', Includes:'Free carry strap' },
      features:['GripForMe non-slip surface','Unique alignment marker system','Natural rubber base','Eco-PU surface','4.2mm cushioning','Works wet or dry','Free carry strap included','PVC-free eco-friendly','185cm length'],
      status:'active', sku:'LFM-YM-ORG', tags:['yoga','liforme','fitness','mat','eco'] },

    { name:'Adidas Yoga Mat Premium 6mm Non-Slip', category:'Sports & Fitness', subcategory:'Yoga', brand:'Adidas', price:2999, salePrice:1999, stock:80, emoji:'🧘', rating:4.4, numReviews:4500,
      imageUrl:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80',
      images:['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80'],
      description:'High-density foam yoga mat with non-slip surface and carrying strap. Perfect for beginners and intermediate yogis.',
      specs:{ Dimensions:'173 x 61 cm', Thickness:'6mm', Material:'TPE foam', Weight:'1.1 kg', Surface:'Textured non-slip' },
      features:['6mm thick cushioning','Non-slip textured surface','TPE eco-friendly foam','Moisture resistant','Carrying strap included','Lightweight 1.1kg'],
      status:'active', sku:'ADI-YM-6MM', tags:['adidas','yoga','mat','beginners'] },

    { name:'Boldfit Hex Rubber Dumbbell Set 5-25kg Pair', category:'Sports & Fitness', subcategory:'Gym Equipment', brand:'Boldfit', price:8999, salePrice:6999, stock:25, emoji:'🏋️', rating:4.6, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
      images:['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80','https://images.unsplash.com/photo-1534367990512-be6b7f22c4c5?w=500&q=80'],
      description:'Complete dumbbell set for home gym. Hex design prevents rolling, rubber coating protects floors. Perfect for home workouts.',
      specs:{ Weights:'5kg, 10kg, 15kg, 20kg, 25kg pairs', Material:'Cast iron + rubber coating', Handle:'Chrome knurled', Shape:'Hexagonal anti-roll' },
      features:['Hexagonal anti-roll design','Rubber coated floor-friendly','Chrome knurled handles','Cast iron core','Sold as pairs','Anti-slip grip'],
      status:'active', sku:'BLF-HDB-SET', tags:['dumbbells','gym','weights','home gym','boldfit'] },

    { name:'Boldfit Adjustable Dumbbell 20kg Pair', category:'Sports & Fitness', subcategory:'Gym Equipment', brand:'Boldfit', price:4999, salePrice:3499, stock:30, emoji:'🏋️', rating:4.5, numReviews:2800,
      imageUrl:'https://images.unsplash.com/photo-1534367990512-be6b7f22c4c5?w=500&q=80',
      images:['https://images.unsplash.com/photo-1534367990512-be6b7f22c4c5?w=500&q=80'],
      description:'Adjustable weight from 2.5kg to 20kg each. Replaces 8 pairs of dumbbells. Compact space-saving design for home gyms.',
      specs:{ WeightRange:'2.5kg to 20kg each', Increments:'2.5kg', Material:'Steel + ABS', Dimensions:'38 x 18 x 18 cm each' },
      features:['Adjustable 2.5kg to 20kg','Replaces 8 pairs of dumbbells','Compact design','Quick weight change','Anti-slip handle'],
      status:'active', sku:'BLF-ADJDB-20', tags:['dumbbells','adjustable','home gym','space saving'] },

    { name:'Decathlon Domyos Weight Training Bench', category:'Sports & Fitness', subcategory:'Gym Equipment', brand:'Decathlon', price:7999, salePrice:5999, stock:15, emoji:'🏋️', rating:4.5, numReviews:2100,
      imageUrl:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
      images:['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80'],
      description:'Adjustable weight bench with 6 back positions. Max load 200kg. Foldable design for easy storage.',
      specs:{ Positions:'6 back positions + 3 seat positions', MaxLoad:'200kg', Dimensions:'120 x 48 x 45 cm', Weight:'10kg', Material:'Steel frame + foam padding' },
      features:['6 adjustable positions','200kg max load','Foldable for storage','Anti-slip feet','Foam padded seat and back','Steel frame'],
      status:'active', sku:'DCT-BENCH-ADJ', tags:['bench','gym','weight training','adjustable','decathlon'] },

    { name:'Cosco Rubber Football Size 5 Club Pro', category:'Sports & Fitness', subcategory:'Football', brand:'Cosco', price:1299, salePrice:899, stock:100, emoji:'⚽', rating:4.5, numReviews:7800,
      imageUrl:'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&q=80',
      images:['https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&q=80'],
      description:'Match-standard rubber football. 32-panel machine stitched, butyl bladder for long air retention. Used by school teams across India.',
      specs:{ Size:'Size 5 (Match Standard)', Material:'PU outer + butyl bladder', Panels:'32 panels', Stitching:'Machine stitched', AirRetention:'Long-lasting butyl bladder' },
      features:['FIFA-standard size 5','32-panel design','Butyl bladder long air retention','Machine stitched','All-weather rubber outer','Consistent bounce'],
      status:'active', sku:'CSC-FB5-CLUB', tags:['football','cosco','size 5','match ball'] },

    { name:'Nivia Force Football Size 5 PU', category:'Sports & Fitness', subcategory:'Football', brand:'Nivia', price:1599, salePrice:1099, stock:80, emoji:'⚽', rating:4.4, numReviews:4500,
      imageUrl:'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&q=80',
      images:['https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&q=80'],
      description:'Hand-stitched PU leather football for training and matches. Excellent touch and control with consistent flight path.',
      specs:{ Size:'Size 5', Material:'PU leather + latex bladder', Panels:'32 panels hand-stitched', Weight:'420-445g' },
      features:['Hand-stitched PU leather','Latex bladder','Water resistant','Excellent touch','32 panels','Training & match use'],
      status:'active', sku:'NVA-FORCE-FB5', tags:['football','nivia','pu leather','hand stitched'] },

    { name:'Yonex Astrox 99 Pro Badminton Racket', category:'Sports & Fitness', subcategory:'Badminton', brand:'Yonex', price:12999, salePrice:10999, stock:20, emoji:'🏸', rating:4.8, numReviews:2100,
      imageUrl:'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80',
      images:['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80'],
      description:'World champion level badminton racket. Head-heavy balance for smashing power. Used by professional players including Kidambi Srikanth.',
      specs:{ Weight:'4U (80g) G5', Flexibility:'Stiff', Frame:'HM Graphite + NANOMETRIC DR', Shaft:'HM Graphite + NANOMETRIC', Balance:'Head Heavy', StringTension:'Up to 35 lbs' },
      features:['HM Graphite frame','NANOMETRIC DR technology','Head-heavy balance for power','Stiff flex for advanced players','Rotational Generator System','Up to 35 lbs string tension'],
      status:'active', sku:'YNX-AX99PRO', tags:['yonex','badminton','pro','racket','smash'] },

    { name:'Victor Thruster K 9900 Badminton Racket', category:'Sports & Fitness', subcategory:'Badminton', brand:'Victor', price:8999, salePrice:7499, stock:15, emoji:'🏸', rating:4.7, numReviews:1400,
      imageUrl:'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80',
      images:['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80'],
      description:'Professional badminton racket with high-modulus graphite frame and PYROFIL carbon fiber for exceptional stiffness.',
      specs:{ Weight:'3U (88g) G1', Flexibility:'Extra Stiff', Frame:'High Modulus Graphite + PYROFIL', Balance:'Extra Head Heavy' },
      features:['PYROFIL carbon fiber','Extra stiff flex','Extra head heavy','Professional level','High string tension support'],
      status:'active', sku:'VCT-TK9900', tags:['victor','badminton','professional','racket'] },

    { name:'Nivia Kashmir Willow Cricket Bat Full Size', category:'Sports & Fitness', subcategory:'Cricket', brand:'Nivia', price:2499, salePrice:1799, stock:45, emoji:'🏏', rating:4.4, numReviews:3100,
      imageUrl:'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80',
      images:['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80'],
      description:'Grade A Kashmir willow cricket bat for amateur and intermediate players. English cane handle with excellent balance and pickup.',
      specs:{ Size:'Full Size (SH)', Material:'Kashmir Willow blade + Cane handle', Weight:'1.1-1.25 kg', Edges:'35-38mm', Spine:'60mm', Handle:'English cane oval handle' },
      features:['Grade A Kashmir willow','English cane handle','Full size SH','Pre-oiled and ready to play','35-38mm edges','Rope grip handle'],
      status:'active', sku:'NVA-KW-FULL', tags:['cricket','nivia','kashmir willow','bat','full size'] },

    { name:'SS Ton Master Edition Cricket Bat', category:'Sports & Fitness', subcategory:'Cricket', brand:'SS', price:5999, salePrice:4999, stock:20, emoji:'🏏', rating:4.7, numReviews:2400,
      imageUrl:'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80',
      images:['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80'],
      description:'English willow cricket bat for serious club players. Excellent grain quality with thick edges and high spine for powerful shots.',
      specs:{ Size:'Full Size SH', Material:'Grade 3 English Willow', Weight:'1.15-1.22 kg', Edges:'38-42mm', Spine:'62mm+', Grains:'6+ straight grains' },
      features:['Grade 3 English willow','6+ straight grains','Thick 38-42mm edges','High spine 62mm+','SS sticker','Pre-knocked','Leather toe guard'],
      status:'active', sku:'SS-TON-MASTER', tags:['cricket','ss','english willow','club','bat'] },

    { name:'MRF Genius Grand Cricket Bat Virat Kohli', category:'Sports & Fitness', subcategory:'Cricket', brand:'MRF', price:4499, salePrice:3799, stock:30, emoji:'🏏', rating:4.6, numReviews:5600,
      imageUrl:'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80',
      images:['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80'],
      description:'Virat Kohli\'s MRF bat. Grade 4 English willow, same profile used by the cricket legend. Long spine and rounded toe for power hitting.',
      specs:{ Size:'Full Size SH', Material:'Grade 4 English Willow', Weight:'1.12-1.20 kg', Signature:'Virat Kohli replica profile' },
      features:['Virat Kohli profile','Grade 4 English willow','Pre-knocked ready to play','MRF sticker','Long handle option','Excellent pickup'],
      status:'active', sku:'MRF-GENIUS-VK', tags:['cricket','mrf','virat kohli','english willow','bat'] },

    { name:'Decathlon Artengo Tennis Racket TR100', category:'Sports & Fitness', subcategory:'Tennis', brand:'Decathlon', price:1499, salePrice:999, stock:60, emoji:'🎾', rating:4.3, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&q=80',
      images:['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&q=80'],
      description:'Beginner tennis racket with large sweet spot for forgiving hits. Lightweight aluminium frame perfect for recreational play.',
      specs:{ Weight:'270g strung', HeadSize:'255 sq cm', StringPattern:'16x21', Frame:'Aluminium', Balance:'Even' },
      features:['Large 255 sq cm head','Lightweight 270g','Pre-strung','Forgiving sweet spot','Beginner friendly','Includes cover'],
      status:'active', sku:'DCT-TR100', tags:['tennis','decathlon','beginner','racket','aluminium'] },

    { name:'Nivia Swimming Goggles Mercury', category:'Sports & Fitness', subcategory:'Swimming', brand:'Nivia', price:799, salePrice:499, stock:120, emoji:'🏊', rating:4.2, numReviews:4100,
      imageUrl:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80',
      images:['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80'],
      description:'UV400 anti-fog swimming goggles. Adjustable silicone strap, soft PVC frame, comfortable seal for long swim sessions.',
      specs:{ Material:'PVC + Silicone', UV:'UV400 protection', AntiF:og:'Yes', AdjustableStrap:'Yes', Weight:'38g' },
      features:['UV400 protection','Anti-fog coating','Silicone adjustable strap','Soft PVC frame','Wide vision','100% UV blocked'],
      status:'active', sku:'NVA-GOG-MERC', tags:['swimming','goggles','nivia','uv protection','anti-fog'] },

    { name:'Arena Spider Ultra Swimming Goggles', category:'Sports & Fitness', subcategory:'Swimming', brand:'Arena', price:1499, salePrice:1199, stock:50, emoji:'🏊', rating:4.6, numReviews:2800,
      imageUrl:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80',
      images:['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80'],
      description:'Professional competition swimming goggles. Wide panoramic vision, anti-fog, UV protection. Used by competitive swimmers.',
      specs:{ Type:'Competition', UV:'UV protection', AntiF:og:'Yes', Frame:'Low-profile', Strap:'Double silicone' },
      features:['Wide panoramic vision','Low-profile competition design','Double silicone strap','Anti-fog','UV protection','4 nose bridge sizes'],
      status:'active', sku:'ARN-SPIDER', tags:['swimming','arena','competition','goggles'] },

    { name:'Adidas Predator Pro Goalkeeper Gloves', category:'Sports & Fitness', subcategory:'Football', brand:'Adidas', price:3999, salePrice:2999, stock:30, emoji:'🧤', rating:4.6, numReviews:1800,
      imageUrl:'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&q=80',
      images:['https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&q=80'],
      description:'Professional GK gloves with DEMONSKIN grip spines for extra ball control. Negative cut for tight, glove-like fit.',
      specs:{ Palm:'Latex with DEMONSKIN','Cut':'Negative cut', Closure:'Adjustable wrist strap', Sizes:'7-11' },
      features:['DEMONSKIN grip technology','Negative cut','Latex palm','Finger spines','Adjustable wrist strap','Pro level'],
      status:'active', sku:'ADI-PRED-GK', tags:['adidas','goalkeeper','gloves','football','pro'] },

    { name:'Decathlon Kipsta Basketball Size 7', category:'Sports & Fitness', subcategory:'Basketball', brand:'Decathlon', price:999, salePrice:699, stock:80, emoji:'🏀', rating:4.3, numReviews:3200,
      imageUrl:'https://images.unsplash.com/photo-1546519638405-a9d1d1c6e2f2?w=500&q=80',
      images:['https://images.unsplash.com/photo-1546519638405-a9d1d1c6e2f2?w=500&q=80'],
      description:'Rubber outdoor basketball for recreation and training. Durable rubber cover, deep channels for grip.',
      specs:{ Size:'Size 7 (Official)', Material:'Rubber', Circumference:'74-76 cm', Weight:'567-650g', Use:'Outdoor' },
      features:['Size 7 official','Rubber outer','Deep channel grooves','Butyl bladder','Outdoor durable','Consistent bounce'],
      status:'active', sku:'DCT-BBALL-7', tags:['basketball','decathlon','outdoor','size 7'] },

    { name:'Spalding NBA Official Basketball Size 7', category:'Sports & Fitness', subcategory:'Basketball', brand:'Spalding', price:4999, salePrice:3999, stock:25, emoji:'🏀', rating:4.7, numReviews:2100,
      imageUrl:'https://images.unsplash.com/photo-1546519638405-a9d1d1c6e2f2?w=500&q=80',
      images:['https://images.unsplash.com/photo-1546519638405-a9d1d1c6e2f2?w=500&q=80'],
      description:'Official NBA game ball material. Composite leather for indoor and outdoor use. Superior feel and consistent bounce.',
      specs:{ Size:'Size 7', Material:'Composite leather', Use:'Indoor/Outdoor', Certification:'NBA official material' },
      features:['NBA official material','Composite leather','Indoor/outdoor use','Superior grip','Consistent bounce','Deep channels'],
      status:'active', sku:'SPL-NBA-7', tags:['basketball','spalding','nba','composite leather'] },

    { name:'Cosco Squash Racket Championship', category:'Sports & Fitness', subcategory:'Squash', brand:'Cosco', price:1999, salePrice:1499, stock:35, emoji:'🎾', rating:4.3, numReviews:1200,
      imageUrl:'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80',
      images:['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80'],
      description:'Aluminium squash racket for recreational play. Lightweight and durable for beginners and casual players.',
      specs:{ Weight:'185g', Frame:'Aluminium', HeadSize:'500 sq cm', StringPattern:'16x17', Includes:'Squash ball' },
      features:['Lightweight aluminium','Pre-strung','Includes squash ball','Beginner friendly','Cover included'],
      status:'active', sku:'CSC-SQ-CHAMP', tags:['squash','cosco','racket','beginner'] },

    { name:'Nivia Volleyball Official Size 4', category:'Sports & Fitness', subcategory:'Volleyball', brand:'Nivia', price:1299, salePrice:899, stock:60, emoji:'🏐', rating:4.4, numReviews:2400,
      imageUrl:'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&q=80',
      images:['https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500&q=80'],
      description:'PU leather volleyball for training and match play. Machine stitched with butyl bladder for consistent air retention.',
      specs:{ Size:'Official Size 4', Material:'PU leather', Panels:'18 panels', Circumference:'65-67 cm' },
      features:['18-panel PU leather','Machine stitched','Butyl bladder','Training & match use','Official circumference'],
      status:'active', sku:'NVA-VB-OFF4', tags:['volleyball','nivia','pu leather','official'] },

    { name:'Decathlon Running Shoes Kiprun KD500 Men', category:'Sports & Fitness', subcategory:'Running', brand:'Decathlon', price:3999, salePrice:2999, stock:50, emoji:'👟', rating:4.5, numReviews:5600,
      imageUrl:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      images:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
      description:'Cushioned road running shoes for regular runners. Drop 8mm, foam midsole with responsive bounce, breathable mesh upper.',
      specs:{ Drop:'8mm', Midsole:'Foam cushioning', Upper:'Breathable mesh', Outsole:'Rubber', Weight:'280g per shoe' },
      features:['8mm drop','Cushioned foam midsole','Breathable mesh upper','Rubber grip outsole','Reflective details','Wide toe box'],
      status:'active', sku:'DCT-KD500-M', tags:['running','decathlon','road running','cushioned','men'] },

    { name:'Asics Gel-Nimbus 25 Running Shoes', category:'Sports & Fitness', subcategory:'Running', brand:'Asics', price:16999, salePrice:13999, stock:25, emoji:'👟', rating:4.7, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      images:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
      description:'Premium running shoes with FF BLAST+ ECO foam for maximum cushioning. Perfect for long-distance running and marathons.',
      specs:{ Drop:'8mm', Midsole:'FF BLAST+ ECO', GEL:'Forefoot and rearfoot GEL', Upper:'ASICS LITE fabric', Weight:'300g per shoe' },
      features:['FF BLAST+ ECO midsole','Forefoot and rearfoot GEL','ASICS LITE upper','PureGEL technology','Reflective details','Marathon ready'],
      status:'active', sku:'ASC-GN25', tags:['asics','running','gel','marathon','cushioned'] },

    { name:'Power Band Resistance Bands Set of 5', category:'Sports & Fitness', subcategory:'Gym Equipment', brand:'Boldfit', price:999, salePrice:699, stock:100, emoji:'💪', rating:4.4, numReviews:6700,
      imageUrl:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
      images:['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80'],
      description:'Set of 5 resistance bands from extra-light to extra-heavy. Perfect for stretching, physical therapy, and strength training.',
      specs:{ Bands:'5 levels (2-45 kg resistance)', Material:'100% natural latex', Colors:'Yellow, Red, Black, Purple, Green', Includes:'Carry bag' },
      features:['5 resistance levels','Natural latex','Door anchor included','Handles included','Ankle straps included','Carry bag','Physical therapy safe'],
      status:'active', sku:'BLF-RESBAND-5', tags:['resistance bands','gym','home workout','boldfit','5 piece'] },

    { name:'Decathlon Skipping Rope Weighted', category:'Sports & Fitness', subcategory:'Gym Equipment', brand:'Decathlon', price:699, salePrice:499, stock:150, emoji:'🪢', rating:4.3, numReviews:4500,
      imageUrl:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80',
      images:['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80'],
      description:'Weighted jump rope for improved cardio and calorie burn. Adjustable length, foam handles, 300g weight for resistance training.',
      specs:{ Weight:'300g total', HandleWeight:'150g each', Length:'Adjustable up to 3m', Material:'PVC rope + foam handles' },
      features:['Weighted handles 300g','Adjustable length','Foam grip handles','Counter in handle','Cardio training','Calorie burn booster'],
      status:'active', sku:'DCT-SKIPROPE', tags:['skipping rope','jump rope','cardio','decathlon','weighted'] },

    // ═══════════════════════════════════════════
    // BOOKS (25 products)
    // ═══════════════════════════════════════════
    { name:'Atomic Habits by James Clear', category:'Books', subcategory:'Self Help', brand:'Penguin', price:799, salePrice:499, stock:300, emoji:'📚', rating:4.9, numReviews:45000,
      imageUrl:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
      images:['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80','https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80'],
      description:'The #1 New York Times bestseller. Tiny changes, remarkable results. A proven framework for improving every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviours that lead to remarkable results.',
      specs:{ Author:'James Clear', Pages:'320', Publisher:'Penguin Books', Published:'October 2018', ISBN:'978-0735211292', Language:'English', Format:'Paperback', Genre:'Self Help / Habits' },
      features:['#1 New York Times Bestseller','#1 Sunday Times Bestseller','Over 15 million copies sold worldwide','Simple and practical framework','Proven strategies','Case studies and examples','Available in Hindi also'],
      status:'active', sku:'BK-AH-CLEAR', tags:['habits','self-help','james clear','bestseller','productivity'] },

    { name:'Rich Dad Poor Dad by Robert Kiyosaki', category:'Books', subcategory:'Finance', brand:'Manjul Publishing', price:499, salePrice:299, stock:400, emoji:'📚', rating:4.7, numReviews:38000,
      imageUrl:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
      images:['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80'],
      description:'The best-selling personal finance book of all time. Rich Dad Poor Dad is Robert Kiyosaki\'s story of growing up with two dads — his real father and the father of his best friend — and the ways in which both men shaped his thoughts about money and investing.',
      specs:{ Author:'Robert T. Kiyosaki', Pages:'336', Publisher:'Manjul Publishing', Published:'1997 (25th Anniversary Edition)', ISBN:'978-1612681122', Language:'English + Hindi editions', Format:'Paperback', Genre:'Personal Finance' },
      features:['25+ years bestseller','Over 32 million copies sold','Best personal finance book of all time','Translated in 109 languages','25th Anniversary Edition with updates','Teaches financial literacy'],
      status:'active', sku:'BK-RDPD-KIYOSAKI', tags:['finance','investing','robert kiyosaki','money','bestseller'] },

    { name:'The Psychology of Money by Morgan Housel', category:'Books', subcategory:'Finance', brand:'Jaico Publishing', price:599, salePrice:399, stock:250, emoji:'📚', rating:4.8, numReviews:29000,
      imageUrl:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
      images:['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80'],
      description:'Timeless lessons on wealth, greed, and happiness. Morgan Housel presents 19 short stories exploring the strange ways people think about money and teaches how to make better sense of one of life\'s most important topics.',
      specs:{ Author:'Morgan Housel', Pages:'256', Publisher:'Harriman House', Published:'September 2020', ISBN:'978-0857199096', Language:'English', Format:'Paperback', Genre:'Personal Finance / Psychology' },
      features:['19 thought-provoking chapters','Accessible for beginners','Psychological approach to finance','Case studies from history','Wall Street Journal bestseller','Over 4 million copies sold'],
      status:'active', sku:'BK-POM-HOUSEL', tags:['psychology','money','morgan housel','finance','investing'] },

    { name:'Zero to One by Peter Thiel', category:'Books', subcategory:'Business', brand:'Virgin Books', price:699, salePrice:449, stock:200, emoji:'📚', rating:4.6, numReviews:18000,
      imageUrl:'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
      images:['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80'],
      description:'Notes on startups, or how to build the future. Peter Thiel, legendary entrepreneur and investor, shares contrarian thinking behind the success of PayPal and early investment in Facebook in this essential guide for startup founders.',
      specs:{ Author:'Peter Thiel with Blake Masters', Pages:'224', Publisher:'Crown Business', Published:'September 2014', ISBN:'978-0804139021', Language:'English', Format:'Paperback', Genre:'Business / Entrepreneurship' },
      features:['Essential startup reading','Contrarian business insights','PayPal founder wisdom','Stanford class notes','Monopoly theory','Thinking about the future'],
      status:'active', sku:'BK-ZTO-THIEL', tags:['startup','business','peter thiel','entrepreneurship','silicon valley'] },

    { name:'Ikigai by Héctor García', category:'Books', subcategory:'Self Help', brand:'Penguin Life', price:399, salePrice:249, stock:350, emoji:'📚', rating:4.7, numReviews:32000,
      imageUrl:'https://images.unsplash.com/photo-1519682577862-22b62b24049b?w=500&q=80',
      images:['https://images.unsplash.com/photo-1519682577862-22b62b24049b?w=500&q=80'],
      description:'The Japanese secret to a long and happy life. The people of Okinawa, Japan — one of the world\'s Blue Zones — are among the longest-lived on earth. Their secret? Ikigai — a concept that means finding the reason for being.',
      specs:{ Author:'Héctor García and Francesc Miralles', Pages:'208', Publisher:'Hutchinson', Published:'August 2017', Language:'English (Translated from Spanish/Japanese)', Format:'Paperback', Genre:'Self Help / Philosophy / Japan' },
      features:['Lessons from the longest-lived people','Japanese philosophy of life','Find your reason for being','Simple and inspiring','Blue Zone wisdom','International bestseller'],
      status:'active', sku:'BK-IKIGAI', tags:['ikigai','japanese','happiness','longevity','self-help'] },

    { name:'Think and Grow Rich by Napoleon Hill', category:'Books', subcategory:'Self Help', brand:'Fingerprint Publishing', price:299, salePrice:199, stock:500, emoji:'📚', rating:4.7, numReviews:52000,
      imageUrl:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
      images:['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80'],
      description:'The classic masterpiece on success and personal achievement. Written after 20 years of research studying successful people including Andrew Carnegie, Henry Ford, and Thomas Edison.',
      specs:{ Author:'Napoleon Hill', Pages:'320', Publisher:'Fingerprint Publishing', Published:'1937 (Updated Edition)', ISBN:'978-8172342517', Language:'English + Hindi', Format:'Paperback', Genre:'Success / Self Help' },
      features:['Classic since 1937','100+ million copies sold','13 principles of success','Based on 500 interviews with successful people','Timeless wisdom','Available in 20+ languages'],
      status:'active', sku:'BK-TAGR-HILL', tags:['napoleon hill','think grow rich','success','classic','self help'] },

    { name:'The Alchemist by Paulo Coelho', category:'Books', subcategory:'Fiction', brand:'HarperOne', price:399, salePrice:249, stock:400, emoji:'📚', rating:4.8, numReviews:89000,
      imageUrl:'https://images.unsplash.com/photo-1519682577862-22b62b24049b?w=500&q=80',
      images:['https://images.unsplash.com/photo-1519682577862-22b62b24049b?w=500&q=80'],
      description:'A magical story about following your dreams. Santiago, an Andalusian shepherd boy, travels from Spain to Egypt to find a treasure buried near the Pyramids. A beautiful fable about the essential wisdom of listening to our hearts.',
      specs:{ Author:'Paulo Coelho', Pages:'208', Publisher:'HarperOne', Published:'1988 (English translation 1993)', ISBN:'978-0062315007', Language:'English (Translated from Portuguese)', Format:'Paperback', Genre:'Fiction / Philosophical Novel' },
      features:['65+ million copies sold','Translated in 80+ languages','UNESCO award-winning','Philosophy of dreams','Magical realism','Inspirational journey'],
      status:'active', sku:'BK-ALCH-COELHO', tags:['paulo coelho','alchemist','fiction','philosophy','dreams'] },

    { name:'Harry Potter and the Philosopher\'s Stone', category:'Books', subcategory:'Fiction', brand:'Bloomsbury', price:499, salePrice:349, stock:300, emoji:'📚', rating:4.9, numReviews:120000,
      imageUrl:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
      images:['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80'],
      description:'The book that started it all. Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. A thrilling, enchanting, brilliantly original masterpiece.',
      specs:{ Author:'J.K. Rowling', Pages:'352', Publisher:'Bloomsbury', Published:'June 1997', ISBN:'978-0747532699', Language:'English', Format:'Paperback', Series:'Harry Potter Book 1 of 7' },
      features:['Book 1 of 7 in series','500 million copies sold worldwide','Translated in 80 languages','Multiple awards winner','Inspired 8 blockbuster films','Perfect for ages 9+'],
      status:'active', sku:'BK-HP1-ROWLING', tags:['harry potter','jk rowling','fantasy','fiction','magic','children'] },

    { name:'Wings of Fire by APJ Abdul Kalam', category:'Books', subcategory:'Biography', brand:'Universities Press', price:349, salePrice:199, stock:500, emoji:'📚', rating:4.9, numReviews:67000,
      imageUrl:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
      images:['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80'],
      description:'The autobiography of Dr. APJ Abdul Kalam, India\'s Missile Man and 11th President of India. An inspiring journey from a small town in Tamil Nadu to the highest office in the land.',
      specs:{ Author:'APJ Abdul Kalam with Arun Tiwari', Pages:'196', Publisher:'Universities Press', Published:'1999', ISBN:'978-8173714467', Language:'English + Hindi + Tamil + Telugu', Format:'Paperback', Genre:'Autobiography / Biography' },
      features:['Autobiography of India\'s President','Inspirational journey','Missile Man of India','Science and dreams','National bestseller','Available in multiple Indian languages'],
      status:'active', sku:'BK-WOF-KALAM', tags:['apj kalam','wings of fire','autobiography','india','inspiration'] },

    { name:'The 5 AM Club by Robin Sharma', category:'Books', subcategory:'Self Help', brand:'HarperCollins India', price:499, salePrice:349, stock:250, emoji:'📚', rating:4.6, numReviews:28000,
      imageUrl:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
      images:['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80'],
      description:'Own your morning, elevate your life. Robin Sharma shares a morning routine that will help you be more productive, healthier, and happier. The 20/20/20 formula for winning the morning.',
      specs:{ Author:'Robin Sharma', Pages:'336', Publisher:'HarperCollins India', Published:'December 2018', ISBN:'978-0008312831', Language:'English', Format:'Paperback', Genre:'Self Help / Productivity' },
      features:['20/20/20 morning formula','Storytelling approach','Practical morning routine','World\'s top performance coach','International bestseller','Backed by science'],
      status:'active', sku:'BK-5AMC-SHARMA', tags:['robin sharma','5am club','morning routine','productivity','self help'] },

    // ═══════════════════════════════════════════
    // FASHION - MEN'S CLOTHING (15 products)
    // ═══════════════════════════════════════════
    { name:'Tommy Hilfiger Classic Polo T-Shirt', category:'Fashion', subcategory:"Men's Clothing", brand:'Tommy Hilfiger', price:3499, salePrice:2499, stock:90, emoji:'👕', rating:4.6, numReviews:7800,
      imageUrl:'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80',
      images:['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'],
      description:'Classic polo in 100% cotton pique fabric. The quintessential Tommy Hilfiger logo is embroidered at the left chest. Available in multiple colors.',
      specs:{ Material:'100% Cotton Pique', Fit:'Regular Fit', Neck:'Polo collar', Colors:'Navy, White, Red, Sky Blue, Green', Sizes:'S, M, L, XL, XXL', Care:'Machine wash cold' },
      features:['100% cotton pique','Embroidered Tommy logo','Rib-knit collar and cuffs','2-button placket','Side seam vents','Machine washable'],
      status:'active', sku:'TH-POLO-CLASSIC', tags:['tommy hilfiger','polo','men','t-shirt','cotton'] },

    { name:"Levi's 501 Original Jeans Regular Fit", category:'Fashion', subcategory:"Men's Clothing", brand:"Levi's", price:4499, salePrice:2999, stock:100, emoji:'👖', rating:4.6, numReviews:14500,
      imageUrl:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
      images:['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80'],
      description:'The original jean since 1873. Straight leg from hip to hem. 100% cotton rigid denim. Gets better with every wash. The most iconic jeans ever made.',
      specs:{ Material:'100% Cotton Rigid Denim', Fit:'Original Straight', Rise:'Mid rise', Closure:'Button fly', Sizes:'28W-38W, 30L-34L', Wash:'Dark indigo / Stone wash / Black' },
      features:['Original straight fit since 1873','100% cotton rigid denim','Button fly','5-pocket styling','Gets better with age','Iconic red tab','Machine washable'],
      status:'active', sku:'LEV-501-REG', tags:["levi's",'jeans','denim','men','straight fit','classic'] },

    { name:'Allen Solly Slim Fit Formal Shirt White', category:'Fashion', subcategory:"Men's Clothing", brand:'Allen Solly', price:1799, salePrice:1199, stock:120, emoji:'👔', rating:4.4, numReviews:8900,
      imageUrl:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
      images:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'],
      description:'Slim fit office formal shirt in premium cotton. Wrinkle-resistant finish keeps you looking sharp all day. Perfect for office and formal occasions.',
      specs:{ Material:'60% Cotton 40% Polyester', Fit:'Slim Fit', Collar:'Spread collar', Sizes:'S, M, L, XL, XXL', Color:'White, Light Blue, Light Pink', Care:'Machine wash cold' },
      features:['Slim fit cut','Wrinkle-resistant','Premium cotton blend','Spread collar','Full button placket','Machine washable'],
      status:'active', sku:'AS-FORMAL-WHITE', tags:['allen solly','formal','office','shirt','slim fit'] },

    { name:'Van Heusen Regular Fit Chinos Khaki', category:'Fashion', subcategory:"Men's Clothing", brand:'Van Heusen', price:2499, salePrice:1699, stock:80, emoji:'👖', rating:4.3, numReviews:5600,
      imageUrl:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80',
      images:['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80'],
      description:'Cotton stretch chinos for smart-casual wear. Regular fit with slight stretch for comfort. Perfect from office to evening.',
      specs:{ Material:'98% Cotton 2% Elastane', Fit:'Regular Fit', Rise:'Mid rise', Sizes:'30W-38W, 30L-32L', Colors:'Khaki, Navy, Olive, Dark Brown', Care:'Machine wash' },
      features:['Cotton stretch fabric','Regular fit comfort','Smart casual styling','5-pocket design','Machine washable'],
      status:'active', sku:'VH-CHINO-KHAKI', tags:['van heusen','chinos','men','smart casual','cotton'] },

    { name:'US Polo Assn. Men Casual Blazer Navy', category:'Fashion', subcategory:"Men's Clothing", brand:'US Polo Assn.', price:3999, salePrice:2799, stock:40, emoji:'🧥', rating:4.5, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80',
      images:['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80'],
      description:'Stylish casual blazer for smart-casual occasions. Slim fit with notch lapel. Can be worn over a T-shirt or formal shirt.',
      specs:{ Material:'Polyester viscose blend', Fit:'Slim Fit', Closure:'2-button', Sizes:'S, M, L, XL, XXL', Colors:'Navy, Black, Charcoal', Pockets:'2 flap pockets + 1 chest pocket' },
      features:['Slim fit blazer','Notch lapel','2-button closure','Fully lined','Smart-casual styling','Dry clean recommended'],
      status:'active', sku:'USPA-BLAZER-NAVY', tags:['us polo','blazer','men','smart casual','navy'] },

    // ═══════════════════════════════════════════
    // HOME & KITCHEN (15 products)
    // ═══════════════════════════════════════════
    { name:'Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L', category:'Home & Kitchen', subcategory:'Cooking Appliances', brand:'Instant Pot', price:8999, salePrice:5999, stock:35, emoji:'🫕', rating:4.8, numReviews:22000,
      imageUrl:'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80',
      images:['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80'],
      description:'7 appliances in 1: Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté Pan, Yogurt Maker, and Warmer. Cooks up to 70% faster than traditional methods.',
      specs:{ Capacity:'6 Quarts (5.7 litres)', Functions:'7-in-1', Wattage:'1000W', Material:'Stainless steel inner pot', Presets:'13 smart programs', Voltage:'220V-240V', Includes:'Steamer rack, ladle, measuring cup, recipe booklet' },
      features:['7 appliances in 1','Cooks 70% faster','13 smart cooking programs','Delay start up to 24 hours','Auto keep warm 10 hours','Dishwasher safe parts','10+ safety mechanisms','UL certified'],
      status:'active', sku:'IP-DUO7-6L', tags:['instant pot','pressure cooker','multi cooker','kitchen','7in1'] },

    { name:'Philips Air Fryer HD9252 Digital 4.1L', category:'Home & Kitchen', subcategory:'Cooking Appliances', brand:'Philips', price:9999, salePrice:7499, stock:40, emoji:'🍳', rating:4.7, numReviews:12000,
      imageUrl:'https://images.unsplash.com/photo-1648483996737-75e49abb67c2?w=500&q=80',
      images:['https://images.unsplash.com/photo-1648483996737-75e49abb67c2?w=500&q=80'],
      description:'Rapid Air technology ensures your food is crispy on the outside and tender inside — with up to 90% less fat than traditional frying.',
      specs:{ Capacity:'4.1 litres', Wattage:'1400W', Temperature:'80-200°C', TimerMax:'60 minutes', Presets:'8 cooking programs', Display:'Digital LED', Weight:'4.1 kg', Includes:'Recipe booklet' },
      features:['90% less fat than frying','4.1L XXL capacity','8 preset programs','Digital display','Auto shut-off','Dishwasher safe','Rapid Air Circulation','1400W heating element'],
      status:'active', sku:'PHL-HD9252', tags:['philips','air fryer','healthy cooking','kitchen','low fat'] },

    { name:'Pigeon Stainless Steel Pressure Cooker 5L', category:'Home & Kitchen', subcategory:'Cooking Appliances', brand:'Pigeon', price:1499, salePrice:999, stock:100, emoji:'🫕', rating:4.4, numReviews:18000,
      imageUrl:'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80',
      images:['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80'],
      description:'Stainless steel pressure cooker for fast, healthy cooking. Works on all cooktops including induction. 5-litre capacity ideal for family of 4.',
      specs:{ Capacity:'5 litres', Material:'Stainless Steel 304 grade', Compatible:'Gas, Electric, Induction', Safety:'3 safety valves', Lid:'ISI certified', Warranty:'2 years' },
      features:['304 grade stainless steel','Induction compatible','3 safety valves','ISI certified','2-year warranty','Easy grip handles','Capsule bottom'],
      status:'active', sku:'PGN-PC5L', tags:['pigeon','pressure cooker','stainless steel','induction','kitchen'] },

    { name:'Borosil Vision Mixing Bowl Set 3 Pieces', category:'Home & Kitchen', subcategory:'Kitchen Tools', brand:'Borosil', price:1299, salePrice:899, stock:80, emoji:'🍳', rating:4.5, numReviews:6700,
      imageUrl:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80',
      images:['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80'],
      description:'Borosilicate glass mixing bowls. Microwave, oven, and dishwasher safe. Lightweight and crystal clear. Set of 3 nesting bowls.',
      specs:{ Material:'Borosilicate glass', Pieces:'3 bowls (0.5L, 0.9L, 1.3L)', Safe:'Microwave / Oven / Dishwasher / Freezer safe', TempRange:'-40°C to 300°C' },
      features:['Borosilicate glass','3 nesting sizes','Microwave safe','Oven safe up to 300°C','Dishwasher safe','Freezer safe','Crystal clear','Chip resistant'],
      status:'active', sku:'BRS-BOWL3PC', tags:['borosil','glass','mixing bowl','kitchen','microwave safe'] },

    { name:'Prestige Omega Select Plus Non-Stick Kadai 2.5L', category:'Home & Kitchen', subcategory:'Cookware', brand:'Prestige', price:1999, salePrice:1499, stock:60, emoji:'🍳', rating:4.5, numReviews:9800,
      imageUrl:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80',
      images:['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80'],
      description:'PFOA-free non-stick kadai with hard anodised aluminium body. Superior non-stick coating for healthy cooking with less oil.',
      specs:{ Capacity:'2.5 litres', Material:'Hard Anodised Aluminium', Coating:'PFOA-free non-stick', Compatible:'Gas only', Thickness:'4.88mm', Warranty:'2 years' },
      features:['PFOA-free non-stick','Hard anodised body','Superior heat distribution','Less oil cooking','Stay-cool handles','Easy clean','2-year warranty'],
      status:'active', sku:'PRG-KADAI-25L', tags:['prestige','kadai','non-stick','hard anodised','cookware'] },

    // Add more quickly...
    { name:'Milton Thermosteel Flip Lid Flask 750ml', category:'Home & Kitchen', subcategory:'Kitchen Tools', brand:'Milton', price:999, salePrice:699, stock:200, emoji:'🫙', rating:4.5, numReviews:15000,
      imageUrl:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
      images:['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80'],
      description:'Double-wall stainless steel vacuum flask. Keeps beverages hot for 24 hours and cold for 48 hours. BPA-free, leak-proof flip lid.',
      specs:{ Capacity:'750ml', Material:'304 Stainless Steel', HotDuration:'24 hours', ColdDuration:'48 hours', Weight:'390g', Feature:'BPA-free, Leak-proof' },
      features:['Hot 24 hours / Cold 48 hours','304 stainless steel','Flip lid for easy drinking','BPA-free','Leak-proof','Lightweight 390g'],
      status:'active', sku:'MLT-FLIP750', tags:['milton','flask','thermos','hot cold','stainless steel'] },

    // ═══════════════════════════════════════════
    // BEAUTY & PERSONAL CARE (15 products)
    // ═══════════════════════════════════════════
    { name:'Mamaearth Vitamin C Face Serum 30ml', category:'Beauty & Personal Care', subcategory:'Skincare', brand:'Mamaearth', price:699, salePrice:499, stock:180, emoji:'🧴', rating:4.5, numReviews:14000,
      imageUrl:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
      images:['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80'],
      description:'Vitamin C serum with Turmeric and Hyaluronic Acid for brightening and hydration. Clinically tested, toxin-free formula for all skin types.',
      specs:{ Size:'30ml', KeyIngredients:'Vitamin C, Turmeric, Hyaluronic Acid', SkinType:'All skin types', Usage:'AM/PM daily', Certification:'Toxin-free, Dermatologist tested', ShelfLife:'24 months' },
      features:['Vitamin C brightening','Turmeric anti-inflammatory','Hyaluronic acid hydration','Dark spot reduction','Even skin tone','SPF-free serum','Lightweight formula'],
      status:'active', sku:'MRE-VCS-30ML', tags:['mamaearth','vitamin c','serum','brightening','skincare'] },

    { name:'Lakme Absolute Skin Natural Mousse Foundation', category:'Beauty & Personal Care', subcategory:'Makeup', brand:'Lakme', price:799, salePrice:549, stock:150, emoji:'💄', rating:4.4, numReviews:9800,
      imageUrl:'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80',
      images:['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80'],
      description:'Lightweight mousse foundation with SPF 25. Natural skin-like finish that lasts 16 hours. Enriched with vitamin B3 for healthy-looking skin.',
      specs:{ Size:'25g', Finish:'Natural matte', SPF:'SPF 25', Coverage:'Medium to full', Duration:'16 hours', KeyIngredient:'Vitamin B3', Shades:'15 shades' },
      features:['SPF 25 protection','16-hour wear','Vitamin B3 enriched','Natural finish','Medium to full coverage','15 Indian skin shades','Lightweight mousse'],
      status:'active', sku:'LKM-ABS-MOUSSE', tags:['lakme','foundation','makeup','spf25','natural finish'] },

    { name:'Forest Essentials Facial Tonic Mist Rose Water', category:'Beauty & Personal Care', subcategory:'Skincare', brand:'Forest Essentials', price:1450, salePrice:1199, stock:60, emoji:'🌹', rating:4.6, numReviews:4500,
      imageUrl:'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
      images:['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80'],
      description:'Pure Kashmiri rose water facial mist. Distilled from fresh roses using traditional methods. Instantly hydrates, refreshes and tones skin.',
      specs:{ Size:'100ml', KeyIngredient:'Pure Kashmiri Rose Water', SkinType:'All skin types', Usage:'Mist on face anytime', Origin:'Kashmiri roses', Certification:'Natural, No parabens, No silicones' },
      features:['Pure Kashmiri rose water','Traditionally distilled','Tones and hydrates','Refreshes skin','No parabens','No silicones','Natural luxury'],
      status:'active', sku:'FE-ROSE-MIST', tags:['forest essentials','rose water','facial mist','luxury','natural'] },

    { name:"L'Oreal Paris Elvive Extraordinary Oil Shampoo 400ml", category:'Beauty & Personal Care', subcategory:'Haircare', brand:"L'Oreal Paris", price:499, salePrice:349, stock:200, emoji:'🧴', rating:4.5, numReviews:12000,
      imageUrl:'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80',
      images:['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80'],
      description:'Nourishing shampoo with Extraordinary Oil blend for dry, dull hair. Transforms hair to silky, luminous perfection.',
      specs:{ Size:'400ml', HairType:'Dry, dull', KeyIngredients:'Extraordinary Oil blend - 6 rare flower oils', Usage:'Daily shampoo', pH:'Balanced' },
      features:['6 rare flower oils blend','For dry dull hair','Paraben-free','Silky finish','Luminous shine','Daily use','400ml value pack'],
      status:'active', sku:'LOR-ELV-OIL400', tags:["l'oreal",'shampoo','hair oil','dry hair','elvive'] },

    // ═══════════════════════════════════════════
    // GROCERY & GOURMET (15 products)
    // ═══════════════════════════════════════════
    { name:'Cadbury Celebrations Premium Gift Box 281g', category:'Grocery & Gourmet', subcategory:'Chocolates', brand:'Cadbury', price:599, salePrice:449, stock:300, emoji:'🍫', rating:4.7, numReviews:22000,
      imageUrl:'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80',
      images:['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80'],
      description:'Festive premium gift box with Cadbury\'s finest chocolates. Contains Dairy Milk, Bournville, 5 Star, Perk, Gems, and Eclairs. Perfect gift for Diwali, birthdays, and celebrations.',
      specs:{ Weight:'281g', Contents:'Dairy Milk 44g, Bournville 80g, 5 Star 2 pieces, Perk 4 pieces, Gems 4 packs, Eclairs 6 pieces', Packaging:'Premium gift box', Shelf:'6 months' },
      features:['6 chocolate varieties','Premium gift packaging','Dairy Milk, Bournville, 5 Star','Perfect for festivals','Long shelf life','Ribbon gift wrap'],
      status:'active', sku:'CDY-CELB-281', tags:['cadbury','chocolate','gift','celebrations','diwali'] },

    { name:'Tata Tea Gold Premium Blend 500g', category:'Grocery & Gourmet', subcategory:'Tea & Coffee', brand:'Tata Tea', price:399, salePrice:299, stock:400, emoji:'🍵', rating:4.6, numReviews:28000,
      imageUrl:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
      images:['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80'],
      description:'Made from carefully selected whole leaf teas from the best estates of Assam and Darjeeling. Rich, aromatic brew with a bright golden cup.',
      specs:{ Weight:'500g', Type:'CTC Blend', Origin:'Assam + Darjeeling blend', Color:'Bright golden', Brewing:'2 minutes', Cups:'200+ cups' },
      features:['Assam + Darjeeling blend','Whole leaf selection','Rich golden color','Strong aroma','200+ cups','No artificial flavors','100% natural'],
      status:'active', sku:'TATA-GOLD-500', tags:['tata tea','gold','premium','assam','darjeeling'] },

    { name:'Nescafe Classic Instant Coffee 100g Glass', category:'Grocery & Gourmet', subcategory:'Tea & Coffee', brand:'Nescafe', price:549, salePrice:399, stock:300, emoji:'☕', rating:4.5, numReviews:45000,
      imageUrl:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
      images:['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80'],
      description:'Rich and aromatic instant coffee made from 100% pure coffee. Perfect for a quick, delicious cup at home or office. Comes in a glass jar.',
      specs:{ Weight:'100g', Type:'Instant coffee', Origin:'100% pure coffee', Brewing:'Add 2g to 150ml hot water', Cups:'50 cups', Jar:'Reusable glass jar' },
      features:['100% pure coffee','Rich aroma','Instant 30-second brew','Reusable glass jar','50 cups','No chicory', 'Morning energy boost'],
      status:'active', sku:'NESCAFE-CLS-100G', tags:['nescafe','coffee','instant','classic','glass jar'] },

    // Add remaining products to hit ~150+ total
    { name:'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', category:'Electronics', subcategory:'Headphones', brand:'Sony', price:29990, salePrice:24990, stock:80, emoji:'🎧', rating:4.8, numReviews:6720,
      imageUrl:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      images:['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80','https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80'],
      description:'Industry-leading noise cancelling with 8 microphones using Integrated Processor V1. Up to 30 hours battery life. Crystal clear calls even in windy conditions.',
      specs:{ Type:'Over-ear wireless', NoiseCancel:'Yes - 8 mic system', Battery:'30 hours', Charging:'3.5 hours / 3-min for 3-hour playback', Weight:'250g', Codec:'LDAC, SBC, AAC', Driver:'40mm dome', Frequency:'4Hz-40,000Hz (LDAC)' },
      features:['8-microphone ANC system','30-hour battery','LDAC Hi-Res Audio','Multipoint connection','Speak-to-Chat auto pause','Auto NC Optimizer','Fold-flat for travel','Premium case included'],
      status:'active', sku:'SNY-WH1000XM5', tags:['sony','anc','wireless','headphones','noise cancelling','ldac'] },

    { name:'Samsung 65" Crystal 4K UHD Smart TV UA65CU7700', category:'Electronics', subcategory:'TVs', brand:'Samsung', price:89990, salePrice:69990, stock:12, emoji:'📺', rating:4.7, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=500&q=80',
      images:['https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=500&q=80'],
      description:'Crystal 4K processor delivers brilliant picture quality. Alexa and Google Assistant built-in. Smart Hub for easy access to Netflix, Prime Video, Disney+.',
      specs:{ ScreenSize:'65 inches', Resolution:'4K UHD 3840x2160', HDR:'HDR10+', RefreshRate:'60Hz', SmartTV:'Tizen OS', Ports:'3x HDMI, 2x USB, WiFi, Bluetooth', Sound:'20W output' },
      features:['Crystal 4K processor','HDR10+ support','Alexa + Google Assistant','Smart Hub streaming','3 HDMI ports','Motion Xcelerator','Q-Symphony','Game Mode'],
      status:'active', sku:'SAM-65CU7700', tags:['samsung','tv','4k','smart tv','65 inch','alexa'] },

    { name:'Nike Air Force 1 Low White Men', category:'Shoes', subcategory:'Casual Shoes', brand:'Nike', price:7495, salePrice:6295, stock:65, emoji:'👟', rating:4.7, numReviews:15600,
      imageUrl:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      images:['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'],
      description:'The Nike Air Force 1 was the first basketball shoe to use Nike Air cushioning. A streetwear icon since 1982. All-white colorway — the most iconic AF1.',
      specs:{ Upper:'Leather', Midsole:'Foam with encapsulated Air unit', Outsole:'Rubber', Closure:'Lace-up', Sizes:'UK 6-12', Width:'Standard D' },
      features:['Nike Air cushioning','Classic all-white design','Leather upper','Iconic since 1982','Perforated toe cap','Pivoting circle traction'],
      status:'active', sku:'NK-AF1-WHT', tags:['nike','air force 1','af1','sneakers','white','classic'] },

    { name:'Apple AirPods Pro 2nd Generation MagSafe', category:'Electronics', subcategory:'Headphones', brand:'Apple', price:24900, salePrice:22900, stock:90, emoji:'🎧', rating:4.7, numReviews:5400,
      imageUrl:'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80',
      images:['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80'],
      description:'AirPods Pro feature up to 2x more Active Noise Cancellation. Adaptive Transparency lets outside sound in while reducing loud environmental noise.',
      specs:{ Type:'In-ear true wireless', ANC:'2x improved H2 chip ANC', Battery:'6 hrs ANC on / 30 hrs with case', ChargingCase:'MagSafe + Lightning + Apple Watch charger', IPRating:'IPX4', SpatialAudio:'Yes - Personalized' },
      features:['2x improved ANC','Adaptive Transparency','Personalized Spatial Audio','H2 chip','MagSafe charging case','Touch control','Find My support','6-hour ANC battery'],
      status:'active', sku:'APL-APP2-MAGSAFE', tags:['airpods','apple','anc','wireless','earbuds','magsafe'] },

    { name:'Zara Men Oversized Printed Tee', category:'Fashion', subcategory:"Men's Clothing", brand:'Zara', price:2499, salePrice:1699, stock:80, emoji:'👕', rating:4.4, numReviews:5600,
      imageUrl:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
      images:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'],
      description:'Trendy oversized fit graphic tee from Zara Man. Soft 100% cotton jersey fabric with street-style print. Available in multiple colorways.',
      specs:{ Material:'100% Cotton Jersey', Fit:'Oversized', Sizes:'XS, S, M, L, XL', Colors:'White, Black, Beige, Khaki', Care:'Machine wash 30°C' },
      features:['Oversized streetwear fit','100% cotton','Graphic print','Multiple colors','Machine washable','Soft jersey fabric'],
      status:'active', sku:'ZAR-MEN-OSIZE', tags:['zara','men','oversized','tshirt','street style'] },

    { name:'Hanes Men Boxer Briefs Pack of 5', category:'Fashion', subcategory:"Men's Clothing", brand:'Hanes', price:999, salePrice:699, stock:200, emoji:'👕', rating:4.5, numReviews:18000,
      imageUrl:'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80',
      images:['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80'],
      description:'Pack of 5 tagless boxer briefs in soft 100% cotton. ComfortFlex waistband for all-day comfort. FreshIQ odour protection technology.',
      specs:{ Material:'100% Cotton', Quantity:'5 pairs', Waist:'ComfortFlex elastic', Feature:'FreshIQ odour protection', Sizes:'S, M, L, XL, XXL' },
      features:['5 pairs value pack','Tagless for comfort','FreshIQ technology','ComfortFlex waistband','100% cotton','Machine washable'],
      status:'active', sku:'HANES-BB-5PK', tags:['hanes','underwear','boxer briefs','cotton','5 pack'] },

    { name:'Wildcraft 45L Rucksack Backpack', category:'Sports & Fitness', subcategory:'Trekking', brand:'Wildcraft', price:3999, salePrice:2799, stock:45, emoji:'🎒', rating:4.5, numReviews:7800,
      imageUrl:'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80',
      images:['https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80'],
      description:'45L trekking rucksack with ergonomic back support. Rain cover included. Multiple compartments for organised packing. Perfect for weekend treks.',
      specs:{ Capacity:'45 litres', Material:'Polyester 600D + 900D', Weight:'1.2 kg', Frame:'Adjustable torso internal frame', Includes:'Rain cover', Pockets:'3 main + 2 side + front zippered' },
      features:['45L capacity','Rain cover included','Ergonomic back support','Hip belt support','Multiple pockets','Hydration bladder compatible','Adjustable straps','3-year warranty'],
      status:'active', sku:'WLD-RUCK-45L', tags:['wildcraft','rucksack','trekking','backpack','outdoor','45l'] },

    { name:'Dyson V15 Detect Absolute Cordless Vacuum', category:'Appliances', subcategory:'Vacuum Cleaners', brand:'Dyson', price:59900, salePrice:52900, stock:10, emoji:'🌀', rating:4.9, numReviews:4200,
      imageUrl:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
      images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'],
      description:'Laser reveals invisible dust. Piezo sensor automatically counts and sizes dust particles and displays a real-time graph on the LCD screen.',
      specs:{ Suction:'230 AW', Runtime:'60 minutes', Weight:'3.1 kg', Filtration:'HEPA', Capacity:'0.76 litres', Display:'LCD', Charge:'4.5 hours', Attachments:'10 tools included' },
      features:['Laser dust detection','Piezo sensor microscopic dust count','230AW max suction','60-min runtime','HEPA filtration','LCD real-time graph','10 attachments','Converts to handheld'],
      status:'active', sku:'DYS-V15-ABS', tags:['dyson','vacuum','cordless','laser','hepa','v15'] },

    { name:'PS5 Console Disc Edition + 2 Games Bundle', category:'Software & Video Games', subcategory:'Gaming Consoles', brand:'Sony', price:59990, salePrice:54990, stock:8, emoji:'🎮', rating:4.9, numReviews:8900,
      imageUrl:'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80',
      images:['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80'],
      description:'PlayStation 5 console with disc drive. Bundle includes Spider-Man Miles Morales and Returnal. 4K gaming at 120fps. DualSense haptic feedback controller.',
      specs:{ CPU:'AMD Zen 2 8-core', GPU:'AMD RDNA 2 10.28 TF', RAM:'16GB GDDR6', Storage:'825GB Custom SSD', Optical:'4K Blu-ray', Output:'4K/8K/120fps HDR', Audio:'3D Tempest audio', Includes:'DualSense controller, power cable, HDMI cable, USB cable' },
      features:['825GB ultra-fast SSD','4K gaming at 120fps','DualSense haptic feedback','3D Tempest Audio','Ray tracing support','Backward compatible PS4','Spider-Man + Returnal included','4K Blu-ray player'],
      status:'active', sku:'SNY-PS5-BUNDLE', tags:['ps5','playstation','gaming','4k','bundle','spiderman'] },

    { name:'LEGO Creator Expert Eiffel Tower 10307', category:'Toys & Games', subcategory:'LEGO', brand:'LEGO', price:42999, salePrice:38999, stock:5, emoji:'🗼', rating:4.9, numReviews:3400,
      imageUrl:'https://images.unsplash.com/photo-1588492885706-b8917f06df77?w=500&q=80',
      images:['https://images.unsplash.com/photo-1588492885706-b8917f06df77?w=500&q=80'],
      description:'Build a stunning replica of Paris\'s most iconic landmark. 10,001 pieces! Features the lattice metalwork look with brownish-orange coloured elements. 1.5m tall!',
      specs:{ Pieces:'10,001', Height:'149cm (1.5 metres)', Scale:'1:300 approx', AgeRange:'18+', DifficultyLevel:'Expert', SetNumber:'10307', Includes:'Display plaque, interior elevator, mini Tour de France bikes' },
      features:['10,001 pieces','1.5 metres tall','Lattice metalwork design','Working interior elevator','Tour de France bikes','Display plaque','18+ experience','Collector quality'],
      status:'active', sku:'LGO-EIFFEL-10307', tags:['lego','eiffel tower','creator expert','paris','collector','10001 pieces'] },

    { name:'Apple Watch Series 9 GPS 41mm Midnight Aluminium', category:'Watches & Jewellery', subcategory:'Smartwatches', brand:'Apple', price:41900, salePrice:38900, stock:45, emoji:'⌚', rating:4.8, numReviews:4100,
      imageUrl:'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80',
      images:['https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80'],
      description:'Advanced health features, new Double Tap gesture, brighter Always-On Retina display. S9 chip for faster on-device Siri. Carbon neutral.',
      specs:{ Case:'41mm Aluminium', Display:'Always-On Retina LTPO OLED', Chip:'S9 SiP dual-core', GPS:'GPS + GLONASS + GALILEO', Health:'Blood oxygen, ECG, Heart rate, Crash detection', Battery:'18 hours', WaterResistance:'WR50M (50 metres)', Connectivity:'WiFi + Bluetooth 5.3' },
      features:['Double Tap new gesture','S9 chip on-device Siri','Blood oxygen sensor','ECG app','Always-On display','18-hour battery','50m water resistant','Crash Detection','Fall Detection','Carbon neutral'],
      status:'active', sku:'APL-WS9-41MM', tags:['apple watch','series 9','smartwatch','ecg','health','gps'] },
  ];

  await db.collection('products').insertMany(products);
  console.log(`✅  Products seeded (${products.length} products)\n`);

  await db.collection('holidays').insertMany([
    { staffName:'Priya Staff', type:'Annual', from:new Date('2025-05-10'), to:new Date('2025-05-15'), days:5, reason:'Family vacation', contact:'9876543210', status:'approved', createdAt:now, updatedAt:now },
    { staffName:'Rahul Manager', type:'Sick', from:new Date('2025-05-01'), to:new Date('2025-05-03'), days:3, reason:'Medical leave', contact:'9876543211', status:'approved', createdAt:now, updatedAt:now },
    { staffName:'Priya Staff', type:'Emergency', from:new Date('2025-05-20'), to:new Date('2025-05-21'), days:2, reason:'Personal emergency', contact:'9876543212', status:'pending', createdAt:now, updatedAt:now },
  ]);
  await db.collection('queries').insertMany([
    { staffName:'Priya Staff', type:'Payroll', subject:'Overtime not credited', description:'My overtime for April was not added.', priority:'Urgent', status:'open', createdAt:now, updatedAt:now },
    { staffName:'Rahul Manager', type:'HR', subject:'Leave balance incorrect', description:'System shows 8 days but should be 12.', priority:'Normal', status:'in_progress', createdAt:now, updatedAt:now },
    { staffName:'Priya Staff', type:'Schedule', subject:'Shift swap request', description:'Request to swap Saturday shift.', priority:'Low', status:'resolved', createdAt:now, updatedAt:now },
  ]);

  console.log('══════════════════════════════════════════════');
  console.log('🎉  SEEDING COMPLETE!');
  console.log(`📦  Total products: ${products.length}`);
  console.log('══════════════════════════════════════════════\n');
  console.log('CUSTOMER:     customer@ai1mart.com  / user123');
  console.log('SUPER ADMIN:  superadmin@ai1mart.com / admin123');
  console.log('ADMIN:        admin@ai1mart.com     / admin123');
  console.log('MANAGER:      manager@ai1mart.com   / admin123');
  console.log('STAFF:        staff@ai1mart.com     / admin123\n');
  await mongoose.disconnect();
  process.exit(0);
}
seed().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });

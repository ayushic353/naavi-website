const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  // KURTAS
  {
    name: 'Midnight Bloom Anarkali Kurta',
    description: 'Exquisite anarkali-style kurta in deep navy with intricate gold floral embroidery. Flared silhouette with side slits for ease of movement. Comes with matching dupatta.',
    price: 2499, originalPrice: 3299,
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600',
      'https://images.unsplash.com/photo-1585559604959-b9ecf22f26a1?w=600',
    ],
    category: 'kurtas', sizes: ['XS','S','M','L','XL','XXL'], colors: ['Midnight Navy','Emerald Green','Deep Burgundy'],
    stock: 40, brand: 'NAAVI Festive', tags: ['anarkali','embroidered','festive'],
    isFeatured: true, isNewArrival: true, rating: 4.8, numReviews: 124,
  },
  {
    name: 'Ivory Chikankari Straight Kurta',
    description: 'Timeless chikankari hand-embroidered straight kurta on crisp ivory cotton. Light, breathable, and perfect for daily wear or casual outings.',
    price: 1699, originalPrice: 2199,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4052?w=600',
    ],
    category: 'kurtas', sizes: ['S','M','L','XL'], colors: ['Ivory','Pale Pink','Sky Blue'],
    stock: 55, brand: 'NAAVI Everyday', tags: ['chikankari','cotton','casual'],
    isBestSeller: true, rating: 4.6, numReviews: 89,
  },
  {
    name: 'Onyx Geometric Block Print Kurta',
    description: 'Bold geometric block-print kurta in black with contrasting rust motifs. A-line cut with 3/4 sleeves and mandarin collar.',
    price: 1299, originalPrice: 1699,
    images: [
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600',
    ],
    category: 'kurtas', sizes: ['S','M','L','XL','XXL'], colors: ['Black/Rust','Black/Gold','White/Indigo'],
    stock: 30, brand: 'NAAVI Prints', tags: ['block-print','geometric','casual'],
    isDealOfMonth: true, rating: 4.4, numReviews: 56,
  },

  // SUITS
  {
    name: 'Royal Velvet Embroidered Suit Set',
    description: 'Opulent velvet suit set with zari embroidery on kurta, palazzo pants, and sheer dupatta. A showstopper for weddings and formal occasions.',
    price: 5999, originalPrice: 7999,
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600',
    ],
    category: 'suits', sizes: ['XS','S','M','L','XL'], colors: ['Royal Blue','Wine Red','Forest Green'],
    stock: 18, brand: 'NAAVI Festive', tags: ['velvet','embroidered','wedding','formal'],
    isFeatured: true, isBestSeller: true, rating: 4.9, numReviews: 67,
  },
  {
    name: 'Pastel Linen Coord Suit Set',
    description: 'Relaxed linen co-ord set comprising a straight kurta and wide-leg pants. Minimalist design with delicate pintuck detailing. Perfect for office and casual outings.',
    price: 2899, originalPrice: 3499,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    ],
    category: 'suits', sizes: ['XS','S','M','L','XL','XXL'], colors: ['Blush Pink','Sage Green','Powder Blue'],
    stock: 35, brand: 'NAAVI Everyday', tags: ['linen','coord','minimal','office'],
    isNewArrival: true, rating: 4.5, numReviews: 43,
  },

  // SAREES
  {
    name: 'Midnight Banarasi Silk Saree',
    description: 'Handwoven Banarasi silk saree in deep midnight black with gold zari borders and pallu. Timeless heritage weave for the modern woman.',
    price: 8999, originalPrice: 12000,
    images: [
      'https://images.unsplash.com/photo-1623609163841-5e69d8c62cc7?w=600',
      'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=600',
    ],
    category: 'sarees', sizes: ['Free Size'], colors: ['Midnight Black','Deep Maroon','Forest Green'],
    stock: 12, brand: 'NAAVI Heritage', tags: ['banarasi','silk','zari','bridal'],
    isFeatured: true, rating: 5.0, numReviews: 38,
  },
  {
    name: 'Rose Gold Organza Saree',
    description: 'Ethereal organza saree in rose gold with sequin-embroidered borders. Lightweight and luminous — perfect for cocktail parties and receptions.',
    price: 4499, originalPrice: 5999,
    images: [
      'https://images.unsplash.com/photo-1564415637254-92c66292cd64?w=600',
    ],
    category: 'sarees', sizes: ['Free Size'], colors: ['Rose Gold','Champagne','Dusty Mauve'],
    stock: 20, brand: 'NAAVI Festive', tags: ['organza','sequin','cocktail'],
    isDealOfMonth: true, isNewArrival: true, rating: 4.7, numReviews: 52,
  },

  // JACKETS
  {
    name: 'Onyx Structured Blazer Jacket',
    description: 'Sharp, tailored blazer in onyx black crepe. Notched lapels, single-button closure, and clean-cut pockets. Power dressing at its finest.',
    price: 3799, originalPrice: 4999,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600',
    ],
    category: 'jackets', sizes: ['XS','S','M','L','XL'], colors: ['Onyx Black','Charcoal Grey','Ivory'],
    stock: 28, brand: 'NAAVI Power', tags: ['blazer','tailored','office','power'],
    isFeatured: true, isBestSeller: true, rating: 4.8, numReviews: 71,
  },
  {
    name: 'Embroidered Velvet Jacket',
    description: 'Statement velvet jacket with hand-embroidered floral motifs on the back. Pair over kurtas or western outfits for a fusion look.',
    price: 4299, originalPrice: 5499,
    images: [
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600',
    ],
    category: 'jackets', sizes: ['S','M','L','XL'], colors: ['Deep Purple','Bottle Green','Crimson'],
    stock: 15, brand: 'NAAVI Festive', tags: ['velvet','embroidered','fusion','statement'],
    isNewArrival: true, rating: 4.6, numReviews: 29,
  },

  // SCARVES
  {
    name: 'Gold-Edged Silk Scarf',
    description: 'Luxurious pure silk scarf with hand-rolled edges and a delicate gold-printed border. Versatile — wear as a neck scarf, hair accessory, or bag charm.',
    price: 1499, originalPrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600',
    ],
    category: 'scarves', sizes: ['One Size'], colors: ['Ivory/Gold','Black/Gold','Rust/Gold'],
    stock: 50, brand: 'NAAVI Accessories', tags: ['silk','scarf','luxury'],
    isBestSeller: true, rating: 4.7, numReviews: 96,
  },
  {
    name: 'Woven Wool Stole',
    description: 'Handwoven wool stole with geometric patterns inspired by traditional Indian textiles. Warm, textured, and endlessly stylish.',
    price: 999, originalPrice: 1399,
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=600',
    ],
    category: 'scarves', sizes: ['One Size'], colors: ['Charcoal/Rust','Navy/Gold','Olive/Cream'],
    stock: 60, brand: 'NAAVI Weaves', tags: ['wool','handwoven','winter'],
    isDealOfMonth: true, rating: 4.5, numReviews: 44,
  },

  // DRESSES
  {
    name: 'Onyx Slip Maxi Dress',
    description: 'Fluid satin slip maxi dress with adjustable straps and a subtle slit. Minimalist luxury that works for dinner dates, events, and travel.',
    price: 2999, originalPrice: 3999,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600',
      'https://images.unsplash.com/photo-1566479179817-3bef0f97b1ba?w=600',
    ],
    category: 'dresses', sizes: ['XS','S','M','L','XL'], colors: ['Onyx Black','Dusty Rose','Forest Green'],
    stock: 32, brand: 'NAAVI Modern', tags: ['slip','maxi','satin','minimal'],
    isFeatured: true, isNewArrival: true, rating: 4.8, numReviews: 103,
  },
  {
    name: 'Floral Wrap Midi Dress',
    description: 'Romantic wrap-style midi dress in a bold floral print on dark background. Deep V-neck, flutter sleeves, and a figure-flattering silhouette.',
    price: 2299, originalPrice: 2999,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
    ],
    category: 'dresses', sizes: ['XS','S','M','L','XL'], colors: ['Dark Floral','Midnight Blooms'],
    stock: 40, brand: 'NAAVI Modern', tags: ['wrap','midi','floral','romantic'],
    isDealOfMonth: true, isBestSeller: true, rating: 4.7, numReviews: 88,
  },
  {
    name: 'Sequin Cocktail Mini Dress',
    description: 'Head-turning all-over sequin mini dress for nights out and celebrations. Relaxed fit, round neck, and falls just above the knee.',
    price: 3499, originalPrice: 4499,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600',
    ],
    category: 'dresses', sizes: ['XS','S','M','L'], colors: ['Jet Black','Champagne Gold','Deep Red'],
    stock: 20, brand: 'NAAVI Nights', tags: ['sequin','mini','cocktail','party'],
    isFeatured: true, rating: 4.6, numReviews: 47,
  },

  // TOPS
  {
    name: 'Sheer Organza Blouson Top',
    description: 'Ethereal sheer organza blouson top with delicate floral embroidery at the neckline. Pairs beautifully with high-waist trousers or sarees.',
    price: 1199, originalPrice: 1599,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600',
    ],
    category: 'tops', sizes: ['XS','S','M','L','XL'], colors: ['Ivory','Blush','Powder Blue'],
    stock: 45, brand: 'NAAVI Modern', tags: ['organza','sheer','embroidered','elegant'],
    isNewArrival: true, rating: 4.5, numReviews: 61,
  },
  {
    name: 'Cropped Cutwork Linen Top',
    description: 'Contemporary cropped top in natural linen with laser-cut geometric patterns. Slightly boxy fit, perfect with high-rise jeans or skirts.',
    price: 899, originalPrice: 1199,
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600',
    ],
    category: 'tops', sizes: ['XS','S','M','L','XL'], colors: ['Natural Linen','Black','Terracotta'],
    stock: 50, brand: 'NAAVI Everyday', tags: ['linen','crop','casual'],
    isBestSeller: true, rating: 4.4, numReviews: 75,
  },

  // T-SHIRTS
  {
    name: 'Naavi Script Oversized Tee',
    description: 'Premium 100% cotton oversized t-shirt with NAAVI\'s signature script print. Washed for extra softness and a lived-in feel. A closet essential.',
    price: 699, originalPrice: 999,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600',
    ],
    category: 'tshirts', sizes: ['XS','S','M','L','XL','XXL'], colors: ['Washed Black','Vintage White','Stone Grey'],
    stock: 120, brand: 'NAAVI Basics', tags: ['oversized','cotton','basic','casual'],
    isBestSeller: true, isDealOfMonth: true, rating: 4.9, numReviews: 312,
  },
  {
    name: 'Embroidered Puff-Sleeve Tee',
    description: 'Cotton t-shirt elevated with delicate botanical embroidery and statement puff sleeves. Where comfort meets artistry.',
    price: 999, originalPrice: 1299,
    images: [
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600',
    ],
    category: 'tshirts', sizes: ['XS','S','M','L','XL'], colors: ['Off White','Dusty Sage','Pale Pink'],
    stock: 65, brand: 'NAAVI Crafted', tags: ['embroidered','puff-sleeve','cotton'],
    isNewArrival: true, rating: 4.6, numReviews: 58,
  },

  // JEANS
  {
    name: 'Midnight High-Rise Slim Jeans',
    description: 'Flattering high-rise slim-fit jeans in deep midnight wash. 2% elastane for all-day comfort. The perfect foundational denim.',
    price: 2199, originalPrice: 2999,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
    ],
    category: 'jeans', sizes: ['26','28','30','32','34','36'], colors: ['Midnight Blue','Jet Black','Stone Wash'],
    stock: 80, brand: 'NAAVI Denim', tags: ['high-rise','slim','denim','essential'],
    isBestSeller: true, isFeatured: true, rating: 4.7, numReviews: 189,
  },
  {
    name: 'Wide-Leg Ecru Jeans',
    description: 'Trending wide-leg jeans in a soft ecru/off-white shade. High-waisted with a relaxed wide leg — effortlessly chic and comfortable.',
    price: 2499, originalPrice: 3199,
    images: [
      'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=600',
    ],
    category: 'jeans', sizes: ['26','28','30','32','34'], colors: ['Ecru','Light Grey','Pale Blue'],
    stock: 45, brand: 'NAAVI Denim', tags: ['wide-leg','high-waist','trending'],
    isNewArrival: true, isDealOfMonth: true, rating: 4.5, numReviews: 67,
  },
  {
    name: 'Embroidered Flare Jeans',
    description: 'Boho-chic flare jeans with hand-embroidered floral motifs on the hem. Mid-rise with a slight stretch. Style with a fitted kurta for a fusion look.',
    price: 2799, originalPrice: 3599,
    images: [
      'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=600',
    ],
    category: 'jeans', sizes: ['26','28','30','32'], colors: ['Medium Wash','Dark Wash'],
    stock: 30, brand: 'NAAVI Crafted', tags: ['flare','embroidered','fusion','boho'],
    isFeatured: true, rating: 4.8, numReviews: 42,
  },
  // Extra featured products
  {
    name: 'Chanderi Silk Bandhani Suit',
    description: 'Beautiful Chanderi silk bandhani (tie-dye) suit set with contrast dupatta. Rich texture, lightweight drape, perfect for festive gatherings.',
    price: 3999, originalPrice: 5499,
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600',
    ],
    category: 'suits', sizes: ['XS','S','M','L','XL'], colors: ['Teal/Gold','Pink/Silver','Saffron/Green'],
    stock: 22, brand: 'NAAVI Heritage', tags: ['chanderi','bandhani','festive','heritage'],
    isFeatured: true, isNewArrival: true, rating: 4.9, numReviews: 55,
  },
  {
    name: 'Tussar Silk Kantha Saree',
    description: 'Hand-stitched Kantha embroidery on natural tussar silk saree. Each piece unique — artisanal craft meets contemporary styling.',
    price: 6499, originalPrice: 8999,
    images: [
      'https://images.unsplash.com/photo-1564415637254-92c66292cd64?w=600',
    ],
    category: 'sarees', sizes: ['Free Size'], colors: ['Tussar Natural','Soft Copper','Sage'],
    stock: 10, brand: 'NAAVI Artisan', tags: ['tussar','kantha','artisan','handmade'],
    isFeatured: true, isBestSeller: true, rating: 5.0, numReviews: 28,
  },
];

const adminUser = {
  name: 'Admin NAAVI',
  email: 'admin@naavi.com',
  password: 'admin123',
  role: 'admin',
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    await User.deleteMany({ role: 'admin' });
    await User.create(adminUser);
    console.log('✅ Admin user created: admin@naavi.com / admin123');

    mongoose.connection.close();
    console.log('🎉 Seeding complete!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();

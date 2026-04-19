import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StarIcon from '@mui/icons-material/Star';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();

  const disc = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(product._id);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(product._id, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
  };

  return (
    <Link to={`/product/${product._id}`} className="group block product-card">
      {/* Image */}
      <div className="relative overflow-hidden bg-graphite aspect-[3/4]">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-107"
          loading="lazy"
          style={{ transition: 'transform 0.7s ease' }}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'; }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-obsidian/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="naavi-badge bg-gold text-obsidian">New</span>
          )}
          {disc && (
            <span className="naavi-badge bg-ember text-white">-{disc}%</span>
          )}
          {product.isBestSeller && (
            <span className="naavi-badge bg-charcoal text-gold border border-gold/40">Best Seller</span>
          )}
        </div>

        {/* Wishlist btn */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-charcoal/80 hover:bg-charcoal transition-all border border-ash/40 hover:border-gold"
          aria-label="Toggle wishlist"
        >
          {isWishlisted(product._id)
            ? <FavoriteIcon sx={{ fontSize: 15, color: '#c9a96e' }} />
            : <FavoriteBorderIcon sx={{ fontSize: 15, color: '#a8a8a8' }} />}
        </button>

        {/* Quick add */}
        {product.stock > 0 && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-0 left-0 right-0 bg-gold text-obsidian text-[10px] font-mono-custom font-bold uppercase tracking-[0.15em] py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 13 }} />
            Add to Bag
          </button>
        )}

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-obsidian/60 flex items-center justify-center">
            <span className="naavi-badge bg-ash text-silver">Sold Out</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3.5">
        <p className="section-label text-[9px] mb-1">{product.category}</p>
        <h3 className="text-sm text-pearl font-medium leading-snug line-clamp-1 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <StarIcon sx={{ fontSize: 11, color: '#c9a96e' }} />
            <span className="text-[10px] font-mono-custom text-mist">
              {product.rating} ({product.numReviews})
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold text-pearl">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-mist line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    images: { type: [String], default: [] },
    category: {
      type: String, required: true,
      enum: ['kurtas', 'suits', 'sarees', 'jackets', 'scarves', 'dresses', 'tops', 'tshirts', 'jeans'],
    },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0, min: 0 },
    brand: { type: String, default: 'NAAVI' },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isDealOfMonth: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.methods.calculateRating = function () {
  if (!this.reviews.length) { this.rating = 0; this.numReviews = 0; return; }
  const total = this.reviews.reduce((s, r) => s + r.rating, 0);
  this.rating = Math.round((total / this.reviews.length) * 10) / 10;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);

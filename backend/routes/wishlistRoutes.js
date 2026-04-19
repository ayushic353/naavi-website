const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'name price images rating category');
    res.json({ success: true, products: wishlist?.products || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:productId', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    const idx = wishlist.products.indexOf(req.params.productId);
    let action;
    if (idx > -1) { wishlist.products.splice(idx, 1); action = 'removed'; }
    else { wishlist.products.push(req.params.productId); action = 'added'; }

    await wishlist.save();
    res.json({ success: true, action, message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

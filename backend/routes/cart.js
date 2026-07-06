const router = require('express').Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    const existing = cart.items.find(i => i.product?.toString() === productId);
    if (existing) existing.qty += qty;
    else cart.items.push({ product: productId, name: product.name, emoji: product.emoji, price: product.salePrice || product.price, qty });
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/update', protect, async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find(i => i.product?.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });
    if (qty <= 0) cart.items = cart.items.filter(i => i.product?.toString() !== productId);
    else item.qty = qty;
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter(i => i.product?.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

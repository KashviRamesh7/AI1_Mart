const router = require('express').Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect, roles } = require('../middleware/auth');

// Customer: place order
router.post('/', protect, async (req, res) => {
  try {
    const { address, payment, items, subtotal, total, discount, delivery } = req.body;
    const order = await Order.create({
      user: req.user._id, address, payment, items, subtotal, total, discount, delivery,
      trackingId: 'TRK' + Date.now(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    });
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    req.io.emit('new_order', { order, customer: req.user.firstName + ' ' + req.user.lastName });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Customer: my orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: all orders
router.get('/all', protect, roles('admin','superadmin','manager'), async (req, res) => {
  try {
    const orders = await Order.find().populate('user','firstName lastName email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: update order status
router.put('/:id/status', protect, roles('admin','superadmin','manager'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    req.io.emit('order_status_update', { orderId: order._id, status: order.status, userId: order.user });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

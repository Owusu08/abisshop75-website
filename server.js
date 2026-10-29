const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 1. Fetch Products from MySQL
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Initiate MoMo Payment via Paystack
app.post('/api/checkout/momo', async (req, res) => {
    const { name, email, phone, network, productId } = req.body;

    try {
        const [products] = await db.query('SELECT price_ghs FROM products WHERE id = ?', [productId]);
        if (products.length === 0) return res.status(404).json({ message: 'Product not found' });

        const amountGhs = products[0].price_ghs;
        const reference = `ABIS_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        await db.query(
            'INSERT INTO orders (customer_name, customer_email, phone_number, momo_network, total_amount, payment_status, reference) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, phone, network, amountGhs, 'pending', reference]
        );

        const response = await axios.post(
            'https://api.paystack.co/charge',
            {
                email,
                amount: Math.round(amountGhs * 100),
                currency: 'GHS',
                mobile_money: {
                    phone,
                    provider: network
                },
                reference
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ success: true, message: 'MoMo prompt sent to your phone', reference, data: response.data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.response?.data || err.message });
    }
});

// 3. Webhook Endpoint
app.post('/api/paystack/webhook', async (req, res) => {
    const event = req.body;

    if (event.event === 'charge.success') {
        const ref = event.data.reference;
        await db.query('UPDATE orders SET payment_status = "success" WHERE reference = ?', [ref]);
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const path = require('path');

// Serve static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname)));

// Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

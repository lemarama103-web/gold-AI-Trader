const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURATION ---
const APP_PASSWORD = process.env.APP_PASSWORD || '2004';
const METAAPI_TOKEN = process.env.METAAPI_TOKEN;
const EXNESS_ACCOUNT_ID = process.env.EXNESS_ACCOUNT_ID;

// --- 1. Secure Login (Password: 2004) ---
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === APP_PASSWORD) {
        res.json({ status: 'success', role: 'moderator', name: 'Ramadhan' });
    } else {
        res.status(401).json({ status: 'error', message: 'Invalid password' });
    }
});

// --- 2. Get Account Info (Balance, Equity, Positions) ---
app.get('/api/account-info', async (req, res) => {
    // In production, this would use the metaapi.cloud-sdk to fetch real data
    setTimeout(() => {
        res.json({
            balance: 10000.00,
            equity: 10050.00,
            margin: 0.00,
            freeMargin: 10050.00,
            positions: [],
            pendingOrders: []
        });
    }, 500);
});

// --- 3. AI Market Scanner ---
app.get('/api/scan', (req, res) => {
    const marketData = [
        { symbol: 'XAUUSD', direction: 'BUY', entry: '2345.50', sl: '2338.00', tp1: '2352.00', tp2: '2360.00', tp3: '2375.00', rsi: '32 (Oversold)', ema: 'Bullish Cross', atr: '1.5', signal: 'Strong' },
        { symbol: 'EURUSD', direction: 'SELL', entry: '1.0850', sl: '1.0880', tp1: '1.0820', tp2: '1.0790', tp3: '1.0750', rsi: '68 (Overbought)', ema: 'Bearish Cross', atr: '0.002', signal: 'Medium' },
        { symbol: 'GBPUSD', direction: 'NEUTRAL', entry: '-', sl: '-', tp1: '-', tp2: '-', tp3: '-', rsi: '50 (Neutral)', ema: 'Flat', atr: '0.001', signal: 'Weak' }
    ];
    res.json(marketData);
});

// --- 4. Execute Trade ---
app.post('/api/trade', async (req, res) => {
    const { symbol, direction, volume, sl, tp } = req.body;
    
    // THIS IS WHERE YOU WILL UNCOMMENT AND USE METAAPI LATER
    /*
    const MetaApi = require('metaapi.cloud-sdk').default;
    const api = new MetaApi(METAAPI_TOKEN);
    const account = await api.metatraderAccountApi.getAccount(EXNESS_ACCOUNT_ID);
    const connection = account.getRPCConnection();
    await connection.connect();
    await connection.waitSynchronized();
    const result = await connection.createMarketBuyOrder(symbol, volume, sl, tp);
    */

    console.log(`✅ Executing ${direction} order for ${symbol} on Exness...`);
    res.json({ status: 'executed', message: `Trade placed for ${symbol}`, orderId: Math.floor(Math.random() * 1000000) });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Gold AI Trader Cloud Backend running on port ${PORT}`);
});

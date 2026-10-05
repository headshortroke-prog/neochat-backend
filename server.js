require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const chatRoutes = require('./routes/chatRoutes');
const { initializeApp, cert } = require('firebase-admin/app');

const serviceAccount = require('./firebase-key.json');

try {
    initializeApp({
        credential: cert(serviceAccount)
    });
    console.log("🔥 Firebase Admin Connected Securely!");
} catch (error) {
    console.error("❌ Firebase Initialization Error:", error.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST']
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { error: "Too many requests from this IP, please try again after 15 minutes." }
});
app.use('/api/', apiLimiter);

app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "NeoChat AI Backend is running securely! 🚀" });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
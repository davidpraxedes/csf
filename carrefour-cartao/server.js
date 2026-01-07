
import 'dotenv/config'; // Carregar variáveis de ambiente (.env)
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

// Import handlers (simulando serverless)
import trackVisitHandler from './api/track-visit.js';
import getAnalyticsHandler from './api/get-analytics.js';
import createOrderHandler from './api/create-order.js';
import updateOrderHandler from './api/update-order.js';

const app = express();
const port = 3001;

// Global Prisma
if (!global.prisma) {
    global.prisma = new PrismaClient();
}

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Aumentado para fotos Base64

// Wrapper para adaptar assinatura serverless (req, res) para Express
const adapt = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error('SERVER ERROR:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Rotas API
app.post('/api/track-visit', adapt(trackVisitHandler));
app.get('/api/get-analytics', adapt(getAnalyticsHandler));
app.post('/api/create-order', adapt(createOrderHandler));
app.post('/api/update-order', adapt(updateOrderHandler));

app.listen(port, () => {
    console.log(`🚀 Backend local rodando em http://localhost:${port}`);
    console.log(`📡 Esperando requests em /api/...`);
});

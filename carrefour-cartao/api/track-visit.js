
import { PrismaClient } from '@prisma/client';

// Singleton prisma
let prisma;
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { path, stage, timestamp } = req.body;

        // Obter IP real (lidar com proxies se necessário)
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

        // Normalizar IP para localhost (::1 -> 127.0.0.1) para testes
        const normalizedIp = ip === '::1' ? '127.0.0.1' : ip;

        console.log(`📡 [Analytics] IP: ${normalizedIp} | Path: ${path} | Stage: ${stage || 'N/A'}`);

        // Mock GeoLocation (em produção usaria uma API como ip-api.com)
        // Adicionar variação aleatória pequena para não ficar tudo encavalado no mapa em dev
        const lat = -23.5505 + (Math.random() * 0.1 - 0.05);
        const lng = -46.6333 + (Math.random() * 0.1 - 0.05);

        const locationData = JSON.stringify({
            city: 'São Paulo',
            region: 'SP',
            country: 'BR',
            lat: lat,
            lng: lng
        });

        // Determinar flags do funil baseadas no estágio
        const funnelUpdates = {};
        if (stage === 'home') funnelUpdates.visitedHome = true;
        if (stage === 'cpf') funnelUpdates.visitedCPF = true;
        if (stage === 'form') funnelUpdates.visitedForm = true;
        if (stage === 'delivery') funnelUpdates.visitedDelivery = true;
        if (stage === 'payment') funnelUpdates.visitedPayment = true;
        if (stage === 'converted') funnelUpdates.converted = true;

        // Upsert no Visitor
        const visitor = await prisma.visitor.upsert({
            where: { ip: normalizedIp },
            update: {
                lastSeen: new Date(),
                currentPath: path,
                ...funnelUpdates
            },
            create: {
                ip: normalizedIp,
                location: locationData,
                currentPath: path,
                lastSeen: new Date(),
                ...funnelUpdates
            }
        });

        return res.status(200).json({ success: true, visitorId: visitor.id });

    } catch (error) {
        console.error('❌ [Analytics] Erro ao rastrear visita:', error);
        return res.status(500).json({ error: 'Erro interno de analytics' });
    }
}

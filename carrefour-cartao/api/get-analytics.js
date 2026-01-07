
import { PrismaClient } from '@prisma/client';

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
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Contar "Online" (Vistos nos últimos 5 minutos)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const activeVisitors = await prisma.visitor.findMany({
            where: { lastSeen: { gte: fiveMinutesAgo } },
            select: {
                ip: true,
                location: true,
                currentPath: true,
                lastSeen: true,
                converted: true // Para mostrar diferente no mapa?
            }
        });

        const onlineCount = activeVisitors.length;

        // 2. Dados do Funil (Agregados)
        const totalVisitors = await prisma.visitor.count();
        const homeCount = await prisma.visitor.count({ where: { visitedHome: true } });
        const cpfCount = await prisma.visitor.count({ where: { visitedCPF: true } });
        const formCount = await prisma.visitor.count({ where: { visitedForm: true } });
        const deliveryCount = await prisma.visitor.count({ where: { visitedDelivery: true } });
        const paymentCount = await prisma.visitor.count({ where: { visitedPayment: true } });
        const convertedCount = await prisma.visitor.count({ where: { converted: true } });

        const funnelData = [
            { name: 'Acesso', value: homeCount || totalVisitors, fill: '#3b82f6' }, // Blue
            { name: 'CPF', value: cpfCount, fill: '#6366f1' }, // Indigo
            { name: 'Dados', value: formCount, fill: '#8b5cf6' }, // Violet
            { name: 'Entrega', value: deliveryCount, fill: '#ec4899' }, // Pink
            { name: 'Pagamento', value: paymentCount, fill: '#f97316' }, // Orange
            { name: 'Conversão', value: convertedCount, fill: '#22c55e' } // Green
        ];

        // 3. Formatar Locations para o Mapa
        const activeLocations = activeVisitors.map(v => {
            try {
                const loc = JSON.parse(v.location);
                return {
                    lat: loc.lat,
                    lng: loc.lng,
                    city: loc.city,
                    ip: v.ip,
                    path: v.currentPath
                };
            } catch (e) {
                return null;
            }
        }).filter(Boolean);

        return res.status(200).json({
            onlineCount,
            activeLocations,
            funnelData
        });

    } catch (error) {
        console.error('❌ [Analytics] Erro ao buscar dados:', error);
        return res.status(500).json({ error: 'Erro ao buscar analytics' });
    }
}

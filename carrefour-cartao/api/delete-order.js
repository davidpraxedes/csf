
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
        res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        return;
    }

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        console.log(`🗑️ [API delete-order] Apagando pedido ${id}`);

        await prisma.order.delete({
            where: { id }
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ [API delete-order] Erro:', error);
        return res.status(500).json({ error: 'Erro ao apagar pedido' });
    }
}

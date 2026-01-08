
import { PrismaClient } from '@prisma/client';

// Singleton prisma para serverless
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
        const { transactionId, pixCopiado, pixCopiadoEm, ...updates } = req.body;

        if (!transactionId) {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        console.log(`📝 [API update-order] Atualizando pedido ${transactionId}:`, updates);

        // Mapear status de pagamento para status do pedido (sem migration)
        let statusToUpdate = updates.status;
        if (updates.paymentStatus === 'paid' || updates.status === 'paid') {
            statusToUpdate = 'aprovado';
        } else if (updates.paymentStatus === 'failed') {
            statusToUpdate = 'cancelado';
        }

        const dataToUpdate = {
            ...updates,
            updatedAt: new Date()
        };

        if (statusToUpdate) {
            dataToUpdate.status = statusToUpdate;
        }

        console.log(`📝 [API update-order] Atualizando pedido ${transactionId} -> Status: ${statusToUpdate || 'unchanged'}`);

        const order = await prisma.order.update({
            where: { transactionId },
            data: dataToUpdate
        });

        return res.status(200).json(order);
    } catch (error) {
        console.error('❌ [API update-order] Erro:', error);
        return res.status(500).json({ error: 'Erro interno ao atualizar pedido' });
    }
}

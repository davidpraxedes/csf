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
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    try {
        console.log(`📥 [API] Buscando detalhes do pedido ID: ${id}`);

        const order = await prisma.order.findUnique({
            where: { id: id },
            // Select all fields explicitly or just let it select default (which includes everything)
            // We specifically want documentPhotoFront and documentPhotoBack
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        // Add computed flags for frontend convenience (optional, but helpful if photos are null)
        const detailedOrder = {
            ...order,
            // Flag to indicate if photos effectively exist (not null/empty)
            hasPhotoFront: !!order.documentPhotoFront,
            hasPhotoBack: !!order.documentPhotoBack,

            // Map payment status for consistency
            paymentStatus: (order.status === 'aprovado') ? 'paid' :
                (order.status === 'cancelado') ? 'failed' : 'pending',

            // Ensure nested address structure if needed (frontend expects it nested?) 
            // The frontend in OrderDetailPage uses order.endereco.logradouro...
            // But prisma model returns flat fields.
            // Wait, get-orders.js maps flat fields to nested 'endereco' object. I should duplicate that mapping.
            endereco: {
                cep: order.cep,
                logradouro: order.logradouro,
                numero: order.numero,
                complemento: order.complemento,
                bairro: order.bairro,
                cidade: order.cidade,
                estado: order.estado
            }
        };


        console.log(`✅ [API] Pedido encontrado. Fotos: ${detailedOrder.hasPhotoFront ? 'Sim' : 'Não'}/${detailedOrder.hasPhotoBack ? 'Sim' : 'Não'}`);

        return res.status(200).json(detailedOrder);
    } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar pedido' });
    }
}

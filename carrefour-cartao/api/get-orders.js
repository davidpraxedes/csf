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

    try {
        console.log('📥 [API] Buscando todos os pedidos do banco...');

        // Buscar todos os pedidos ordenados por data
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' }
        });

        console.log(`✅ [API] ${orders.length} pedidos encontrados`);

        // Transformar para formato esperado pelo frontend
        const formattedOrders = orders.map(order => ({
            id: order.id,
            transactionId: order.transactionId,
            nomeCompleto: order.nomeCompleto,
            cpf: order.cpf,
            email: order.email,
            telefone: order.telefone,
            dataNascimento: order.dataNascimento,
            profissao: order.profissao,
            salario: order.salario,
            nomeMae: order.nomeMae,
            endereco: {
                cep: order.cep,
                logradouro: order.logradouro,
                numero: order.numero,
                complemento: order.complemento,
                bairro: order.bairro,
                cidade: order.cidade,
                estado: order.estado
            },
            valorEntrega: order.valorEntrega,
            pixCode: order.pixCode,
            pixQrCode: order.pixQrCode,
            rg: order.rg,
            documentPhotoFront: order.documentPhotoFront,
            documentPhotoBack: order.documentPhotoBack,
            hasPhotoFront: !!order.documentPhotoFront,
            hasPhotoBack: !!order.documentPhotoBack,
            paymentStatus: order.status || 'pending',
            status: order.status || 'pendente',
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }));

        return res.status(200).json(formattedOrders);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
}

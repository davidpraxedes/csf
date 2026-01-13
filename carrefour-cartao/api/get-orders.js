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
        const { id } = req.query;

        // SE TIVER ID (Busca detalhada com fotos)
        if (id) {
            console.log(`📥 [API] Buscando detalhes do pedido ${id}`);
            const order = await prisma.order.findUnique({
                where: { id: id }
            });

            if (!order) {
                // Tenta por transactionId
                const orderByTx = await prisma.order.findUnique({
                    where: { transactionId: id }
                });
                if (orderByTx) {
                    const formattedOrder = {
                        ...orderByTx,
                        endereco: {
                            cep: orderByTx.cep,
                            logradouro: orderByTx.logradouro,
                            numero: orderByTx.numero,
                            complemento: orderByTx.complemento,
                            bairro: orderByTx.bairro,
                            cidade: orderByTx.cidade,
                            estado: orderByTx.estado
                        },
                        hasPhotoFront: !!orderByTx.documentPhotoFront,
                        hasPhotoBack: !!orderByTx.documentPhotoBack
                    };
                    return res.status(200).json(formattedOrder);
                }
                return res.status(404).json({ error: 'Pedido não encontrado' });
            }

            const formattedOrder = {
                ...order,
                endereco: {
                    cep: order.cep,
                    logradouro: order.logradouro,
                    numero: order.numero,
                    complemento: order.complemento,
                    bairro: order.bairro,
                    cidade: order.cidade,
                    estado: order.estado
                },
                hasPhotoFront: !!order.documentPhotoFront,
                hasPhotoBack: !!order.documentPhotoBack
            };
            return res.status(200).json(formattedOrder);
        }

        console.log('📥 [API] Buscando todos os pedidos do banco...');

        // Buscar apenas campos necessários (excluir fotos base64 pesadas)
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                transactionId: true,
                status: true,
                nomeCompleto: true,
                cpf: true,
                email: true,
                telefone: true,
                dataNascimento: true,
                profissao: true,
                salario: true,
                nomeMae: true,
                cep: true,
                logradouro: true,
                numero: true,
                complemento: true,
                bairro: true,
                cidade: true,
                estado: true,
                valorEntrega: true,
                pixCode: true,
                pixQrCode: true, // QR Code usually small enough
                // pixCopiado: true,
                // pixCopiadoEm: true,
                rg: true,
                // Não buscar fotos base64 para listar
                // documentPhotoFront: false, 
                // documentPhotoBack: false,
                createdAt: true,
                updatedAt: true
            }
        });

        console.log(`✅ [API] ${orders.length} pedidos encontrados`);

        // Transformar para formato esperado pelo frontend
        const formattedOrders = orders.map(order => ({
            ...order,
            // Reconstruir objeto endereço parcial para a tabela mostrar cidade/estado
            endereco: {
                cidade: order.cidade,
                estado: order.estado,
                cep: order.cep
            },
            hasPhotoFront: false, // Na lista não sabemos, mas assumimos false pra não pesar. O detalhe busca a verdade.
            hasPhotoBack: false,

            paymentStatus: (order.status === 'aprovado') ? 'paid' :
                (order.status === 'cancelado') ? 'failed' : 'pending',
        }));

        return res.status(200).json(formattedOrders);

    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
}

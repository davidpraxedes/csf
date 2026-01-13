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
            // pixCopiado: order.pixCopiado,
            // pixCopiadoEm: order.pixCopiadoEm,
            rg: order.rg,
            // Fotos não são enviadas na listagem para performance
            documentPhotoFront: null,
            documentPhotoBack: null,
            // Flags para saber se tem foto
            hasPhotoFront: false, // Prisma select doesn't support 'exists', would need separate check or assume mostly null if avoiding read.
            // Correction: we can't easily know if it has photo without reading it or having a separate column. 
            // For now, let's assume false or create a computed field if schema had 'hasPhoto'.
            // Given performance is priority, we skip flags or read partial if possible (Prisma doesn't support partial read of select column).
            // Let's drop flags for list view to save speed.
            // hasPhotoFront: true, // Removed misleading hardcoded value
            // hasPhotoBack: true,

            paymentStatus: (order.status === 'aprovado') ? 'paid' :
                (order.status === 'cancelado') ? 'failed' : 'pending',
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

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
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;

        console.log('📦 [create-order] Recebido payload:', {
            transactionId: data.transactionId,
            cpf: data.cpf,
            rg: data.rg,
            frontPhotoSize: data.documentPhotoFront ? data.documentPhotoFront.length : 0,
            backPhotoSize: data.documentPhotoBack ? data.documentPhotoBack.length : 0
        });

        // Validar se já existe
        const existing = await prisma.order.findUnique({
            where: { transactionId: data.transactionId }
        });

        if (existing) {
            return res.status(200).json(existing);
        }

        // Criar pedido
        const order = await prisma.order.create({
            data: {
                transactionId: data.transactionId,
                status: data.status || 'pendente',
                nomeCompleto: data.nomeCompleto,
                cpf: data.cpf,
                email: data.email,
                telefone: data.telefone,
                dataNascimento: data.dataNascimento,
                profissao: data.profissao,
                salario: data.salario,
                nomeMae: data.nomeMae,

                cep: data.endereco?.cep || '',
                logradouro: data.endereco?.logradouro || '',
                numero: data.endereco?.numero || '',
                complemento: data.endereco?.complemento,
                bairro: data.endereco?.bairro || '',
                cidade: data.endereco?.cidade || '',
                estado: data.endereco?.estado || '',

                valorEntrega: parseFloat(data.valorEntrega || 0),
                pixCode: data.pixCode,
                pixQrCode: data.pixQrCode,

                rg: data.rg,
                documentPhotoFront: data.documentPhotoFront, // Base64 Text
                documentPhotoBack: data.documentPhotoBack    // Base64 Text
            }
        });

        return res.status(201).json(order);
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        return res.status(500).json({ error: 'Erro interno ao criar pedido', details: error.message });
    }
}

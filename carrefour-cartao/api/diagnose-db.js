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
    // Basic formatting for browser text viewing
    res.setHeader('Content-Type', 'text/plain');

    try {
        const totalOrders = await prisma.order.count();

        // Count photo fields that are "valid" (not null, not empty strings)
        // Note: checking for length > 20 to avoid "empty" base64 garbage
        const photosFront = await prisma.order.count({
            where: {
                documentPhotoFront: { not: null },
                AND: { documentPhotoFront: { not: '' } }
            }
        });

        const photosBack = await prisma.order.count({
            where: {
                documentPhotoBack: { not: null },
                AND: { documentPhotoBack: { not: '' } }
            }
        });

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                transactionId: true,
                createdAt: true,
                documentPhotoFront: true
            }
        });

        let detailedLog = recentOrders.map(o => {
            const size = o.documentPhotoFront ? o.documentPhotoFront.length : 0;
            return `ID: ${o.transactionId} | Data: ${o.createdAt.toISOString()} | Foto Frente: ${size > 0 ? (size / 1024).toFixed(1) + 'KB' : 'NAO TEM'}`;
        }).join('\n');

        return res.status(200).send(`
DIAGNOSTICO DO BANCO DE DADOS:
--------------------------------
Total de Compras: ${totalOrders}
Compras tem foto frente: ${photosFront}
Compras tem foto verso: ${photosBack}

ULTIMOS 5 PEDIDOS:
${detailedLog}
        `);

    } catch (error) {
        return res.status(500).send('Erro ao ler banco: ' + error.message);
    }
}

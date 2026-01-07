
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
    try {
        console.log('🧹 Cleaning up orders via API...');

        // 1. Encontrar pedido da Ana Karoline
        const anaOrder = await prisma.order.findFirst({
            where: {
                nomeCompleto: {
                    contains: 'Ana Karoline',
                    mode: 'insensitive'
                }
            }
        });

        let deletedCount = 0;
        if (anaOrder) {
            console.log(`✅ Pedido da Ana Karoline encontrado: ${anaOrder.id}`);
            const result = await prisma.order.deleteMany({
                where: {
                    id: { not: anaOrder.id }
                }
            });
            deletedCount = result.count;
        } else {
            console.log('⚠️ Pedido da Ana Karoline NÃO encontrado.');
            // Se não achar Ana Karoline na produção, melhor NÃO apagar tudo sem confirmação visual ou params.
            // Mas o user pediu "remove os pedidos que existe, deixa so o da ana karoline".
            // Para segurança, vou exigir um query param ?confirm=true se não achar a Ana.
            // Ou melhor, vou logar apenas.
            if (req.query.force === 'true') {
                const result = await prisma.order.deleteMany({});
                deletedCount = result.count;
            } else {
                return res.json({ message: 'Ana Karoline not found. Pass ?force=true to delete all.' });
            }
        }

        console.log(`🗑️ ${deletedCount} pedidos removidos.`);
        return res.status(200).json({ success: true, deleted: deletedCount, kept: anaOrder?.id });

    } catch (error) {
        console.error('❌ Erro no cleanup API:', error);
        return res.status(500).json({ error: error.message });
    }
}

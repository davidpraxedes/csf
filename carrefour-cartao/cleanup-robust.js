
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar dotenv com caminho absoluto para garantir
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Using Database URL:', process.env.DATABASE_URL ? 'FOUND' : 'MISSING');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🧹 Cleaning up orders...');

        // 1. Encontrar pedido da Ana Karoline
        const anaOrder = await prisma.order.findFirst({
            where: {
                nomeCompleto: {
                    contains: 'Ana Karoline',
                    mode: 'insensitive'
                }
            }
        });

        if (anaOrder) {
            console.log(`✅ Pedido da Ana Karoline encontrado: ${anaOrder.id}`);
            // 2. Apagar todos EXCETO o dela
            const deleteResult = await prisma.order.deleteMany({
                where: {
                    id: {
                        not: anaOrder.id
                    }
                }
            });
            console.log(`🗑️ ${deleteResult.count} pedidos antigos removidos.`);
        } else {
            console.log('⚠️ Pedido da Ana Karoline NÃO encontrado. Mantendo dados existentes por segurança.');
            const allOrders = await prisma.order.count();
            console.log(`Total de pedidos no banco: ${allOrders}`);
        }

    } catch (e) {
        console.error('Erro no cleanup:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
